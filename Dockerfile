# Equity Research AI Terminal — single-container image
# Serves both the API and the static frontend from one Node process.

FROM node:20-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install --omit=dev

COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend
ENV PORT=3001
EXPOSE 3001

CMD ["node", "server.js"]
