from flask import Blueprint, jsonify, session
from rbac.access_control import require_permission
from services.audit_service import log_action, get_audit_logs

admin_bp = Blueprint("admin", __name__)

# System lock state management
_system_state = {"locked": False}

def is_system_locked():
    return _system_state["locked"]

def lock_system():
    _system_state["locked"] = True

@admin_bp.route("/admin/dashboard")
@require_permission("finalize")
def admin_dashboard():
    return jsonify({"message": "Admin dashboard access granted"})

@admin_bp.route("/admin/finalize")
@require_permission("finalize")
def finalize():
    lock_system()
    user_id = session.get("user_id")
    log_action(user_id, "System finalized")
    return jsonify({"message": "System locked. No more submissions allowed"})

@admin_bp.route("/admin/audit")
@require_permission("finalize")
def audit_view():
    return get_audit_logs()