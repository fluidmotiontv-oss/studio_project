from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows cross-origin requests from React (port 5173)

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "online",
        "system": "Studio Project Engine",
        "message": "Python backend is connected!"
    })

if __name__ == '__main__':
    print("🚀 Starting Flask API server on http://localhost:5000...")
    app.run(port=5000, debug=True)
