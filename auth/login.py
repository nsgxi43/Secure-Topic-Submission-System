from flask import request, session, jsonify
from database.db import get_db
from crypto.hashing import verify_password
from auth.mfa import generate_otp


def login_user():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE username=?",
        (username,)
    ).fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not verify_password(password, user["password_hash"], user["salt"]):
        return jsonify({"error": "Invalid password"}), 401

    # 🔐 Admin requires MFA
    if user["role"] == "admin":
        generate_otp()
        session["pending_admin"] = user["id"]
        return jsonify({"message": "OTP required for admin login"})

    session["user_id"] = user["id"]
    session["role"] = user["role"]

    return jsonify({"message": "Login successful", "role": user["role"]})

from auth.mfa import verify_otp

def verify_admin_otp():
    data = request.json
    otp = data.get("otp")

    if not verify_otp(otp):
        return jsonify({"error": "Invalid OTP"}), 401

    user_id = session.get("pending_admin")

    session["user_id"] = user_id
    session["role"] = "admin"
    session.pop("pending_admin", None)

    return jsonify({"message": "Admin login successful"})
