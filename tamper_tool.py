import sqlite3
import hashlib
from crypto.encoding import encode_data, decode_data
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

# Config
DB_NAME = "cys_secure.db"

def tamper_latest_topic():
    print("😈 ATTEMPTING TO TAMPER WITH DATABASE...")
    
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # 1. Find the target (latest submission)
        topic = cursor.execute("SELECT * FROM topics ORDER BY id DESC LIMIT 1").fetchone()
        
        if not topic:
            print("❌ No topics found! Please login as Student and submit a topic first.")
            return

        print(f"[*] Found Target Topic ID: {topic['id']}")
        
        # 2. Prepare the fake data
        fake_text = "HACKED PROJECT - This description was modified by an attacker"
        print(f"[*] Injecting Malicious Payload: '{fake_text}'")

        # 3. Encrypt the fake data using the VICTIM'S keys
        # We must use the original KEY and IV so the system decrypts it successfully (and sees the wrong text)
        key = decode_data(topic['encrypted_key'])
        iv = decode_data(topic['iv'])

        cipher = Cipher(algorithms.AES(key), modes.CFB(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        encrypted_bytes = encryptor.update(fake_text.encode()) + encryptor.finalize()
        encoded_fake_topic = encode_data(encrypted_bytes)

        # 4. Perform the Attack (SQL Update)
        # We replace the content BUT we leave the 'topic_hash' and 'signature' untouched.
        # This creates the mismatch integrity failure.
        cursor.execute(
            "UPDATE topics SET encrypted_topic = ? WHERE id = ?",
            (encoded_fake_topic, topic['id'])
        )
        conn.commit()
        conn.close()

        print("\n✅ ATTACK SUCCESSFUL!")
        print("---------------------------------------------------")
        print("1. The topic content in the database has been replaced.")
        print("2. The cryptographic signature now DOES NOT MATCH the content.")
        print("3. Go to the TEACHER DASHBOARD now.")
        print("4. You should see the status changed to 'TAMPERED' in Red.")
        print("---------------------------------------------------")

    except Exception as e:
        print(f"❌ Attack Failed: {e}")

if __name__ == "__main__":
    tamper_latest_topic()
