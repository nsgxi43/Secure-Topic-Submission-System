import datetime
from database.db import get_db

def log_action(user_id, action):
    conn = get_db()

    timestamp = datetime.datetime.now().isoformat()

    conn.execute(
        "INSERT INTO audit_logs (user_id, action, timestamp) VALUES (?, ?, ?)",
        (user_id, action, timestamp)
    )

    conn.commit()

def get_audit_logs():
    conn = get_db()

    logs = conn.execute("""
        SELECT user_id, action, timestamp
        FROM audit_logs
        ORDER BY timestamp ASC
    """).fetchall()

    return {
        "audit_logs": [dict(row) for row in logs]
    }
