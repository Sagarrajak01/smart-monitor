const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { execSync } = require('child_process');
const path = require('path'); 
require('dotenv').config();

const { save, getRecent } = require('./database');
const { startEngine, stopEngine } = require('./logic/engine');
const { processTelemetry } = require('./logic/metrics');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());

// CORE HANDLER 
const initiateMonitoring = (pid, name) => {
    startEngine(pid, (line) => {
        const processed = processTelemetry(line, name);
        if (processed) {
            io.emit('metrics', processed);
            save(processed);
        }
    });
};

// SOCKETS 
io.on('connection', (socket) => {
    socket.on('switch-target', (pid) => {
        let name = "Unknown";
        try {
            name = execSync(`ps -p ${pid} -o comm=`).toString().trim();
        } catch (e) { name = `PID: ${pid}`; }
        initiateMonitoring(pid, name);
    });
});

// REST API 
app.get('/api/top-processes', (req, res) => {
    try {
        const output = execSync(`ps -eo pid,comm,%mem --sort=-%mem | head -6`).toString();
        const processes = output.trim().split('\n').slice(1).map(l => {
            const [pid, name, mem] = l.trim().split(/\s+/);
            return { pid, name, mem: parseFloat(mem).toFixed(1) };
        });
        res.json(processes);
    } catch (e) { res.status(500).json({ error: "Failed" }); }
});

app.get('/api/history', (req, res) => res.json(getRecent(200)));


app.use(express.static(path.join(__dirname, '../dashboard/dist')));

app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
    } else {
        next();
    }
});

const PORT = process.env.PORT || 3000;
const initialPid = process.argv[2] || process.pid;
initiateMonitoring(initialPid, "Initial-System");

server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bridge] Sagar Standard Live on Port ${PORT}`);
});

process.on('SIGINT', () => {
    stopEngine();
    process.exit(0);
});