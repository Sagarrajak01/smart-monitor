# Smart Monitor

Smart Monitor is a full-stack Linux observability tool designed to track process memory usage in real time and estimate potential Out-of-Memory (OOM) conditions using statistical trend analysis.

The system combines a high-performance C++ telemetry engine, a Node.js orchestration layer, and a React-based live dashboard for visualization and monitoring.

---

# Screenshot

<p align="center">
  <img src="./Documentation/screenshots/dashboard.png" alt="Smart Monitor Dashboard" width="100%">
</p>

---

# Features

- Real-time Linux process memory monitoring
- `/proc` filesystem telemetry scraping
- OLS Linear Regression for memory growth estimation
- Exponential Moving Average (EMA) smoothing
- Time-to-Failure (TTF) projection
- Live WebSocket-based dashboard updates
- Historical telemetry persistence using SQLite
- Modular multi-service architecture

---

# Tech Stack

- C++17
- Node.js
- React 19
- Vite
- Tailwind CSS
- SQLite3
- WebSockets

---

# Technical Architecture

The project follows a modular architecture where each layer is isolated by responsibility.

## Components

### Engine (`C++17`)

High-performance telemetry engine responsible for:

- Parsing Linux `/proc` memory statistics
- Collecting process-level metrics
- Computing OLS regression slopes
- Streaming telemetry data to the backend

### Bridge (`Node.js`)

Backend orchestration layer responsible for:

- Managing the C++ engine lifecycle
- Processing telemetry streams
- Computing Time-to-Failure estimates
- Persisting historical data into SQLite
- Broadcasting real-time updates using WebSockets

### Dashboard (`React 19 + Vite`)

Frontend visualization layer responsible for:

- Rendering real-time telemetry charts
- Displaying predictive system status
- Hydrating historical telemetry
- Live WebSocket synchronization

---

# Directory Structure

```text
├── engine/         # C++17 telemetry engine
├── bridge/         # Node.js backend orchestrator
├── dashboard/      # React dashboard UI
└── Documentation/  # Technical notes and screenshots
```

---

# Mathematical Foundation

## 1. OLS Linear Regression

The engine estimates memory growth rate using Ordinary Least Squares regression.

$$
m = \frac{n\sum(xy) - \sum x \sum y}{n\sum(x^2) - (\sum x)^2}
$$

## 2. Exponential Moving Average (EMA)

EMA smoothing is applied to reduce noise in telemetry streams.

$$
EMA_t = \alpha \cdot Value_t + (1 - \alpha) \cdot EMA_{t-1}
$$

## 3. Time-to-Failure (TTF)

Projected time remaining before memory exhaustion.

$$
TTF_{seconds} = \frac{AvailableRAM_{KB}}{GrowthSlope_{KB/s}}
$$

---

# Installation & Setup

## Prerequisites

- Linux (Ubuntu 20.04+ recommended)
- `g++` with C++17 support
- Node.js v18+
- SQLite3

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/Sagarrajak01/smart-monitor.git
cd smart-monitor
```

---

## 2. Build the C++ Engine

```bash
cd engine
make
```

---

## 3. Configure Backend Environment

Create a `.env` file inside `/bridge`:

```bash
cd ../bridge
touch .env
```

Add:

```env
PORT=3000
```

---

## 4. Start Backend Server

```bash
npm install
node server.js
```

---

## 5. Configure Frontend Environment

Open a new terminal:

```bash
cd ../dashboard
touch .env
```

Add:

```env
VITE_SOCKET_URL=http://localhost:3000
```

---

## 6. Launch Frontend

```bash
npm install
npm run dev
```

---

# Performance Notes

- Native telemetry collection implemented in C++17
- Low-overhead `/proc` parsing
- Rolling-window statistical analysis
- Real-time WebSocket streaming architecture
- SQLite-backed historical persistence

---

# Future Improvements

- Docker container telemetry support
- CPU and disk I/O analytics
- Anomaly detection models
- Alerting and notification system
- Exportable telemetry reports

---

**[Documentation](https://github.com/Sagarrajak01/smart-monitor/tree/main/Documentation)**
---

# License

MIT License

Copyright (c) 2026 Sagar Rajak