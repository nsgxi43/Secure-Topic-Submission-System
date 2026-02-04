from database.db import get_db
from crypto.encryption import decrypt_data
from crypto.encoding import decode_data
from crypto.hashing import deterministic_hash

import re

def list_topics():
    conn = get_db()

    # Join with users to get email
    topics = conn.execute("""
        SELECT t.student_id, t.timestamp, t.status, t.receipt, 
               t.encrypted_topic, t.encrypted_key, t.iv, t.topic_hash,
               u.username as email
        FROM topics t
        JOIN users u ON t.student_id = u.id
        ORDER BY t.timestamp ASC
    """).fetchall()

    results = []
    for row in topics:
        
        # 🎓 Extract Clean Student ID from Email
        # Format: cb.sc.u4cse23538@cb.students.amrita.edu -> 23538
        raw_email = row["email"]
        student_display_id = str(row["student_id"]) # Fallback
        
        # Regex to find the pattern "u4cse" followed by digits
        match = re.search(r'u4cse(\d+)', raw_email)
        if match:
            student_display_id = match.group(1)
        else:
             # simple fallback: use the part of email before @ if pattern not found
            if "@" in raw_email:
                 student_display_id = raw_email.split("@")[0]

        try:
            # Decrypt topic content
            enc_topic = decode_data(row["encrypted_topic"])
            key = decode_data(row["encrypted_key"])
            iv = decode_data(row["iv"])
            
            decrypted_bytes = decrypt_data(enc_topic, key, iv)
            full_topic = decrypted_bytes.decode()

            # Parse "Title - Description"
            if " - " in full_topic:
                parts = full_topic.split(" - ", 1)
                topic_name = parts[0]
                description = parts[1]
            else:
                topic_name = full_topic
                description = ""

            # 🔍 Verify Integrity (Check if content matches the duplicate hash)
            # This is a basic integrity check. If the text was tampered, this hash won't match.
            current_hash = deterministic_hash(topic_name.strip().lower())
            is_valid = current_hash == row["topic_hash"]

            final_status = row["status"]
            if not is_valid:
                final_status = "tampered"

            results.append({
                "student_id": student_display_id, 
                "topic_name": topic_name,
                "description": description,
                "receipt_id": row["receipt"],
                "status": final_status,
                "timestamp": row["timestamp"],
                "is_valid": is_valid
            })
        except Exception as e:
            print(f"Decryption failed for topic: {e}")
            results.append({
                "student_id": student_display_id,
                "topic_name": "Decryption Failed",
                "description": "Error decrypting content",
                "receipt_id": row["receipt"],
                "status": "error",
                "is_valid": False
            })

    return {
        "topics": results
    }

import io
import csv

def export_topics_csv():
    data = list_topics()["topics"]
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(["Student ID", "Topic", "Description", "Receipt", "Status", "Timestamp"])
    
    for row in data:
        writer.writerow([
            row["student_id"],
            row["topic_name"],
            row["description"],
            row["receipt_id"],
            row["status"],
            row["timestamp"]
        ])
        
    return output.getvalue()
