const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'logs.json');

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ensure the JSON file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '[]', 'utf-8');
}

// Helper to read logs
function readLogs() {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper to write logs
function writeLogs(logs) {
  fs.writeFileSync(DB_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}

// Log schema validation function
function validateLog(log) {
  const requiredFields = [
    'level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'
  ];
  const levels = ['error', 'warn', 'info', 'debug'];
  if (!log || typeof log !== 'object') return false;
  for (const field of requiredFields) {
    if (!(field in log)) return false;
  }
  if (!levels.includes(log.level)) return false;
  if (typeof log.message !== 'string') return false;
  if (typeof log.resourceId !== 'string') return false;
  if (typeof log.timestamp !== 'string' || isNaN(Date.parse(log.timestamp))) return false;
  if (typeof log.traceId !== 'string') return false;
  if (typeof log.spanId !== 'string') return false;
  if (typeof log.commit !== 'string') return false;
  if (typeof log.metadata !== 'object' || Array.isArray(log.metadata) || log.metadata === null) return false;
  return true;
}

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcastLog(log) {
  const msg = JSON.stringify({ type: 'new_log', log });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

function broadcastRefresh() {
  const msg = JSON.stringify({ type: 'refresh' });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// POST /logs - Ingest a log entry with validation
app.post('/logs', (req, res) => {
  const log = req.body;
  if (!validateLog(log)) {
    return res.status(400).json({ error: 'Invalid log schema' });
  }
  try {
    const logs = readLogs();
    logs.push(log);
    writeLogs(logs);
    broadcastLog(log); // Broadcast to WebSocket clients
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to persist log' });
  }
});


// GET /logs - Retrieve logs with filtering
app.get('/logs', (req, res) => {
  try {
    let logs = readLogs();
    const { level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit } = req.query;
    if (level) {
      const levels = Array.isArray(level) ? level : [level];
      logs = logs.filter(log => levels.includes(log.level));
    }
    if (message) {
      logs = logs.filter(log => log.message.toLowerCase().includes(message.toLowerCase()));
    }
    if (resourceId) {
      logs = logs.filter(log => log.resourceId === resourceId);
    }
    if (timestamp_start) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(timestamp_start));
    }
    if (timestamp_end) {
      logs = logs.filter(log => new Date(log.timestamp) <= new Date(timestamp_end));
    }
    if (traceId) {
      logs = logs.filter(log => log.traceId === traceId);
    }
    if (spanId) {
      logs = logs.filter(log => log.spanId === spanId);
    }
    if (commit) {
      logs = logs.filter(log => log.commit === commit);
    }
    logs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// --- FILE WATCHER FOR LIVE UPDATES ON MANUAL EDITS ---
fs.watch(DB_FILE, (eventType, filename) => {
  if (eventType === 'change') {
    console.log('logs.json changed, broadcasting refresh to clients...');
    broadcastRefresh();
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});