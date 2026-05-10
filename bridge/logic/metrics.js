const os = require('os');

const processTelemetry = (rawLine, targetName) => {
    try {
        const stats = JSON.parse(rawLine);
        const freeMemoryKB = os.freemem() / 1024;
        const numericSlope = Number(stats.slope);

        let ttf = null;
        if (!isNaN(numericSlope) && numericSlope > 0.01) {
            ttf = freeMemoryKB / numericSlope;
        }

        return {
            ...stats,
            slope: numericSlope,
            ttf: ttf,
            name: targetName,
            timestamp: Date.now()
        };
    } catch (e) {
        return null;
    }
};

module.exports = { processTelemetry };