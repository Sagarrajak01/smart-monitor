## Day 2: Temporal Analysis & Trend Detection Engine

### **Objective**
To transition the `smart-monitor` from a static data scraper to an intelligent diagnostic tool capable of identifying **patterns** in resource consumption rather than just snapshots.

---

### **1. Key Implementation: The Ring Buffer (Data Persistence)**
I implemented a **Circular Buffer** using `std::deque`. This allows the engine to maintain a "sliding window" of the last $N$ seconds of process activity (currently configured to 20–60 seconds).
*   **Engineering Logic:** Unlike a standard vector, a deque allows $O(1)$ complexity for adding new data points and removing expired ones, ensuring the engine maintains a constant memory footprint (Zero Leak Design).

### **2. Mathematical Smoothing: EMA (Exponential Moving Average)**
To prevent "False Positives" caused by minor, temporary memory fluctuations in the Linux kernel, I implemented an **EMA** filter.
*   **The Formula:** $EMA_t = (\alpha \cdot Raw_t) + (1 - \alpha) \cdot EMA_{t-1}$
*   **The Benefit:** It "smooths" the data, allowing the monitor to ignore noise while remaining responsive to significant shifts in memory allocation.



### **3. The "ML" Logic: Real-time Linear Regression**
I implemented the **Ordinary Least Squares (OLS)** algorithm to calculate the **Slope ($m$)** of the memory usage over the sliding window.
*   **Functionality:** The engine treats the time-series data in the Ring Buffer as a dataset and calculates the gradient of growth.
*   **Detection Strategy:**
    *   **Slope $\approx$ 0:** Stable state.
    *   **Slope > 0:** Active allocation or potential memory leak.
    *   **Slope < 0:** Memory deallocation/cleanup.

---

### **Technical Achievements**
*   **Heuristic Analysis:** The tool can now distinguish between a "One-time Spike" (where the slope eventually returns to zero) and a "Continuous Leak" (where the slope remains positive).
*   **Low Overhead:** All mathematical calculations are performed using primitive types and basic arithmetic to ensure the monitoring agent consumes less than 1% of CPU resources.

### **Verification Results**
*   **Target:** Verified on PID `150448`.
*   **Observation:** Successfully captured a +28 KB allocation event. The engine reacted with an initial slope of `14` which gradually "decayed" as the memory stabilized, confirming the mathematical accuracy of the regression logic.

---
