#source cys/bin/activate    
from flask import Flask, request
from database.db import init_db
from auth.register import register_user
from auth.login import login_user

app = Flask(__name__)
from flask_cors import CORS
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False

app.secret_key = "super_secret_key"

@app.before_request
def log_request_info():
    if "/admin/verify-otp" in request.path:
        print(f"DEBUG: Headers: {request.headers}")
        print(f"DEBUG: Cookies: {request.cookies}")

@app.route("/")
def home():
    return "Secure Topic System Running"

@app.route("/register", methods=["POST"])
def register():
    return register_user()

@app.route("/login", methods=["POST"])
def login():
    return login_user()

from crypto.encryption import encrypt_data, decrypt_data
from crypto.encoding import encode_data, decode_data
from crypto.key_management import generate_keys
from crypto.signature import sign_data, verify_signature

@app.route("/crypto-test")
def crypto_test():
    message = "Hello Secure World"

    encrypted, key, iv = encrypt_data(message)
    encoded = encode_data(encrypted)
    decoded = decode_data(encoded)
    decrypted = decrypt_data(decoded, key, iv)

    priv, pub = generate_keys()
    signature = sign_data(priv, message)
    valid = verify_signature(pub, message, signature)

    return {
        "original": message,
        "decrypted": decrypted.decode(),
        "signature_valid": valid
    }


from routes.student_routes import student_bp
from routes.teacher_routes import teacher_bp
from routes.admin_routes import admin_bp

app.register_blueprint(student_bp)
app.register_blueprint(teacher_bp)
app.register_blueprint(admin_bp)

from auth.login import verify_admin_otp

@app.route("/admin/verify-otp", methods=["POST"])
def otp():
    return verify_admin_otp()



if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5001)


