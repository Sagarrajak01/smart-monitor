#include <iostream>
#include <chrono>
#include <thread>
#include "Parser.h"
#include "Analyzer.h"

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: ./smart-monitor [PID]" << std::endl;
        return 1;
    }

    int pid = std::stoi(argv[1]);
    Analyzer memAnalyzer(20); // 20-second window

    std::cout << "Monitoring PID: " << pid << " | Press Ctrl+C to stop" << std::endl;
    std::cout << "Time(s)\tRaw(KB)\tEMA(KB)\tSlope" << std::endl;

    int second = 0;
    while (true) {
        long raw = ProcParser::getVmRSS(pid);
        if (raw == -1) break;

        float ema = memAnalyzer.addSample(raw);
        float slope = memAnalyzer.calculateSlope();

        std::cout << second++ << "\t" << raw << "\t" << (int)ema << "\t" << slope << std::endl;

        std::this_thread::sleep_for(std::chrono::seconds(1));
    }

    
    return 0;
}