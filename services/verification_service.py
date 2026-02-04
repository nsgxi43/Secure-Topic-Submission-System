from database.db import get_db
from crypto.encoding import decode_data
from crypto.signature import verify_signature
from services.audit_service import log_action

from cryptography.hazmat.primitives import serialization


def verify_topic(topic_id):
    conn = get_db()

    topic = conn.execute(
        "SELECT * FROM topics WHERE id=?",
        (topic_id,)
    ).fetchone()

    if not topic:
        return {"error": "Topic not found"}

    user = conn.execute(
        "SELECT * FROM users WHERE id=?",
        (topic["student_id"],)
    ).fetchone()

    # Load public key
    pub_bytes = decode_data(user["public_key"])
    public_key = serialization.load_pem_public_key(pub_bytes)

    # Verify signature
    valid = verify_signature(
    public_key,
    topic["secure_hash"],
    decode_data(topic["signature"])
)

    log_action(user["id"], "Verified topic")
    if valid:
        return {"status": "valid", "message": "Signature verified"}
    else:
        return {"status": "invalid", "message": "Tampering detected"}
