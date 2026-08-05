#!/bin/bash

# Configuration
PORT=8000
PROJECT_DIR="$HOME/studio_project"
LOG_FILE="$PROJECT_DIR/server.log"
PID_FILE="$PROJECT_DIR/server.pid"

cd "$PROJECT_DIR" || exit 1

start_server() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "Server is already running on port $PORT (PID: $(cat "$PID_FILE"))."
        return
    fi

    # Ensure port is clear before starting
    pkill -f "python3 -m http.server $PORT" 2>/dev/null

    echo "Starting Python HTTP server on port $PORT..."
    nohup python3 -m http.server "$PORT" > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    sleep 1
    if kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "Server started successfully!"
        echo "Access at: http://localhost:$PORT"
        echo "Logs saved to: $LOG_FILE"
    else
        echo "Failed to start server. Check $LOG_FILE for details."
        rm -f "$PID_FILE"
    fi
}

stop_server() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        echo "Stopping server (PID: $PID)..."
        kill "$PID" 2>/dev/null || pkill -f "python3 -m http.server $PORT"
        rm -f "$PID_FILE"
        echo "Server stopped."
    else
        echo "No PID file found. Attempting force-stop..."
        pkill -f "python3 -m http.server $PORT"
        echo "Server stopped."
    fi
}

status_server() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "Server is RUNNING on http://localhost:$PORT (PID: $(cat "$PID_FILE"))"
    else
        echo "Server is STOPPED."
    fi
}

case "$1" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        sleep 1
        start_server
        ;;
    status)
        status_server
        ;;
    *)
        echo "Usage: ./server.sh {start|stop|restart|status}"
        exit 1
        ;;
esac
