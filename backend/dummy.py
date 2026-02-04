import json
import numpy as np

import lightgbm as lgb


# -------------------------------------------------------
# Utility
# -------------------------------------------------------

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))


# -------------------------------------------------------
# STUDENT VALIDATION
# -------------------------------------------------------

STUDENT_FEATURE_ORDER = [
    "completion_ratio",
    "normalized_time_spent",
    "interaction_count",
    "active_ratio",
    "idle_ratio",
    "rating_given",
    "time_to_review_sec",
    "student_avg_completion",
    "student_extreme_ratio",
    "session_avg_completion",
    "session_avg_rating"
]


def build_student_vector(sf):

    return np.array(
        [float(sf.get(k, 0.0)) for k in STUDENT_FEATURE_ORDER],
        dtype=np.float32
    )


# bootstrapped credibility label
def student_bootstrap_label(sf):

    if sf.get("completion_ratio", 0) > 0.4 and \
       sf.get("normalized_time_spent", 0) > 0.4 and \
       sf.get("time_to_review_sec", 999) > 20:
        return 1
    return 0


def run_student_validation(student_features):

    X = []
    y = []

    # single sample – duplicated to make LightGBM train
    for _ in range(10):
        X.append(build_student_vector(student_features))
        y.append(student_bootstrap_label(student_features))

    X = np.vstack(X)
    y = np.array(y)

    train = lgb.Dataset(X, label=y)

    params = {
        "objective": "binary",
        "learning_rate": 0.05,
        "num_leaves": 15,
        "min_data_in_leaf": 1,
        "verbosity": -1
    }

    model = lgb.train(params, train, num_boost_round=25)

    score = model.predict(X[:1])[0]

    return float(score)


# -------------------------------------------------------
# TEACHER VALIDATION
# -------------------------------------------------------

TEACHER_FEATURE_ORDER = [
    "mean_completion",
    "dropoff_slope",
    "coverage_ratio",
    "rewind_rate",
    "pause_rate",
    "weighted_avg_rating",
    "rating_variance",
    "price_percentile",
    "price_vs_completion"
]


def build_teacher_vector(tf):

    return np.array(
        [float(tf.get(k, 0.0)) for k in TEACHER_FEATURE_ORDER],
        dtype=np.float32
    )


# bootstrapped quality label
def teacher_quality_label(tf):

    score = (
        0.4 * tf.get("mean_completion", 0) +
        0.3 * (tf.get("weighted_avg_rating", 0) / 5.0) +
        0.3 * tf.get("coverage_ratio", 0)
    )

    return score


# bootstrapped pricing trust label
def teacher_pricing_label(tf):

    base = teacher_quality_label(tf)

    penalty = 0.0
    if tf.get("price_vs_completion", 1.0) > 1.3:
        penalty = 0.2

    return max(0.0, base - penalty)


def run_teacher_validation(teacher_features):

    X = []
    y_quality = []
    y_pricing = []

    for _ in range(12):

        X.append(build_teacher_vector(teacher_features))

        y_quality.append(
            teacher_quality_label(teacher_features)
        )

        y_pricing.append(
            teacher_pricing_label(teacher_features)
        )

    X = np.vstack(X)

    y_quality = np.array(y_quality)
    y_pricing = np.array(y_pricing)

    d_quality = lgb.Dataset(X, label=y_quality)
    d_pricing = lgb.Dataset(X, label=y_pricing)

    params = {
        "objective": "regression",
        "learning_rate": 0.05,
        "num_leaves": 20,
        "min_data_in_leaf": 1,
        "verbosity": -1
    }

    model_quality = lgb.train(params, d_quality, num_boost_round=40)
    model_pricing = lgb.train(params, d_pricing, num_boost_round=40)

    q = model_quality.predict(X[:1])[0]
    p = model_pricing.predict(X[:1])[0]

    q = max(0.0, min(1.0, float(q)))
    p = max(0.0, min(1.0, float(p)))

    return q, p


# -------------------------------------------------------
# MAIN ENGINE
# -------------------------------------------------------

if __name__ == "__main__":

    INPUT_FILE = "validation_input.json"
    OUTPUT_FILE = "validation_output.json"

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    mode = data.get("mode")

    if mode == "student_validation":

        score = run_student_validation(
            data["student_features"]
        )

        output = {
            "student_credibility_score": round(score, 4)
        }

    elif mode == "teacher_validation":

        q, p = run_teacher_validation(
            data["teacher_features"]
        )

        output = {
            "teacher_quality_score": round(q, 4),
            "teacher_pricing_trust_score": round(p, 4)
        }

    else:
        raise ValueError("Unknown mode in validation input JSON")

    print(json.dumps(output, indent=2))

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print("\nSaved:", OUTPUT_FILE)
