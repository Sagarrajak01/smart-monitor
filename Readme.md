# Smart Monitor

Smart Monitor is a full-stack, high-performance observability tool designed to track Linux process memory in real-time. By utilizing **Ordinary Least Squares (OLS) Linear Regression**, the system provides proactive diagnostics by predicting exactly when a process will trigger an Out-of-Memory (OOM) event.

---

## Technical Architecture

The system follows a **Modular Controller Pattern**, separating low-level data extraction from high-level predictive modeling and visual representation.

* **Core Engine (C++17):** A high-performance analyzer that scrapes the `/proc` filesystem for sub-millisecond telemetry. It performs real-time Linear Regression to calculate memory growth vectors ($m$).
* **Bridge (Node.js):** The orchestrator and predictive brain. It manages the C++ process lifecycle and calculates the **Time-to-Failure (TTF)** based on current OS physical memory headroom.
* **Diagnostic Dashboard (React 19):** A real-time UI built with Vite and Tailwind CSS, featuring live telemetry charts, historical data hydration from SQLite, and predictive status reporting.

---

## Installation & Setup

### Prerequisites

* **OS:** Linux (Ubuntu 20.04+ recommended)
* **Compiler:** `g++` (supporting C++17)
* **Environment:** Node.js (v18+) and SQLite3

### Step-by-Step Execution

1. **Clone the Repository:**
```bash
git clone https://github.com/Sagarrajak01/smart-monitor.git
cd smart-monitor

```


2. **Build the Engine:**
```bash
cd engine && make

```


3. **Configure Environment Variables:**
The Bridge requires a `.env` file for configuration. Use the following Linux command to create it:
```bash
cd ../bridge
touch .env
```


4. **Initialize the Bridge (Backend):**
```bash
npm install
node server.js
```

5. **Launch the Dashboard (Frontend):**
Open a new terminal tab:
```bash
cd dashboard
npm install
npm run dev

```

---

## Configuration (.env)

The backend Bridge uses environment variables for port management and sensitive configurations. Create a `.env` file in the `/bridge` directory:

```env
PORT=3000
VITE_SOCKET_URL=http://localhost:3000

```

---

## Further Documentation & References

For exhaustive details on the engineering lifecycle and logic implementations, please refer to the following local files:

**[Development Chronicle](https://github.com/Sagarrajak01/smart-monitor/tree/main/Documentation):** Contains day-by-day technical logs from **Day 1 to Day 8**, detailing the evolution from raw data parsing to predictive analytics.

---

## License

**MIT License**

Copyright (c) 2026 Sagar Rajak