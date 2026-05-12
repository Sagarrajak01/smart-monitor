## **Day 8: System Hardening & Predictive Reliability**

The core objectives involved filtering signal noise, ensuring mathematical stability, and hardening the process lifecycle.

### **1. Signal Stabilization & Noise Filtering**

Raw metrics from the `/proc` filesystem are often volatile due to transient OS buffer allocations. To ensure the predictive engine ignores short-term jitter, a smoothing layer was implemented.

* **Exponential Moving Average (EMA):** Integrated an EMA filter to prioritize long-term trends over transient spikes.
* **Mathematical Smoothing:** Applied a smoothing factor ($\alpha$) of `0.2f` to the data stream within the C++ engine.
* **Initial Seeding:** Implemented logic where the first data point seeds the EMA to prevent extreme initial prediction swings.

### **2. Advanced Analytics & Status Logic**

The predictive core was hardened to provide proactive system health diagnostics based on real-time growth vectors.

* **OLS Linear Regression:** The engine calculates a definitive memory growth slope ($m$) using a rolling 60-sample window.
* **Dynamic Status Classification:** The system automatically assigns a health state based on the calculated slope:
* **CRITICAL:** Memory growth exceeds $100\text{ KB/sec}$.
* **WARNING:** Memory growth exceeds $10\text{ KB/sec}$.
* **HEALTHY:** The process footprint is stable or recovering.


* **TTF Calculation:** Time-to-Failure (TTF) is projected by intersecting the growth slope with available physical RAM headroom.

### **3. Mathematical Reliability & Edge Cases**

The engine was hardened against common mathematical failures to ensure continuous operation in edge-case scenarios.

* **Zero-Division Guard:** Added logic to handle cases where time intervals are identical, returning a `0.0f` slope instead of a floating-point exception.
* **Negative Slope Handling:** Identified "Memory Recovery" states (negative growth), where the system suppresses alerts and sets TTF to stable.
* **Noise Floor:** Added a threshold to ignore growth below $0.01\text{ KB/sec}$, treating it as standard system background activity.

### **4. Process Lifecycle & IPC Resilience**

Communication between the C++ engine and Node.js Bridge was refined for stability and system hygiene.

* **Signal Safety:** The Bridge now explicitly manages `SIGINT` to ensure the C++ child process is killed cleanly, preventing zombie processes.
* **Non-Blocking Communication:** Optimized the `stdout` JSON stream to ensure Node.js can parse telemetry in real-time without pipe buffer bottlenecks.
* **Dynamic Targeting:** Implemented a `switch-target` event allowing users to change the monitored PID and automatically resolve process names via the backend.

### **5. Persistence & UI Integration**

The persistence layer and dashboard were synchronized to provide immediate historical context.

* **Historical Hydration:** The React dashboard fetches the last 200 samples from SQLite on mount, providing an instant view of recent trends.
* **DB Integrity:** Added error boundaries to the database write path to prevent malformed telemetry from corrupting the persistence layer.
* **Persistent Preferences:** Finalized `localStorage` integration for the theme toggle, ensuring a consistent user experience across sessions.

---

### **Summary of System Evolution**

| Component | Previous | Hardened  |
| --- | --- | --- |
| **Engine** | Raw `/proc` parsing. | EMA smoothing & OLS slope logic. |
| **Logic** | Manual PID tracking. | Signal handling & zombie prevention. |
| **Math** | Basic linear calculation. | Zero-division guards & TTF edge cases. |
| **UX** | Live-only chart. | API-driven historical hydration. |