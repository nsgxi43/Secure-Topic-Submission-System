from flask import request, jsonify
from database.db import get_db
from crypto.hashing import hash_with_salt
from crypto.key_management import generate_keys
from crypto.encoding import encode_data

from cryptography.hazmat.primitives import serialization


def register_user():
    data = request.json

    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    if not username or not password or not role:
        return jsonify({"error": "Missing fields"}), 400

    password_hash, salt = hash_with_salt(password)

    private_key, public_key = generate_keys()

    priv_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    pub_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    conn = get_db()

    try:
        conn.execute(
            """
            INSERT INTO users
            (username, password_hash, salt, role, public_key, private_key)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                username,
                password_hash,
                salt,
                role,
                encode_data(pub_bytes),
                encode_data(priv_bytes)
            )
        )
        conn.commit()

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 400

    return jsonify({"message": "User registered successfully"})
