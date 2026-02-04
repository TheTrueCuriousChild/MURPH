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
# File based input → output
# ------------------------------
if __name__ == "__main__":

    input_file = "input.json"
    output_file = "output.json"

    # Read input JSON from file
    with open(input_file, "r", encoding="utf-8") as f:
        input_json = json.load(f)

    output = simple_recommender(input_json)

    # Print to console
    print("\n========== Recommendation Output ==========\n")
    print(json.dumps(output, indent=2))

    # Export to file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nExported recommendation JSON to: {output_file}\n")
