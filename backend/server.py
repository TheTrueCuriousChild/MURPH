import json
import re
import collections
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

import google.generativeai as genai


# ------------------------------------------------------------
# CONFIG
# ------------------------------------------------------------

API_KEY = "AIzaSyBPSx9cJEAXcQ5kUbpEgCfgohheNeC8CdA"
LECTURE_FILE = "lecture_input.json"

genai.configure(api_key=API_KEY)

app = FastAPI(
    title="Micro Course Recommendation API",
    version="1.0"
)


# ------------------------------------------------------------
# Models
# ------------------------------------------------------------

class RecommendRequest(BaseModel):
    query: str
    top_k: int = 3


class ChecklistLecture(BaseModel):
    lecture_id: str
    course: str
    title: str
    faculty: str
    checklist: List[str]


class RecommendResponse(BaseModel):
    query: str
    recommended_lectures: List[ChecklistLecture]


# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

def find_working_model():

    models = genai.list_models()

    for m in models:
        if "generateContent" in m.supported_generation_methods:
            return m.name

    raise RuntimeError("No Gemini model with generateContent available.")


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
# Gemini constrained recommender
# ------------------------------------------------------------

def gemini_recommend_lectures(user_query, lectures, top_k):

    model_name = find_working_model()

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
# API Endpoint
# ------------------------------------------------------------

@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):

    try:
        lectures = load_lectures()

        if not lectures:
            raise HTTPException(status_code=500, detail="No lectures loaded.")

        ids = gemini_recommend_lectures(
            req.query,
            lectures,
            req.top_k
        )

        # ---- HARD SAFETY FILTER
        valid_ids = {l["lecture_id"] for l in lectures}
        safe_ids = [i for i in ids if i in valid_ids]

        recommendations = build_recommendation_output(
            lectures,
            safe_ids
        )

        return {
            "query": req.query,
            "recommended_lectures": recommendations
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------------
# Health
# ------------------------------------------------------------

@app.get("/")
def health():
    return {"status": "ok"}
