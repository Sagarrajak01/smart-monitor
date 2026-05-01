#include "Parser.h"
#include <iostream>
#include <fstream>
#include <sstream>

long ProcParser::getVmRSS(int pid) {
    std::string path = "/proc/" + std::to_string(pid) + "/status";
    return parseStatusFile(path);
}

long ProcParser::parseStatusFile(const std::string& path) {
    std::ifstream file(path);
    if (!file.is_open()) {
        return -1; // Process likely terminated
    }

    std::string line;
    while (std::getline(file, line)) {
        // Look for the "VmRSS:" line
        if (line.find("VmRSS:") == 0) {
            std::stringstream ss(line);
            std::string label;
            long value;
            ss >> label >> value; // Extracts "VmRSS:" and the number
            return value; 
        }
    }
    return 0; // Field not found (some processes don't have VmRSS)
}