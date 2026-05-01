#ifndef PARSER_H
#define PARSER_H

#include <string>

class ProcParser {
public:
    // Returns the Resident Set Size (RSS) in Kilobytes for a given PID
    static long getVmRSS(int pid);

private:
    // Helper to parse the /proc/[pid]/status file
    static long parseStatusFile(const std::string& path);
};

#endif