from database.db import get_db

def verify_receipt(receipt):
    conn = get_db()

    topic = conn.execute(
        "SELECT * FROM topics WHERE receipt=?",
        (receipt,)
    ).fetchone()

    if not topic:
        return {
            "status": "invalid",
            "message": "Receipt not found"
        }

    return {
        "status": "valid",
        "message": "Receipt verified",
        "student_id": topic["student_id"],
        "timestamp": topic["timestamp"],
        "status_topic": topic["status"]
    }
