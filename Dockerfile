FROM node:22-bookworm AS builder

RUN apt-get update && apt-get install -y cmake g++ make python3

WORKDIR /app
COPY . .

WORKDIR /app/engine
RUN make clean || true
RUN make

WORKDIR /app/dashboard
RUN npm ci && npm run build

WORKDIR /app/bridge
RUN npm ci

FROM node:22-bookworm-slim AS production

RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/engine /app/engine
COPY --from=builder /app/bridge /app/bridge
COPY --from=builder /app/dashboard/dist /app/dashboard/dist

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/app/bridge/data

RUN mkdir -p /app/bridge/data && chown -R node:node /app/bridge/data

EXPOSE 3000

WORKDIR /app/bridge
CMD ["node", "server.js"]