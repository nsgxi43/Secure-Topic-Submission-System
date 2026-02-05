# Secure Topic Submission System (CYS Project)

A state-of-the-art secure platform designed for students to submit research topics confidentially and securely. This system integrates advanced cryptographic techniques including **AES Encryption**, **RSA Digital Signatures**, **Role-Based Access Control (RBAC)**, and **Multi-Factor Authentication (MFA)** to ensure data integrity, confidentiality, and non-repudiation.

## 🚀 Key Features

*   **🔒 Secure Authentication**:
    *   **Students**: Multi-Factor Authentication (Password + Email OTP).
    *   **Faculty/Admins**: Secure Password Hashing (SHA-256 with Salt).
*   **🛡️ Advanced Encryption**:
    *   Submissions are encrypted using **AES-256** (CFB Mode).
    *   Hybrid encryption model ensures efficient and secure data storage.
*   **✍️ Digital Signatures & Integrity**:
    *   Every submission is signed using the student's unique **RSA Private Key**.
    *   Ensures **Non-Repudiation** (students cannot deny their submission) and **Tamper Detection**.
*   **🎫 Secure Receipts**:
    *   Students receive a tamper-evident cryptographic receipt upon submission.
    *   Receipts are generated via `SHA256(Topic + Hash + Timestamp + UserID)`.
*   **👥 Role-Based Access Control (RBAC)**:
    *   **Student**: Submit topics, View own history.
    *   **Teacher**: View all topics, Verify signatures.
    *   **Admin**: System management, Lock/Unlock submissions, User management.
*   **🎨 Modern UI**:
    *   Futuristic "Cybersecurity Control Panel" aesthetic.
    *   Built with **React (Vite)** and **Tailwind CSS**.

## 🛠️ Tech Stack

*   **Backend**: Python (Flask)
*   **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion
*   **Database**: SQLite (with encrypted fields)
*   **Cryptography**: `cryptography` library (Python), SHA-256, AES-256, RSA-2048

## 📦 Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
*   **Python 3.8+**
*   **Node.js & npm**

### 1. Backend Setup

1.  Navigate to the project root directory:
    ```bash
    cd CYS
    ```

2.  (Optional) Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Initialize the database (if needed):
    *   The system should automatically initialize `database/cys.db` on the first run using `database/schema.sql`.

5.  Start the Flask Server:
    ```bash
    python app.py
    ```
    *   The backend will run at `http://localhost:5000`.

### 2. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` folder:
    ```bash
    cd CYS/frontend
    ```

2.  Install Node dependencies:
    ```bash
    npm install
    ```

3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    *   The frontend will typically run at `http://localhost:5173`.

## 📖 Usage Guide

1.  **Register a User**:
    *   Open the web app.
    *   Navigate to the **Register** page.
    *   Create an account as a Student (default). *Note: Admin/Teacher accounts may need manual creation or DB adjustment depending on configuration.*

2.  **Student Workflow**:
    *   Log in (enter Email & Password -> enter OTP sent to email).
    *   Go to **Submit Topic**.
    *   Enter your topic details and submit.
    *   View your **Secure Receipt** and submission status.

3.  **Teacher/Admin Workflow**:
    *   Log in.
    *   Navigate to the **Dashboard**.
    *   **Teachers** can view all encrypted topics and verify their digital signatures.
    *   **Admins** can lock the system to prevent further submissions.

## 📂 Project Structure

*   `app.py`: Main entry point for the Flask backend.
*   `auth/`: Authentication logic (Login, Register, MFA).
*   `crypto/`: Cryptographic modules (AES encryption, RSA keys, Hashing).
*   `database/`: Database schema and connection logic.
*   `frontend/`: React source code (Components, Pages, Tailwind config).
*   `rbac/`: Role-Based Access Control logic (Permissions).
*   `routes/`: API route definitions.
*   `services/`: Business logic (Email service, Topic service).
*   `PRESENTATION_GUIDE.md`: Detailed explanation of security features for presentation purposes.
