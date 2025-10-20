from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from pathlib import Path
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load data
data = json.loads((Path(__file__).parent / "data.json").read_text(encoding="utf-8"))
projects = data["projects"]
publications = data["publications"]
links = data["links"]

# Lookup dicts
projects_dict = {p["uuid"]: p for p in projects}
publications_dict = {p["uuid"]: p for p in publications}


def parse_date(s):
    """Parse ISO datetime or date string to datetime.date."""
    try:
        return datetime.fromisoformat(s).date()
    except:
        return None


def in_date_range(item_date, start, end):
    """Check if item_date (ISO string) falls within start/end (date)."""
    d = parse_date(item_date)
    if not d:
        return False
    if start and d < start:
        return False
    if end and d > end:
        return False
    return True


@app.route("/api/projects", methods=["GET"])
def get_projects():
    # Query params
    search = request.args.get("search", "").lower()
    project_type = request.args.get("type")
    start_str = request.args.get("start_date")  # YYYY-MM-DD
    end_str = request.args.get("end_date")
    start = parse_date(start_str) if start_str else None
    end = parse_date(end_str) if end_str else None

    # Filter projects
    result = []
    for p in projects:
        if search and search not in (p.get("name") or "").lower():
            continue
        if project_type and p.get("type") != project_type:
            continue
        # Filter by created_at date
        if start or end:
            if not in_date_range(p.get("created_at", ""), start, end):
                continue
        result.append(p.copy())

    # Add counts
    for project in result:
        associated = [
            publications_dict[l["publication_uuid"]]
            for l in links
            if l["project_uuid"] == project["uuid"]
            and l["publication_uuid"] in publications_dict
        ]
        project["publication_count"] = len(associated)

    return jsonify(result)


@app.route("/api/projects/<uuid>", methods=["GET"])
def get_project_detail(uuid):
    project = projects_dict.get(uuid)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    associated = [
        publications_dict[l["publication_uuid"]]
        for l in links
        if l["project_uuid"] == uuid
        and l["publication_uuid"] in publications_dict
    ]
    result = project.copy()
    result["publications"] = associated
    result["publication_count"] = len(associated)
    return jsonify(result)


@app.route("/api/publications", methods=["GET"])
def get_publications():
    result = publications.copy()
    search = request.args.get("search", "").lower()
    if search:
        result = [
            p for p in result
            if search in (p.get("source") or "").lower()
            or search in (p.get("url") or "").lower()
        ]
    status = request.args.get("status")
    if status:
        result = [p for p in result if p.get("status") == status]
    source = request.args.get("source")
    if source:
        result = [p for p in result if p.get("source") == source]
    for pub in result:
        associated = [
            projects_dict[l["project_uuid"]]
            for l in links
            if l["publication_uuid"] == pub["uuid"]
            and l["project_uuid"] in projects_dict
        ]
        pub["project_count"] = len(associated)
    return jsonify(result)


@app.route("/api/publications/<uuid>", methods=["GET"])
def get_publication_detail(uuid):
    pub = publications_dict.get(uuid)
    if not pub:
        return jsonify({"error": "Publication not found"}), 404
    associated = [
        projects_dict[l["project_uuid"]]
        for l in links
        if l["publication_uuid"] == uuid
        and l["project_uuid"] in projects_dict
    ]
    result = pub.copy()
    result["projects"] = associated
    result["project_count"] = len(associated)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
