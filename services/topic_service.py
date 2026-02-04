import datetime
from database.db import get_db
from crypto.receipt import generate_receipt

from crypto.hashing import hash_with_salt, deterministic_hash
from crypto.encryption import encrypt_data
from crypto.encoding import encode_data, decode_data
from crypto.signature import sign_data
from services.audit_service import log_action

from cryptography.hazmat.primitives import serialization


def submit_topic(user_id, topic_text):
    conn = get_db()

    timestamp = datetime.datetime.now().isoformat()

    # 🔥 deterministic hash for duplicate detection
    # Extract only the topic title (ignore description) for uniqueness check
    if " - " in topic_text:
        topic_title_only = topic_text.split(" - ", 1)[0]
    else:
        topic_title_only = topic_text

    dup_hash = deterministic_hash(topic_title_only.strip().lower())

    existing = conn.execute(
        "SELECT * FROM topics WHERE topic_hash=?",
        (dup_hash,)
    ).fetchone()

    if existing:
        return {"error": "Topic is taken, please choose another"}, 409

    # 🔐 salted secure hash for signature integrity
    secure_hash, salt = hash_with_salt(topic_text)

    # 🧾 generate receipt
    receipt = generate_receipt(topic_text, secure_hash, timestamp, user_id)

    # 🔑 load user's stored private key
    user = conn.execute(
        "SELECT * FROM users WHERE id=?",
        (user_id,)
    ).fetchone()

    if not user:
        return {"error": "User session invalid. Please insert your card (login) again."}, 401

    priv_bytes = decode_data(user["private_key"])
    private_key = serialization.load_pem_private_key(
        priv_bytes,
        password=None
    )

    # ✍️ sign using user's key
    signature = sign_data(private_key, secure_hash)

    # 🔒 encrypt topic
    encrypted, key, iv = encrypt_data(topic_text)
    encoded_topic = encode_data(encrypted)

    conn.execute("""
        INSERT INTO topics
        (encrypted_topic, encrypted_key, iv, topic_hash, secure_hash,
         signature, receipt, student_id, timestamp, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        encoded_topic,
        encode_data(key),
        encode_data(iv),
        dup_hash,
        secure_hash,
        encode_data(signature),
        receipt,
        user_id,
        timestamp,
        "reserved"
    ))

    conn.commit()

    # 🧾 audit log
    log_action(user_id, "Submitted topic")

    return {
        "message": "Topic submitted securely",
        "receipt": receipt
    }, 201
