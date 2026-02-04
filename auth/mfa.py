import random
from flask import session, jsonify

def generate_otp():
    otp = str(random.randint(100000, 999999))
    session["otp"] = otp
    print(f"\n🔥 OTP for admin login: {otp}\n")
    return otp

def verify_otp(user_input):
    stored = session.get("otp")
    print(f"DEBUG: Stored OTP: {stored} (type: {type(stored)}), Input: {user_input} (type: {type(user_input)})")
    if not stored:
        return False
    return str(stored) == str(user_input)
