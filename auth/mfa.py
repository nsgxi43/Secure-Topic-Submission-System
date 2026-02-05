import random
from flask import session, jsonify

def generate_otp():
    otp = str(random.randint(100000, 999999))
    session["otp"] = otp
    print(f"\n🔥 OTP for admin login: {otp}\n")
    return otp

def verify_otp(user_input):
    stored = session.get("otp")
    # Strip whitespace to handle extra spaces
    user_input_clean = str(user_input).strip()
    stored_clean = str(stored).strip() if stored else ""
    
    print(f"DEBUG: Stored OTP: '{stored_clean}', Input: '{user_input_clean}'")
    
    if not stored:
        return False
    return stored_clean == user_input_clean