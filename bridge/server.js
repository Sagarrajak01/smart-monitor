const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { save, getRecent } = require('./database');
const { startEngine, stopEngine } = require('./logic/engine');
const { processTelemetry } = require('./logic/metrics');

const app = express();
const server = http.createServer(app);

// Configure WebSocket with strict CORS policy
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Apply strict CORS middleware for Express routes
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || "http://localhost:3000",
    credentials: true
}));

// Apply rate limiting 
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100             // 100 requests per minute
});
app.use('/api/', limiter);

// Core monitoring logic
const initiateMonitoring = (pid, name) => {
    startEngine(pid, (line) => {
        const processed = processTelemetry(line, name);
        if (processed) {
            io.emit('metrics', processed);
            save(processed);
        }
    });
};

// WebSocket event handlers
io.on('connection', (socket) => {
    socket.on('switch-target', (pid) => {
        const parsedPid = parseInt(pid, 10);
        if (!Number.isInteger(parsedPid) || parsedPid < 1) {
            console.warn(`[Security] Invalid PID attempt: ${pid}`);
            return;
        }

        let name = "Unknown";

        try {
            execFile('ps', ['-p', String(parsedPid), '-o', 'comm='],
                { timeout: 5000 },
                (error, stdout, stderr) => {
                    if (!error && stdout) {
                        name = stdout.toString().trim();
                    } else {
                        name = `PID: ${parsedPid}`;
                    }
                    initiateMonitoring(parsedPid, name);
                }
            );
        } catch (e) {
            console.error(`[Error] Process lookup failed:`, e);
            name = `PID: ${parsedPid}`;
            initiateMonitoring(parsedPid, name);
        }
    });
});

// API Routes
app.get('/api/top-processes', (req, res) => {
    try {
        // Fetch top memory-consuming processes 
        execFile('ps', ['-eo', 'pid,comm,%mem', '--sort=-%mem'],
            { timeout: 5000 },
            (error, stdout, stderr) => {
                if (error) {
                    return res.status(500).json({ error: "Failed to fetch processes" });
                }

                const processes = stdout
                    .trim()
                    .split('\n')
                    .slice(1, 6) // Extract the top 5 processes
                    .map(line => {
                        const [pid, name, mem] = line.trim().split(/\s+/);
                        
                        // Validate parsed output before returning
                        if (!pid || !name || !mem) return null;
                        
                        return {
                            pid: parseInt(pid, 10),
                            name: String(name).slice(0, 50),
                            mem: parseFloat(mem).toFixed(1)
                        };
                    })
                    .filter(process => process !== null);

                res.json(processes);
            }
        );
    } catch (e) {
        res.status(500).json({ error: "Process lookup failed" });
    }
});

app.get('/api/history', (req, res) => {
    // Enforce limits on history retrieval to prevent excessive database queries
    const limit = Math.min(parseInt(req.query.limit || 200, 10), 500);
    if (!Number.isInteger(limit) || limit < 1) {
        return res.status(400).json({ error: "Invalid limit" });
    }
    res.json(getRecent(limit));
});

// Serve static React dashboard files
app.use(express.static(path.join(__dirname, '../dashboard/dist')));

// SPA fallback route for React Router
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
    } else {
        next();
    }
});

// Server Initialization
const PORT = process.env.PORT || 3000;

// Validate the initial PID passed via command line arguments
let initialPid = process.argv[2] || String(process.pid);
const parsedInitialPid = parseInt(initialPid, 10);

if (!Number.isInteger(parsedInitialPid) || parsedInitialPid < 1) {
    initialPid = String(process.pid);
}

initiateMonitoring(parsedInitialPid, "Initial-System");

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bridge] Live on port ${PORT}`);
    console.log(`[UI] Dashboard ready at: http://localhost:${PORT}`);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('[Bridge] Shutting down gracefully...');
    stopEngine();
    server.close(() => {
        process.exit(0);
    });
});