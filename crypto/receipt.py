import hashlib

def generate_receipt(topic, secure_hash, timestamp, user_id):
    data = f"{topic}{secure_hash}{timestamp}{user_id}"
    return hashlib.sha256(data.encode()).hexdigest()
