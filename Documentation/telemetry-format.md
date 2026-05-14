# Telemetry Format

The C++ engine streams newline-delimited JSON telemetry payloads to the Node.js bridge through stdout pipes.

## Sample Payload

```json
{
  "pid": 6890,
  "raw_kb": 62272,
  "ema_kb": 62086,
  "slope": 69.6667,
  "status": "WARNING",
  "ttf": 42335.692662348,
  "name": "Initial-System",
  "timestamp": 1778782942122
}
```

## Fields

| Field | Description |
|---|---|
| `pid` | Process ID |
| `raw_kb` | Raw memory usage |
| `ema_kb` | EMA-smoothed memory value |
| `slope` | OLS memory growth rate |
| `status` | Memory risk state |
| `ttf` | Estimated time-to-failure |
| `name` | Process name |
| `timestamp` | UNIX timestamp (ms) |