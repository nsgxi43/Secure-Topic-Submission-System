from flask import Blueprint, jsonify
from rbac.access_control import require_permission

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/admin/dashboard")
@require_permission("finalize")
def admin_dashboard():
    return jsonify({"message": "Admin dashboard access granted"})

from flask import session
from services.audit_service import log_action

system_locked = False

@admin_bp.route("/admin/finalize")
@require_permission("finalize")
def finalize():
    global system_locked
    system_locked = True

    user_id = session.get("user_id")
    log_action(user_id, "System finalized")

    return {"message": "System locked. No more submissions allowed"}

from services.audit_service import get_audit_logs

@admin_bp.route("/admin/audit")
@require_permission("finalize")
def audit_view():
    return get_audit_logs()
