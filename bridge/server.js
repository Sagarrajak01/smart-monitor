const { spawn } = require('child_process');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
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

console.log(`[Bridge] Monitoring PID: ${targetPID}`);

// 2. Capture and Broadcast Data
engine.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
        if (line.trim()) {
            try {
                const stats = JSON.parse(line);
                console.log(`[Data] PID: ${stats.pid} | Status: ${stats.status}`);
                io.emit('metrics', stats);
            } catch (e) {
                //skip unwanted JSON
            }
        }
    });
});

// 3. Capture C++ Errors
engine.stderr.on('data', (data) => {
    console.error(`[C++ Error] ${data}`);
});

// 4. CLEAN SHUTDOWN --fix "Address in Use"
const cleanup = () => {
    console.log('\n[Bridge] Force-releasing resources...');
    
    if (engine) {
        // signal to C++ engine
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
        // Optional: Auto-kill logic could go here, but usually, 
        // a clean shutdown is better.
        process.exit(1);
    }
});

// 5. Start Server
server.listen(PORT, () => {
    console.log(`[Bridge] Server active on http://localhost:${PORT}`);
});