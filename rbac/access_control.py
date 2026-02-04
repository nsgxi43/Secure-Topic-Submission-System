from flask import session, jsonify
from rbac.permissions import PERMISSIONS

def require_permission(permission):
    def decorator(func):
        def wrapper(*args, **kwargs):
            role = session.get("role")

            if role is None:
                return jsonify({"error": "Not logged in"}), 401

            if permission not in PERMISSIONS.get(role, []):
                return jsonify({"error": "Access denied"}), 403

            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator
