## **Embedded Deployment Strategy (Docker)**

The Smart Monitor is containerized using a multi-stage Docker deployment pipeline designed for Linux servers and edge environments.

### **1. Multi-Stage Build Architecture**

To minimize runtime overhead, the application is built using separate compilation and production stages.

* **Builder Stage:** Uses `node:22-bookworm` with the GNU toolchain (`g++`, `make`) to compile the C++ telemetry engine, install backend dependencies, and generate the production React bundle.
* **Production Stage:** Deploys on `node:22-bookworm-slim`, excluding build dependencies and reducing the final container footprint.
* **Native Dependency Compatibility:** Debian-based images ensure compatibility with native modules such as `better-sqlite3` and the C++ monitoring engine.

### **2. Host Process Visibility**

The monitoring engine requires access to host-level process information exposed through Linux `/proc`.

* **Host PID Namespace:** Docker Compose enables `pid: "host"`, allowing the containerized engine to inspect and monitor processes running on the host machine.
* **Runtime Process Utilities:** Installs `procps` in the production image to support process discovery and PID resolution.

### **3. Persistent Telemetry Storage**

Historical telemetry data is preserved independently of container lifecycles.

* **Named Docker Volume:** SQLite data is mounted through the `smart-monitor-data` volume.
* **Externalized Storage Path:** The persistence layer uses the configurable `DATA_DIR` environment variable to separate application code from stored telemetry data.
* **Container Recreation Safety:** Historical monitoring data remains available across container restarts, upgrades, and redeployments.

### **4. Deployment Characteristics**

* Multi-stage optimized container images.
* Native C++ telemetry engine execution inside Docker.
* Host-level process monitoring support.
* Persistent SQLite-backed telemetry storage.
* Single-command deployment using Docker Compose.
