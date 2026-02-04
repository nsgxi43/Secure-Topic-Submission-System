from flask import Blueprint, jsonify
from rbac.access_control import require_permission

teacher_bp = Blueprint("teacher", __name__)

@teacher_bp.route("/teacher/dashboard")
@require_permission("view_all")
def teacher_dashboard():
    return jsonify({"message": "Teacher dashboard access granted"})


from services.verification_service import verify_topic

@teacher_bp.route("/teacher/verify/<int:topic_id>")
@require_permission("view_all")
def verify(topic_id):
    return verify_topic(topic_id)

from services.teacher_service import list_topics

@teacher_bp.route("/teacher/topics")
def topics():
    return list_topics()

from services.teacher_service import export_topics_csv
from flask import Response

@teacher_bp.route("/teacher/export")
def export():
    csv_data = export_topics_csv()
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=topics_export.csv"}
    )

