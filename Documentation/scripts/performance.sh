#!/bin/bash

OUTPUT="../performance.md"

ENGINE_PID=$(ps -C smart-monitor -o pid= | xargs)
NODE_PID=$(pgrep -f "node server.js" | head -n 1)

if [ -z "$ENGINE_PID" ] || [ -z "$NODE_PID" ]; then
    echo "Smart Monitor processes are not running."
    exit 1
fi

ENGINE_CPU=$(ps -p "$ENGINE_PID" -o %cpu= | xargs)
NODE_CPU=$(ps -p "$NODE_PID" -o %cpu= | xargs)

ENGINE_MEM=$(ps -p "$ENGINE_PID" -o rss= | xargs)
NODE_MEM=$(ps -p "$NODE_PID" -o rss= | xargs)

cat > "$OUTPUT" <<EOF
# Performance Metrics

## Runtime Configuration

| Metric | Value |
|---|---|
| Polling Interval | 1000 ms |
| Telemetry Transport | stdout JSON stream |
| Persistence Engine | SQLite3 |
| Real-time Transport | \`Socket.IO\` |

---

## Resource Usage

| Component | Approximate Usage |
|---|---|
| Engine CPU Usage | ${ENGINE_CPU}% |
| Node.js CPU Usage | ${NODE_CPU}% |
| Engine Memory Usage | ${ENGINE_MEM} KB |
| Node.js Memory Usage | ${NODE_MEM} KB |

Generated from live runtime process statistics.
EOF

echo "Generated $OUTPUT"