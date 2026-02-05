import json
import time
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, InvalidArgument

# -------------------------------------------------------
# Paste your API key here
# -------------------------------------------------------

API_KEY = "AIzaSyDriXVLBH5m0p6JknzC3CqkobQjoHSgpyg"


# -------------------------------------------------------
# Model configuration
# -------------------------------------------------------

# Switching to flash-latest for better quota availability
MODEL_NAME = "models/gemini-flash-latest"


# -------------------------------------------------------
# Gemini setup
# -------------------------------------------------------

if not API_KEY or API_KEY.startswith("PASTE"):
    raise RuntimeError("Please paste your Gemini API key in API_KEY")

genai.configure(api_key=API_KEY)


# -------------------------------------------------------
# Prompt builder
# -------------------------------------------------------

def build_prompt(lecture_json):

    lecture_text = lecture_json["lecture_text"]

    prompt = f"""
You are an educational question generation system.

You are given the content of a single lecture.

Your task:
Generate exactly 6 questions WITH correct answers.

Rules:
- You MUST use only the information present in the lecture text.
- You MUST NOT use any outside knowledge.
- You MUST NOT introduce concepts not explicitly present in the lecture.
- Questions must be ordered from easiest to hardest.
- Each question must test a different concept.
- Difficulty must increase gradually.

Return ONLY valid JSON in the following structure.

{{
  "generated_questions": [
    {{
      "question_id": 1,
      "difficulty": "easy | medium | hard",
      "question": "...",
      "answer": "...",
      "answer_type": "short_text"
    }}
  ]
}}

Lecture text:
\"\"\"
{lecture_text}
\"\"\"
"""

    return prompt


# -------------------------------------------------------
# Gemini call
# -------------------------------------------------------

def generate_questions(lecture_json):
    model = genai.GenerativeModel(MODEL_NAME)
    prompt = build_prompt(lecture_json)
    
    max_retries = 5
    base_delay = 10  # start with 10s wait

    for attempt in range(max_retries):
        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.3,
                    "max_output_tokens": 8192
                }
            )
            raw = response.text.strip()
            
            # Gemini sometimes wraps JSON in markdown
            if raw.startswith("```"):
                raw = raw.replace("```json", "")
                raw = raw.replace("```", "").strip()

            data = json.loads(raw)

            return {
                "lecture_id": lecture_json.get("lecture_id"),
                "title": lecture_json.get("title", ""),
                "generated_questions": data["generated_questions"]
            }

        except ResourceExhausted as e:
            print(f"\\nQuota exceeded (Attempt {attempt+1}/{max_retries}). Waiting {base_delay}s...")
            time.sleep(base_delay)
            base_delay *= 2  # Exponential backoff
            
        except Exception as e:
            print(f"\\nError during generation: {e}")
            raise e

    raise RuntimeError("Max retries exceeded due to rate limits.")


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
