CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL,
    public_key TEXT,
    private_key TEXT
);

CREATE TABLE IF NOT EXISTS email_otps (
    email TEXT PRIMARY KEY,
    otp_hash TEXT NOT NULL,
    otp_salt TEXT NOT NULL,
    expiry REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    encrypted_topic TEXT NOT NULL,
    encrypted_key TEXT NOT NULL,
    iv TEXT NOT NULL,
    topic_hash TEXT NOT NULL,
    secure_hash TEXT NOT NULL,
    signature TEXT NOT NULL,
    receipt TEXT NOT NULL,
    student_id INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    timestamp TEXT
);
