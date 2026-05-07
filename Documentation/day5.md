# **Day 5: The Real-Time Integration & Handshake**

### **Objective**
To establish a high-performance, full-duplex communication channel between the backend infrastructure and the React frontend. I focuses on the **Handshake** between the Node.js bridge and the browser, ensuring real-time data synchronization with zero manual intervention.

---

### **1. WebSocket Infrastructure**

Instead of traditional HTTP polling, I implemented **Socket.io** to facilitate a persistent, low-latency connection.
*   **The Handshake Protocol:** I configured the Node.js bridge to upgrade standard HTTP connections to the WebSocket protocol. This allows the C++ engine's data pulses to be pushed to the dashboard instantly as they are generated.
*   **CORS & Security:** I implemented a strict Cross-Origin Resource Sharing (CORS) policy on the bridge to allow only the React dashboard (Port 5173) to consume the system metrics, ensuring secure data piping.

### **2. Reactive State Synchronization**

I leveraged React's **Hook-based Architecture** to manage the lifecycle of the data stream.
*   **Persistent Listeners:** Using the `useEffect` hook, I established a single-instance listener for the `metrics` event. This ensures that the UI re-renders only when a new "pulse" arrives from the engine.
*   **State Atomicity:** I used `useState` to store the parsed JSON packets (`pid`, `raw_kb`, `slope`, `status`). This approach guarantees that the dashboard always displays a consistent snapshot of the process health.

### **3. "Zero-Touch" Connection Resilience**

To ensure the dashboard is production-ready, I implemented automated connection recovery logic.
*   **Disconnect Awareness:** I integrated a `disconnect` event listener that clears the local state when the backend server stops. This instantly triggers a "Waiting for pulse" message, providing immediate feedback rather than showing "frozen" or stale data.
*   **Self-Healing Handshake:** I verified the Socket.io auto-reconnection mechanism. The dashboard now automatically detects when the bridge returns online and resumes visualization without requiring a page refresh.

### **4. Technical Achievements**

*   **Memory Leak Prevention:** Implemented the cleanup pattern in React. By explicitly removing socket listeners (`socket.off`) during component unmounting, I prevented browser-side memory bloat and duplicate event triggers.
*   **Environment Sanitization:** Performed a deep-clean of the Vite environment, stripping all non-essential boilerplate assets, styles, and scripts to achieve a minimalist, high-performance monitoring workspace.
*   **Bidirectional Sync:** Successfully closed the loop of the full-stack pipeline: **Kernel → C++ Engine → Node Bridge → WebSocket → React State**.

---

**Current Status:** All systems synchronized. Data is flowing from the Linux kernel to the browser state with sub-millisecond latency.