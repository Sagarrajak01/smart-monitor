## Day 4: Orchestrating the System Bridge

### **Objective**
To build a high-performance **Middleware Bridge** using Node.js. This layer is responsible for managing the lifecycle of the C++ engine and converting its local `stdout` stream into a networked data source ready for the web.

---

### **1. Child Process Orchestration**
Instead of running the C++ engine manually, I utilized the Node.js `child_process` module to automate the system.
*   **The `spawn` Method:** I chose `spawn` over `exec` because it creates a **Stream**. Since the `smart-monitor` runs indefinitely, `spawn` allows Node.js to read data in real-time "chunks" without waiting for the process to finish, keeping memory usage low.
*   **Decoupled Targeting:** I implemented a dynamic PID injection system. By passing the target PID as a command-line argument to the bridge, I can monitor any process on the system without re-compiling the C++ code.

---

### **2. Asynchronous Stream Handling**
I leveraged the Node.js **Event Loop** to handle the data flow asynchronously.
*   **Data Fragmentation Management:** Since `stdout` is a stream, JSON objects can sometimes arrive in pieces. I implemented logic to split the incoming buffer by newlines, ensuring each "pulse" is a complete, valid JSON object before it is parsed.
*   **Non-Blocking I/O:** The bridge remains responsive to other web requests even while it is waiting for the 1-second pulse from the C++ engine.


---

### **3. Production-Grade Lifecycle Management**
*   **Signal Handling (SIGINT/SIGTERM):** I implemented listeners to intercept termination signals (like `Ctrl+C`). This ensures that the C++ child process is killed (`engine.kill()`) and the network port is released before the Node.js process exits.
*   **Automated Recovery:** Added an `error` listener to the server to handle common networking issues, such as the `EADDRINUSE` (Address already in use) error, providing clear diagnostic feedback instead of a silent crash.

---

### **4. Technical Achievements**
*   **IPC Implementation:** Established a robust Inter-Process Communication pipe between a compiled C++ binary and a JavaScript runtime.
*   **Error Stream Ingestion:** Instrumented the bridge to capture `stderr` from the C++ engine, allowing for remote debugging of system-level crashes (like Segmentation Faults) from the Node.js console.
*   **Configuration Isolation:** Integrated `dotenv` to manage environment-specific variables like `PORT`, separating the application logic from the deployment environment.