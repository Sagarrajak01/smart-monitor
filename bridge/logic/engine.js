const { spawn } = require('child_process');
const readline = require('readline');

let engineProcess = null;
let rlInterface = null;

const stopEngine = () => {
    if (rlInterface) {
        rlInterface.close();
        rlInterface = null;
    }
    if (engineProcess) {
        console.log(`[Lifecycle] Terminating Engine (PID: ${engineProcess.spawnargs[3]})`);
        engineProcess.kill('SIGKILL');
        engineProcess = null;
    }
};

const startEngine = (pid, onDataReceived) => {
    stopEngine();
    engineProcess = spawn('../engine/smart-monitor', [pid]);
    
    rlInterface = readline.createInterface({ 
        input: engineProcess.stdout,
        terminal: false 
    });

    rlInterface.on('line', onDataReceived);
    engineProcess.stderr.on('data', (data) => {
        console.error(`[C++ Error] ${data}`);
    });

    console.log(`[Lifecycle] Engine started for PID: ${pid}`);
    return engineProcess;
};

module.exports = { startEngine, stopEngine };