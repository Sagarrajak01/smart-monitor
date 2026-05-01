## Day 3: Standardizing IPC through JSON Streaming

### **Objective**
To transform the `smart-monitor` engine from a standalone CLI tool into a **Data Producer**. This phase focuses on **Inter-Process Communication (IPC)**, ensuring that the C++ system layer can communicate seamlessly with the high-level Node.js and React layers.

---

### **1. The Communication Protocol: JSON-over-Stdout**
Instead of using complex messaging libraries, I implemented a lightweight, high-speed streaming protocol. 
*   **Mechanism:** The engine serializes its internal state into a single-line **JSON object** and flushes it to `stdout` every second.
*   **Design Choice:** By avoiding external JSON libraries (like `nlohmann/json`), I maintained a **Zero-Dependency** architecture, ensuring the binary remains under 1MB and executes with near-zero latency.

### **2. Integration of the Status State Machine**
I implemented an automated heuristic layer that classifies process health based on the **Slope** ($m$) calculated in Day 2.
*   **HEALTHY ($m < 10$):** Indicates stable memory usage or minor background jitter.
*   **WARNING ($10 \leq m \leq 100$):** Indicates an active allocation phase or a slow-growing leak.
*   **CRITICAL ($m > 100$):** Indicates rapid memory exhaustion (e.g., >100KB/s), triggering an immediate alert state for the dashboard.


---

### **3. Technical Achievements**
*   **Machine-Readable Output:** Standardized all diagnostic data (PID, RAW, EMA, SLOPE, STATUS) into a parseable format.
*   **Graceful Error Handling:** Implemented a "JSON Error Packet" (e.g., `{"error": "Process terminated"}`) to ensure that if the monitored process dies, the downstream Bridge layer can handle the exit gracefully without crashing.
*   **Atomic Flushing:** Used `std::endl` to force the output buffer to flush immediately, preventing data lag in the real-time pipeline.

---

### **4. Data Schema Definition**
The engine now adheres to the following consistent schema for every 1-second pulse:

| Key | Type | Description |
| :--- | :--- | :--- |
| `pid` | Integer | The unique ID of the process being monitored. |
| `raw_kb` | Long | Real-time memory usage (Resident Set Size) from `/proc`. |
| `ema_kb` | Integer | Smoothed memory usage via Exponential Moving Average. |
| `slope` | Float | The 1st derivative (rate of change) of memory over time. |
| `status` | String | The heuristic health state (HEALTHY, WARNING, CRITICAL). |

---

