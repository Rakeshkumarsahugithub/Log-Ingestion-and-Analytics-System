import React, { useState } from 'react';

const levelColors = {
  error: '#ffe5e5',
  warn: '#fffbe5',
  info: '#e5f0ff',
  debug: '#e5ffe5',
};

function LogList({ logs }) {
  if (!logs.length) return <div>No logs found.</div>;
  return (
    <div>
      {/* Table for desktop */}
      <table className="log-list">
        <thead>
          <tr>
            <th>Level</th>
            <th>Message</th>
            <th>Resource ID</th>
            <th>Timestamp</th>
            <th>Trace ID</th>
            <th>Span ID</th>
            <th>Commit</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} style={{ background: levelColors[log.level] || '#fff' }}>
              <td className={`log-level ${log.level}`}>{log.level}</td>
              <td>{log.message}</td>
              <td>{log.resourceId}</td>
              <td>{log.timestamp}</td>
              <td>{log.traceId}</td>
              <td>{log.spanId}</td>
              <td>{log.commit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Card view for mobile */}
      <div className="log-cards">
        {logs.map((log, idx) => (
          <div className="log-card" key={idx} style={{ background: levelColors[log.level] || '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <span className={`log-level ${log.level}`} style={{ fontWeight: 'bold', textTransform: 'uppercase', marginRight: 8 }}>{log.level}</span>
              <span style={{ fontSize: '0.98rem', color: '#1a2233', fontWeight: 600 }}>{log.message}</span>
            </div>
            <div style={{ fontSize: '0.93rem', color: '#3b4252', marginBottom: 2 }}><b>Resource:</b> {log.resourceId}</div>
            <div style={{ fontSize: '0.93rem', color: '#3b4252', marginBottom: 2 }}><b>Time:</b> {log.timestamp}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: '0.91rem', color: '#4b5563' }}>
              <div><b>Trace:</b> {log.traceId}</div>
              <div><b>Span:</b> {log.spanId}</div>
              <div><b>Commit:</b> {log.commit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogList; 