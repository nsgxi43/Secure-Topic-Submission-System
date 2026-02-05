
import smtplib
from email.mime.text import MIMEText
import os
import secrets
import time
from database.db import get_db
from crypto.hashing import hash_with_salt


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "nsgxi43@gmail.com"

GMAIL_APP_PASSWORD = os.getenv("MAIL_PASSWORD") or "tguj ppgw fnlq pfnu" 

def send_otp_email(to_email, otp_code):
    if not GMAIL_APP_PASSWORD:
        print("❌ ERROR: MAIL_PASSWORD environment variable not set. Cannot send email.")
        return False
        
    subject = "Your CYS Login OTP"
    body = f"Hello Student,\n\nYour secure One-Time Password (OTP) for login is:\n\n{otp_code}\n\nThis OTP expires in 5 minutes.\nDo not share this with anyone."
    
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, GMAIL_APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
        print(f"✅ OTP sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

def generate_and_store_otp(email):
    # random 6 digit
    otp = "".join([str(secrets.randbelow(10)) for _ in range(6)])
    
    # Expiry 5 mins from now
    expiry = time.time() + (5 * 60)
    
    # Secure hash
    otp_hash, salt = hash_with_salt(otp)
    
    conn = get_db()
    # Upsert logic (replace if exists)
    conn.execute("INSERT OR REPLACE INTO email_otps (email, otp_hash, otp_salt, expiry) VALUES (?, ?, ?, ?)",
                 (email, otp_hash, salt, expiry))
    conn.commit()
    
    return otp
