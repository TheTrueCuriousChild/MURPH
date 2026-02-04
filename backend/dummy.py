import re
import json

def tokenize(text):
    return set(re.findall(r"[a-zA-Z]+", text.lower()))

def average_rating(reviews):
    if not reviews:
        return 0.0
    return sum(r["rating"] for r in reviews) / len(reviews)


def simple_recommender(input_json):

    query_tokens = tokenize(input_json["query"])

    user = input_json["user"]

    results = []

    for s in input_json["sessions"]:

        content_tokens = tokenize(
            s["title"] + " " + s["content_text"]
        )

        # very simple text overlap
        text_score = len(query_tokens & content_tokens) / max(len(query_tokens), 1)

        # review signal
        avg_rating = average_rating(s["reviews"]) / 5.0

        # category preference
        category_match = 1.0 if s["category"] in user["preferred_categories"] else 0.0

        # beginner bias for beginners
        beginner_bonus = 0.0
        if s["difficulty"] == "beginner":
            beginner_bonus = 0.1

        # previous teacher familiarity
        teacher_bonus = 0.0
        if s["teacher_id"] in user["previous_teachers"]:
            teacher_bonus = 0.1

        # final dummy score
        score = (
            0.5 * text_score +
            0.3 * avg_rating +
            0.1 * category_match +
            beginner_bonus +
            teacher_bonus
        )

        results.append({
            "session_id": s["session_id"],
            "title": s["title"],
            "teacher_id": s["teacher_id"],
            "price_per_min": s["price_per_min"],
            "rank_score": round(score, 4),
            "debug": {
                "text_score": round(text_score, 4),
                "avg_rating": round(avg_rating, 4),
                "category_match": category_match,
                "teacher_bonus": teacher_bonus
            }
        })

    results.sort(key=lambda x: x["rank_score"], reverse=True)

    return {
        "query": input_json["query"],
        "user_id": user["user_id"],
        "results": results
    }


# ------------------------------
# Only this part is new
# ------------------------------
if __name__ == "__main__":

    dummy_input = {
        "query": "i want to learn guitar basics",
        "user": {
            "user_id": "U101",
            "age_bucket": 1,
            "education_level": "college",
            "degree": "mechanical engineering",
            "year_of_study": 2,
            "preferred_categories": ["music"],
            "previous_sessions": ["S10"],
            "previous_teachers": ["T1"]
        },
        "sessions": [
            {
                "session_id": "S10",
                "title": "Guitar basics for absolute beginners",
                "teacher_id": "T1",
                "category": "music",
                "difficulty": "beginner",
                "price_per_min": 0.3,
                "content_text": "This session teaches basic guitar chords, strumming patterns and finger positioning.",
                "reviews": [
                    {"rating": 5, "text": "Very clear explanation of chords"},
                    {"rating": 4, "text": "Good beginner session"}
                ]
            },
            {
                "session_id": "S11",
                "title": "Advanced guitar solo techniques",
                "teacher_id": "T2",
                "category": "music",
                "difficulty": "advanced",
                "price_per_min": 0.6,
                "content_text": "Learn advanced guitar solos, scales and improvisation techniques.",
                "reviews": [
                    {"rating": 5, "text": "Great for experienced players"},
                    {"rating": 4, "text": "Fast paced session"}
                ]
            },
            {
                "session_id": "S12",
                "title": "Introduction to piano",
                "teacher_id": "T3",
                "category": "music",
                "difficulty": "beginner",
                "price_per_min": 0.25,
                "content_text": "This session introduces piano basics and finger exercises.",
                "reviews": [
                    {"rating": 4, "text": "Nice introduction"},
                    {"rating": 3, "text": "Could be more detailed"}
                ]
            }
        ]
    }

    output = simple_recommender(dummy_input)

    print("\n========== Recommendation Output ==========\n")
    print(json.dumps(output, indent=2))
    print("\n===========================================\n")
