import json
import time
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted


# -------------------------------------------------------
# API key
# -------------------------------------------------------

API_KEY = "AIzaSyCwjd-jx9yhCA7OTxliS7d7lZUH_rMT7ls"


# -------------------------------------------------------
# Gemini setup
# -------------------------------------------------------

if not API_KEY:
    raise RuntimeError("Please paste your Gemini API key in API_KEY")

genai.configure(api_key=API_KEY)


# -------------------------------------------------------
# Pick a free / available model that supports generateContent
# -------------------------------------------------------

def pick_free_text_model():
    usable = []

    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            usable.append(m.name)

    if not usable:
        raise RuntimeError("No generateContent-capable models available.")

    # Prefer light / flash models if present
    for name in usable:
        lname = name.lower()
        if "flash" in lname or "lite" in lname or "text" in lname:
            return name

    return usable[0]


# -------------------------------------------------------
# Prompt builder
# -------------------------------------------------------

def build_prompt(lecture_json):

    lecture_text = lecture_json["lecture_text"]

    return f"""
From the lecture text below, generate exactly 6 multiple-choice questions.

Rules:
- Use ONLY the given lecture text.
- Do NOT use outside knowledge.
- Questions must be ordered from easiest to hardest.
- Each question must test a different concept.
- Each question must have exactly 4 options.
- Exactly one option must be correct.
- The correct answer must exactly match one option.

Return ONLY valid JSON in this format. Do not write any text outside JSON.

{{
  "generated_questions": [
    {{
      "question_id": 1,
      "difficulty": "easy|medium|hard",
      "question": "...",
      "options": ["...","...","...","..."],
      "correct_answer": "...",
      "answer_type": "mcq"
    }}
  ]
}}

Lecture:
\"\"\"{lecture_text}\"\"\"
"""


# -------------------------------------------------------
# Gemini call
# -------------------------------------------------------

def generate_questions(lecture_json):

    model_name = pick_free_text_model()
    print("Using model:", model_name)

    model = genai.GenerativeModel(model_name)
    prompt = build_prompt(lecture_json)

    max_retries = 2
    base_delay = 5
    last_exception = None

    for attempt in range(max_retries):
        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.2,

                    # give enough room so the JSON is not cut
                    "max_output_tokens": 2048,

                    # force JSON mode (very important)
                    "response_mime_type": "application/json"
                }
            )

            raw = response.text.strip()

            # Now the model is required to return JSON only
            data = json.loads(raw)

            return {
                "lecture_id": lecture_json.get("lecture_id"),
                "title": lecture_json.get("title", ""),
                "generated_questions": data["generated_questions"]
            }

        except json.JSONDecodeError as e:
            # Most common cause: output was truncated
            print("\nModel returned invalid / truncated JSON. Retrying once...")
            last_exception = e
            time.sleep(1)

        except ResourceExhausted as e:
            print(f"\nQuota exceeded (attempt {attempt + 1}/{max_retries}).")

            retry_after = None
            try:
                retry_after = e.retry_delay.seconds
            except Exception:
                pass

            last_exception = e

            if retry_after:
                time.sleep(retry_after)
            else:
                time.sleep(base_delay)

        except Exception as e:
            print("\nError during generation:", e)
            raise

    raise RuntimeError(
        "Failed to obtain valid JSON from the model."
    ) from last_exception


# -------------------------------------------------------
# Main
# -------------------------------------------------------

if __name__ == "__main__":

    INPUT_FILE = "lecture_input.json"
    OUTPUT_FILE = "generated_questions.json"

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        lecture_json = json.load(f)

    result = generate_questions(lecture_json)

    print(json.dumps(result, indent=2, ensure_ascii=False))

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print("\nSaved to:", OUTPUT_FILE)
