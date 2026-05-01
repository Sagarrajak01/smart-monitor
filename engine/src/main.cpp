#include <iostream>
#include <chrono>
#include <thread>
#include "Parser.h"
#include "Analyzer.h"

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "{\"error\": \"No PID provided\"}" << std::endl;
        return 1;
    }

    int pid = std::stoi(argv[1]);
    // 60-second window 
    
    Analyzer memAnalyzer(60);

    while (true) {
        long raw = ProcParser::getVmRSS(pid);
        
        if (raw == -1) {
            std::cout << "{\"error\": \"Process terminated\", \"pid\": " << pid << "}" << std::endl;
            break;
        }

        float ema = memAnalyzer.addSample(raw);
        float slope = memAnalyzer.calculateSlope();

        // Logic-based Status Assignment
        std::string status = "HEALTHY";
        if (slope > 100.0) status = "CRITICAL"; // Growing > 100KB/sec
        else if (slope > 10.0) status = "WARNING";

        // JSON Production (Single line for easy parsing by Node.js)
        std::cout << "{"
                  << "\"pid\": " << pid << ","
                  << "\"raw_kb\": " << raw << ","
                  << "\"ema_kb\": " << (int)ema << ","
                  << "\"slope\": " << slope << ","
                  << "\"status\": \"" << status << "\""
                  << "}" << std::endl;

        // 1-second polling interval
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    }
    return 0;
}