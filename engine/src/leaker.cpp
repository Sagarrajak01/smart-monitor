#include <iostream>
#include <vector>
#include <thread>
#include <chrono>
#include <unistd.h>

int main() {
    std::vector<char*> leak_vault;

    std::cout << "Leaker started. PID: " << getpid() << std::endl;

    int seconds = 0;
    size_t size = 1024 * 1024 * 1; // 1 mbps

    while (true) {
        char* memory = new char[size];

        // force actual RAM usage (avoid lazy allocation)
        for (size_t i = 0; i < size; i += 4096) {
            memory[i] = 1;
        }

        leak_vault.push_back(memory);

        std::cout 
            << "Time: " << seconds++ << "s | "
            << "Allocated: " << (size / (1024 * 1024)) << " MB"
            << std::endl;

        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
    return 0;
}
