from flask import Blueprint, jsonify, request, session
from rbac.access_control import require_permission
from services.topic_service import submit_topic
from routes.admin_routes import system_locked
from services.receipt_service import verify_receipt

student_bp = Blueprint("student", __name__)


@student_bp.route("/student/dashboard")
@require_permission("view_own")
def student_dashboard():
    return jsonify({"message": "Student dashboard access granted"})


@student_bp.route("/student/submit", methods=["POST"])
@require_permission("submit_topic")
def submit():
    if system_locked:
        return jsonify({"error": "System locked. Submission closed"}), 403

    print(f"DEBUG: submit endpoint hit. Session: {session}")
    topic = request.json.get("topic")
    user_id = session.get("user_id")
    print(f"DEBUG: user_id: {user_id}, topic: {topic}")

    return submit_topic(user_id, topic)

@student_bp.route("/receipt/<receipt>")
def receipt_check(receipt):
    return verify_receipt(receipt)

from services.email_service import generate_and_store_otp, send_otp_email
from database.db import get_db
import time
from crypto.hashing import verify_password

@student_bp.route("/student/request-otp", methods=["POST"])
def request_otp():
    email = request.json.get("email")
    password = request.json.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and Password required"}), 400
        
    # Check if student exists
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username=? AND role='student'", (email,)).fetchone()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Verify Password first
    if not verify_password(password, user["password_hash"], user["salt"]):
        return jsonify({"error": "Invalid credentials"}), 401
        
    otp = generate_and_store_otp(email)
    
    # Send email
    if send_otp_email(email, otp):
        return jsonify({"message": "Password verified. OTP sent to email."})
    else:
        return jsonify({"error": "Failed to send OTP. Check backend logs."}), 500

@student_bp.route("/student/verify-otp", methods=["POST"])
def verify_otp_route():
    email = request.json.get("email")
    otp_input = request.json.get("otp")
    
    if not email or not otp_input:
        return jsonify({"error": "Missing fields"}), 400
        
    conn = get_db()
    
    # 1. Get OTP record
    otp_record = conn.execute("SELECT * FROM email_otps WHERE email=?", (email,)).fetchone()
    
    if not record_valid(otp_record):
        return jsonify({"error": "Invalid or expired OTP"}), 401
    
    # 2. Verify Hash
    if not verify_password(otp_input, otp_record["otp_hash"], otp_record["otp_salt"]):
        return jsonify({"error": "Invalid OTP code"}), 401
        
    # 3. Check Expiry
    if time.time() > otp_record["expiry"]:
        return jsonify({"error": "OTP Expired"}), 401
        
    # 4. Success -> Log in user
    user = conn.execute("SELECT * FROM users WHERE username=?", (email,)).fetchone()
    
    # Delete used OTP
    conn.execute("DELETE FROM email_otps WHERE email=?", (email,))
    conn.commit()
    
    session["user_id"] = user["id"]
    session["role"] = user["role"]
    
    return jsonify({"message": "Login successful", "role": "student"})

def record_valid(record):
    return record is not None

