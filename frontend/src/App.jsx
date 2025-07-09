// App.jsx
import { useState, useEffect, useRef } from 'react';
import FilterBar from './FilterBar';
import LogList from './LogList';
import LogIngestor from './LogIngestor';
import AnalyticsDashboard from './AnalyticsDashboard';
import './App.css';

function buildQuery(filters) {
  const params = [];
  if (filters.message) params.push(`message=${encodeURIComponent(filters.message)}`);
  if (filters.level.length) filters.level.forEach(l => params.push(`level=${encodeURIComponent(l)}`));
  if (filters.resourceId) params.push(`resourceId=${encodeURIComponent(filters.resourceId)}`);
  if (filters.traceId) params.push(`traceId=${encodeURIComponent(filters.traceId)}`);
  if (filters.spanId) params.push(`spanId=${encodeURIComponent(filters.spanId)}`);
  if (filters.commit) params.push(`commit=${encodeURIComponent(filters.commit)}`);
  if (filters.timestamp_start) params.push(`timestamp_start=${encodeURIComponent(filters.timestamp_start)}`);
  if (filters.timestamp_end) params.push(`timestamp_end=${encodeURIComponent(filters.timestamp_end)}`);
  return params.length ? `?${params.join('&')}` : '';
}

function logMatchesFilters(log, filters) {
  if (filters.message && !log.message.toLowerCase().includes(filters.message.toLowerCase())) return false;
  if (filters.level.length && !filters.level.includes(log.level)) return false;
  if (filters.resourceId && log.resourceId !== filters.resourceId) return false;
  if (filters.timestamp_start && new Date(log.timestamp) < new Date(filters.timestamp_start)) return false;
  if (filters.timestamp_end && new Date(log.timestamp) > new Date(filters.timestamp_end)) return false;
  return true;
}

function App() {
  const [filters, setFilters] = useState({
    message: '',
    level: [],
    resourceId: '',
    traceId: '',
    spanId: '',
    commit: '',
    timestamp_start: '',
    timestamp_end: '',
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wsStatus, setWsStatus] = useState('disconnected');
  const debounceRef = useRef();
  const wsRef = useRef();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = logs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const fetchLogs = () => {
    console.log('Fetching logs from backend...');
    setLoading(true);
    setError('');
    fetch(`http://localhost:4000/logs${buildQuery(filters)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
      })
      .then(data => {
        console.log('Fetched logs:', data);
        setLogs(data);
      })
      .catch(() => setError('Failed to fetch logs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchLogs, 300);
    return () => clearTimeout(debounceRef.current);
  }, [filters]);

  useEffect(() => { setPage(1); }, [filters]);

  // WebSocket connection management


useEffect(() => {
  let reconnectTimeout;
  let isComponentMounted = true;

  const connectWebSocket = () => {
    if (!isComponentMounted) return;

    try {
      console.log('Attempting to connect to WebSocket...');
      setWsStatus('connecting');
      const ws = new WebSocket('ws://localhost:5173/ws');

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setWsStatus('connected');
      };

      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new_log' || data.type === 'refresh') {
            console.log('Received event, calling fetchLogs()');
            fetchLogs();
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsStatus('error');
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setWsStatus('disconnected');
        if (isComponentMounted && !event.wasClean) {
          console.log('Attempting to reconnect in 3 seconds...');
          reconnectTimeout = setTimeout(connectWebSocket, 3000);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setWsStatus('error');
      if (isComponentMounted) {
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      }
    }
  };

  const initialTimeout = setTimeout(connectWebSocket, 1000);

  return () => {
    isComponentMounted = false;
    clearTimeout(initialTimeout);
    clearTimeout(reconnectTimeout);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };
}, []);

  // Update filters in the WebSocket message handler
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // The WebSocket connection is already established, just update the filters
      // The logMatchesFilters function will use the current filters state
    }
  }, [filters]);
  

  return (
    <div className="app-container">
      <div className="header">
        Log Ingestion & Querying System
        <div style={{ 
          fontSize: '0.8rem', 
          marginTop: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>WebSocket:</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            backgroundColor: 
              wsStatus === 'connected' ? '#10b981' :
              wsStatus === 'connecting' ? '#f59e0b' :
              wsStatus === 'error' ? '#ef4444' : '#6b7280',
            color: 'white'
          }}>
            {wsStatus}
          </span>
        </div>
      </div>
      <div className="main-content">
        <div className="content-wrapper" style={{ maxWidth: '100%', padding: '0 24px' }}>
          <div className="sticky-bar">
            <LogIngestor onSuccess={fetchLogs} />
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>
          <div className="analytics-section">
            <AnalyticsDashboard logs={logs} />
          </div>
          <div className="log-section">
            {loading && <div>Loading...</div>}
            {error && <div style={{color:'red'}}>{error}</div>}
            <LogList logs={paginatedLogs} />
            {totalPages > 1 && (
              <div className="pagination-controls" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 16, 
                marginTop: 16 
              }}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  style={{ 
                    padding: '6px 16px', 
                    borderRadius: 5, 
                    border: '1.5px solid #2563eb', 
                    background: page === 1 ? '#e3ecfc' : '#2563eb', 
                    color: page === 1 ? '#888' : '#fff', 
                    cursor: page === 1 ? 'not-allowed' : 'pointer', 
                    fontWeight: 600 
                  }}
                >
                  Previous
                </button>
                <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                  Page {page} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  style={{ 
                    padding: '6px 16px', 
                    borderRadius: 5, 
                    border: '1.5px solid #2563eb', 
                    background: page === totalPages ? '#e3ecfc' : '#2563eb', 
                    color: page === totalPages ? '#888' : '#fff', 
                    cursor: page === totalPages ? 'not-allowed' : 'pointer', 
                    fontWeight: 600 
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="footer">
        &copy; 2025 Log Ingestion & Querying System &mdash; Powered by React, Vite, and Node.js
      </div>
    </div>
  );
}

export default App;