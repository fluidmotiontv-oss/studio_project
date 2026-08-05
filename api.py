from flask import Flask, jsonify
from flask_cors import CORS
import os
import sys
import importlib

app = Flask(__name__)
CORS(app)

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import module starting with a digit safely using importlib
auditor = importlib.import_module("3way_media_auditor")

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "system": "Fluid Motion Studio Engine",
        "status": "online",
        "message": "Python backend is connected!"
    })

@app.route('/api/audit', methods=['GET'])
def get_media_audit():
    try:
        audit_data = auditor.run_audit()
        return jsonify(audit_data)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Flask API server on http://localhost:5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
