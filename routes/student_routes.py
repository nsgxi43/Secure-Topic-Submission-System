from flask import Blueprint, jsonify, request, session
from rbac.access_control import require_permission
from services.topic_service import submit_topic
from routes.admin_routes import is_system_locked
from services.receipt_service import verify_receipt
from services.email_service import generate_and_store_otp, send_otp_email
from database.db import get_db
import time
from crypto.hashing import verify_password

student_bp = Blueprint("student", __name__)

@student_bp.route("/student/dashboard")
@require_permission("view_own")
def student_dashboard():
    return jsonify({"message": "Student dashboard access granted"})

@student_bp.route("/student/submit", methods=["POST"])
@require_permission("submit_topic")
def submit():
    if is_system_locked():
        return jsonify({"error": "System locked. Submission closed"}), 403
    
    print(f"DEBUG: submit endpoint hit. Session: {session}")
    topic = request.json.get("topic")
    user_id = session.get("user_id")
    print(f"DEBUG: user_id: {user_id}, topic: {topic}")
    return submit_topic(user_id, topic)

@student_bp.route("/student/request-otp", methods=["POST"])
def request_otp():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    # Verify password first
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ? AND role = 'student'", (email,)).fetchone()
    
    if not user or not verify_password(password, user["password_hash"], user["salt"]):
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Generate and send OTP
    otp = generate_and_store_otp(email)
    if send_otp_email(email, otp):
        return jsonify({"message": "OTP sent to your email"})
    else:
        return jsonify({"error": "Failed to send OTP"}), 500

@student_bp.route("/student/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")
    
    if not email or not otp:
        return jsonify({"error": "Email and OTP required"}), 400
    
    conn = get_db()
    
    # Get stored OTP
    otp_record = conn.execute(
        "SELECT * FROM email_otps WHERE email = ?", (email,)
    ).fetchone()
    
    if not otp_record:
        return jsonify({"error": "No OTP found for this email"}), 400
    
    # Check expiry
    if time.time() > otp_record["expiry"]:
        return jsonify({"error": "OTP has expired"}), 400
    
    # Verify OTP
    from crypto.hashing import verify_password
    if not verify_password(otp.strip(), otp_record["otp_hash"], otp_record["otp_salt"]):
        return jsonify({"error": "Invalid OTP"}), 401
    
    # Get user and create session
    user = conn.execute("SELECT * FROM users WHERE username = ? AND role = 'student'", (email,)).fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    session["user_id"] = user["id"]
    session["role"] = user["role"]
    
    # Clean up OTP
    conn.execute("DELETE FROM email_otps WHERE email = ?", (email,))
    conn.commit()
    
    return jsonify({"message": "Login successful", "role": "student"})

@student_bp.route("/receipt/<receipt>")
def receipt_check(receipt):
    return verify_receipt(receipt)