const { spawn } = require('child_process');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const readline = require('readline');
const { save, getRecent } = require('./database');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
    connectionStateRecovery: {}
});

const PORT = process.env.PORT || 3000;
const targetPID = process.argv[2] || process.pid;

// 1. Spawn C++ Engine
const engine = spawn('../engine/smart-monitor', [targetPID]);
const rl = readline.createInterface({ input: engine.stdout });

console.log(`[Bridge] Monitoring PID: ${targetPID}`);

// 2. Capture, Broadcast, and Persist Data 
rl.on('line', (line) => {
    try {
        const stats = JSON.parse(line);
        console.log(`[Data] PID: ${stats.pid} | Status: ${stats.status}`);

        io.emit('metrics', stats);
        save(stats);
        
    } catch (e) {

    }
});

app.get('/api/history', (req, res) => {
    try {
        const history = getRecent(200); // Fetch last 200 rows
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// 3. Capture C++ Errors
engine.stderr.on('data', (data) => {
    console.error(`[C++ Error] ${data}`);
});

// 4. CLEAN SHUTDOWN --fix "Address in Use"
const cleanup = () => {
    console.log('\n[Bridge] Force-releasing resources...');

    if (engine) {
        engine.kill('SIGKILL');
    }

    server.close(() => {
        console.log('[Bridge] Port released.');
        process.exit(0);
    });

    setTimeout(() => {
        process.exit(0);
    }, 500);
};

// Listen for Ctrl+C
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`[Fatal] Port ${PORT} is busy. Attempting to fix...`);
        process.exit(1);
    }
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bridge] Server active on http://0.0.0.0:${PORT}`);
});