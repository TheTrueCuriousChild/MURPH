import json
import re
import collections
import google.generativeai as genai

API_KEY = "AIzaSyBPSx9cJEAXcQ5kUbpEgCfgohheNeC8CdA"
LECTURE_FILE = "lecture_input.json"
OUTPUT_JSON = "recommended_output.json"

genai.configure(api_key=API_KEY)


# ------------------------------------------------------------
# Find a Gemini model that actually works for this account
# ------------------------------------------------------------

def find_working_model():
    models = genai.list_models()
    for m in models:
        if "generateContent" in m.supported_generation_methods:
            return m.name
    raise RuntimeError("No Gemini model with generateContent is available.")


# ------------------------------------------------------------
# Load lectures
# ------------------------------------------------------------

def load_lectures():

    with open(LECTURE_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    lectures = []

    for course in data["courses"]:
        for lec in course["lectures"]:
            lectures.append({
                "course": course["course_name"],
                "lecture_id": lec["lecture_id"],
                "title": lec["title"],
                "faculty": lec.get("faculty", "Unknown Faculty"),
                "transcript": lec["transcript"]
            })

    return lectures


# ------------------------------------------------------------
# Gemini recommendation
# ------------------------------------------------------------

def gemini_recommend_lectures(user_query, lectures, top_k=3):

    model_name = find_working_model()
    print(f"\n[Gemini model in use: {model_name}]")

    model = genai.GenerativeModel(model_name)

    available = [
        {
            "lecture_id": l["lecture_id"],
            "title": l["title"],
            "course": l["course"]
        }
        for l in lectures
    ]

    prompt = f"""
You are a course recommendation system.

The student query is:
"{user_query}"

You are ONLY allowed to choose from the following lectures:

{json.dumps(available, indent=2)}

Return ONLY a JSON object in this format:

{{
  "recommended_lecture_ids": ["ID1","ID2","ID3"]
}}

Choose at most {top_k} lecture ids.
Do NOT invent any ids.
"""

    response = model.generate_content(
        prompt,
        generation_config={
            "temperature": 0.2,
            "max_output_tokens": 512
        }
    )

    raw = response.text.strip()

    if raw.startswith("```"):
        raw = raw.replace("```json", "").replace("```", "").strip()

    data = json.loads(raw)

    return data["recommended_lecture_ids"]


# ------------------------------------------------------------
# Checklist extractor (local – no transcript leakage)
# ------------------------------------------------------------

def extract_checklist(transcript, k=6):

    text = transcript.lower()
    words = re.findall(r"[a-zA-Z]{4,}", text)

    stop = {
        "this","that","with","from","they","have","will","your","about",
        "what","when","where","which","would","there","their","them",
        "because","into","while","these","those","only","also","very"
    }

    words = [w for w in words if w not in stop]

    counter = collections.Counter(words)

    return [w for w, _ in counter.most_common(k)]


# ------------------------------------------------------------
# Final output builder
# ------------------------------------------------------------

def build_recommendation_output(lectures, selected_ids):

    selected = [l for l in lectures if l["lecture_id"] in selected_ids]

    results = []

    for lec in selected:
        results.append({
            "lecture_id": lec["lecture_id"],
            "course": lec["course"],
            "title": lec["title"],
            "faculty": lec["faculty"],
            "checklist": extract_checklist(lec["transcript"])
        })

    return results


# ------------------------------------------------------------
# Pretty terminal view
# ------------------------------------------------------------

def print_terminal_view(recommendations):

    print("\nRecommended lectures:\n")

    for r in recommendations:
        print(f"{r['title']} by {r['faculty']}")
        print("here is a checklist of topics")

        for t in r["checklist"]:
            print(t)

        print()


# ------------------------------------------------------------
# Conversational loop
# ------------------------------------------------------------

def main():

    lectures = load_lectures()

    print("\nMicro course assistant (Gemini powered)")
    print("Ask what you want to study. Type 'exit' to quit.\n")

    while True:

        user_query = input("Student: ").strip()

        if not user_query:
            continue

        if user_query.lower() == "exit":
            print("Exiting.")
            break

        try:
            ids = gemini_recommend_lectures(user_query, lectures)

            recommendations = build_recommendation_output(
                lectures,
                ids
            )

            print_terminal_view(recommendations)

            out_json = {
                "query": user_query,
                "recommended_lectures": recommendations
            }

            with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
                json.dump(out_json, f, indent=2, ensure_ascii=False)

            print("Saved JSON:", OUTPUT_JSON)

        except Exception as e:
            print("Recommendation failed:", e)


if __name__ == "__main__":
    main()
