## **Day 6: High-Density Telemetry Interface & Modular Refactoring**

I implemented a **Full-Stack UI Architecture** that balances real-time performance with enterprise-grade maintainability.

---

### **1. Technical Stack & Modular Architecture**
The frontend was rebuilt into a **decoupled, service-oriented structure** designed for high-frequency data streams:
* **Framework:** React (Vite) with a custom **Directory Fragmentation** strategy.
* **Styling:** **Tailwind CSS v4** utilizing the `@tailwindcss/vite` engine for zero-runtime CSS overhead.
* **Visualization:** **Recharts** with a Layout Guard pattern to handle dynamic browser resizing.
* **State & Logic:** Fragmented into **Custom Hooks** (`useTheme.js`) and **Services** (`socket.js`).

---

### **2. Key Implementations**

#### **A. Directory Fragmentation**
To ensure scalability, I moved `App.jsx` to a modular structure:
* **`src/services/`**: Encapsulated **Socket.io** networking logic to isolate bi-directional communication.
* **`src/utils/`**: Implemented a **Single Source of Truth** with `constants.js` and a `cn` utility for clean Tailwind merging.
* **`src/hooks/`**: Created `useTheme.js` to handle DOM-level environmental side effects (Dark Mode/Color-Scheme).

#### **B. Predictive Sliding Window Buffer**
To maintain 60FPS while visualizing high-density telemetry, I implemented a **Sliding Window** mechanism:
* **Mechanism:** Maintains a strict **50-point buffer** in memory using `prev.slice(-(CHART_CONFIG.WINDOW_SIZE - 1))`.
* **Benefit:** Prevents DOM bloating and ensures zero-lag rendering during long-duration monitoring sessions.

#### **C. Layout-Stabilized Telemetry Visualizer**
Solved complex browser rendering issues using **Engineering Guards**:
* **The Guard:** Implemented `contain: layout` and `debounce={50}` to fix the "ResponsiveContainer width/height 0" error.
* **Visual Logic:** A dual-layer spectrum showing **Raw Workload** (Solid Area) vs. **EMA Trend** (Dashed Vector) to visualize memory volatility.

#### **D. Environment-Driven Configuration**
* **Integration:** Integrated `.env` support via `import.meta.env` to allow instant switching between local and production Node.js bridges without modifying the source code.

---

### **3. UI Components Architecture**

| Component | Functionality | Engineering Feature |
| :--- | :--- | :--- |
| **StatCard** | Displays PID, Memory, Slope, and Status. | Dynamically mapped to `STATUS_THEMES` constants. |
| **TelemetryChart** | Visualizes live memory & EMA trends. | Uses SVG path optimization and gradient definitions. |
| **Header** | Branding and Theme Orchestration. | Decoupled from core state; purely presentational. |
| **LoadingScreen** | Awaiting Kernel Stream state. | Prevents partial layout paints during socket handshake. |

---

### 4. Status
* **Separation of Concerns:** Business logic (Networking/Math) is strictly separated from UI (Components).
* **Scalability:** The project is now "plug-and-play"; server URLs and chart settings are centralized in one config file.