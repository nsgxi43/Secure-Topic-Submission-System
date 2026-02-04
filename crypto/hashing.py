import hashlib
import os

# salted hash (for passwords + integrity)
def hash_with_salt(data):
    salt = os.urandom(16).hex()
    hashed = hashlib.sha256((data + salt).encode()).hexdigest()
    return hashed, salt

# verify salted hash
def verify_password(password, stored_hash, salt):
    new_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return new_hash == stored_hash

# deterministic hash (duplicate detection)
def deterministic_hash(data):
    return hashlib.sha256(data.encode()).hexdigest()
