## **Day 7 Documentation: Data Persistence & API Hydration**

I integrated a SQLite database, the system can now survive restarts and provide historical context for memory analysis.

---

### **1. Architectural Overview**

The system now follows a **Hybrid Data Strategy**:

* **Write Path:** C++ Engine → Node.js Bridge → **SQLite (Disk)**
* **Read Path (Initial):** React Dashboard → **Express API** → SQLite (Hydration)
* **Read Path (Live):** Node.js Bridge → **Socket.io** → React Dashboard

---

### **2. Component Breakdown**

#### **A. Persistence Layer (`database.js`)**

Used **`better-sqlite3`** for its synchronous execution, which matches the high-frequency "heartbeat" of the telemetry data without the overhead of async/await for local disk writes.

* **Schema:** `memory_logs` table storing `pid`, `mem_kb`, `ema_kb`, `slope`, and `status`.
* **Indexing:** Automatic `id` indexing for fast retrieval of the latest records.

#### **B. The Bridge API (`server.js`)**

Implemented a RESTful endpoint: `GET /api/history`.

* **Purpose:** Allows any device on the network to fetch the last 200 samples of system behavior.
* **Network Binding:** The server listens on `0.0.0.0`, making the database accessible to mobile devices and other laptops via the local IP.

#### **C. Frontend Hydration (`App.jsx`)**

Modified the React lifecycle to include a **Hydration Phase**.

1. **Mount:** App calls `fetchHistory()`.
2. **State Sync:** `setHistory()` populates the chart with previous data.
3. **Live Handover:** Socket.io starts appending new data points to the existing historical curve.

---

### **3. Key Engineering Decisions **

* **Why SQLite?** Zero-config, file-based, and perfect for embedded telemetry. It avoids the heavy dependency.
* **Why `0.0.0.0`?** To demonstrate an understanding of network interfaces beyond the loopback (`127.0.0.1`), allowing for true cross-device monitoring.
* **Why .reverse() on the Frontend?** Databases store the latest logs at the top (DESC), but time-series charts must render from left to right. Handling this in the service layer keeps the UI logic clean.

---

### **4. Verification & Testing**

| Test Case | Expected Result |
| --- | --- |
| **Persistence Test** | Stopping the server and restarting it preserves the chart data. |
| **API Test** | Navigating to `/api/history` in a browser returns a valid JSON array. |
| **Network Test** | Mobile phone can load history via the laptop's IP address. |
| **Integrity Test** | Malformed JSON from the C++ engine is ignored and not saved to the DB. |

---

### **5. Summary of Achievements**

* **Data Integrity:** Zero data loss during session transitions.
* **Diagnostic Power:** Ability to track memory leaks over long durations.
* **Production Readiness:** Implemented a real-world pattern used in professional monitoring stacks like Prometheus or Grafana.