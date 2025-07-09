import React, { useState, useRef } from 'react';

const initialLog = {
  level: 'error',
  message: '',
  resourceId: '',
  timestamp: '',
  traceId: '',
  spanId: '',
  commit: '',
  metadata: '{}',
};

const levels = [
  { value: 'error', label: 'Error', color: '#e53935', text: '#fff', icon: '⚠️' },
  { value: 'warn', label: 'Warn', color: '#fbc02d', text: '#222', icon: '!' },
  { value: 'info', label: 'Info', color: '#1976d2', text: '#fff', icon: 'ℹ️' },
  { value: 'debug', label: 'Debug', color: '#43a047', text: '#fff', icon: '🐞' },
];

function LogIngestor({ onSuccess }) {
  const [log, setLog] = useState(initialLog);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownFocus, setDropdownFocus] = useState(-1);
  const dropdownRef = useRef();

  const handleChange = e => {
    const { name, value } = e.target;
    setLog(l => ({ ...l, [name]: value }));
  };

  const handleDropdownToggle = () => setDropdownOpen(open => !open);
  const handleDropdownBlur = (e) => {
    if (!dropdownRef.current.contains(e.relatedTarget)) setDropdownOpen(false);
  };
  const handleLevelSelect = (level) => {
    setLog(l => ({ ...l, level }));
    setDropdownOpen(false);
    setDropdownFocus(-1);
  };
  const handleDropdownKeyDown = (e) => {
    if (!dropdownOpen) return;
    if (e.key === 'ArrowDown') {
      setDropdownFocus(f => (f + 1) % levels.length);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setDropdownFocus(f => (f - 1 + levels.length) % levels.length);
      e.preventDefault();
    } else if (e.key === 'Enter' && dropdownFocus >= 0) {
      handleLevelSelect(levels[dropdownFocus].value);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
      setDropdownFocus(-1);
      e.preventDefault();
    }
  };

  const handleDropdownOpen = () => {
    setDropdownOpen(true);
    setDropdownFocus(levels.findIndex(l => l.value === log.level));
  };

  // Restore handleSubmit
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    let parsedMetadata;
    try {
      parsedMetadata = JSON.parse(log.metadata);
    } catch {
      setError('Metadata must be valid JSON');
      return;
    }
    const payload = { ...log, metadata: parsedMetadata };
    try {
      const res = await fetch('http://localhost:4000/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to ingest log');
      }
      setLog(initialLog);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  const selectedLevel = levels.find(l => l.value === log.level);

  return (
    <form className="log-ingestor" onSubmit={handleSubmit} style={{marginBottom:20, width:'100%', gap:18}}>
      <h2 style={{marginRight:12, fontSize:'1.1rem', fontWeight:700, color:'#2563eb'}}>Ingest New Log</h2>
      {/* Custom dropdown for log level */}
      <div
        className="ingest-dropdown"
        ref={dropdownRef}
        tabIndex={-1}
        onBlur={handleDropdownBlur}
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        style={{ position: 'relative' }}
      >
        <button
          type="button"
          onClick={handleDropdownToggle}
          onFocus={handleDropdownOpen}
          onKeyDown={handleDropdownKeyDown}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          // Restore previous inline style for color and background
          style={{
            width: '100%',
            minWidth: 180,
            maxWidth: 180,
            padding: '9px 14px',
            border: '1.5px solid #b6c6e3',
            borderRadius: 8,
            fontSize: '1.05rem',
            background: selectedLevel ? selectedLevel.color : '#f8fafc',
            color: selectedLevel ? selectedLevel.text : '#1a2233',
            textAlign: 'left',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textTransform: 'uppercase',
            boxShadow: dropdownOpen ? '0 4px 16px rgba(30,64,175,0.10)' : 'none',
            transition: 'box-shadow 0.2s',
          }}
          tabIndex={0}
        >
          {selectedLevel ? (
            <>
              <span style={{ fontSize: 18, marginRight: 6 }}>{selectedLevel.icon}</span>
              {selectedLevel.label}
            </>
          ) : <span style={{color:'#b6c6e3'}}>Select...</span>}
          <span style={{ marginLeft: 'auto', color: '#b6c6e3', fontSize: 18, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>&#9662;</span>
        </button>
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            width: '100%',
            maxWidth: '100%',
            background: '#fff',
            border: '1.5px solid #b6c6e3',
            borderRadius: 10,
            boxShadow: dropdownOpen ? '0 8px 32px rgba(30,64,175,0.13)' : 'none',
            zIndex: 20,
            padding: dropdownOpen ? 8 : 0,
            display: dropdownOpen ? 'flex' : 'none',
            flexDirection: 'column',
            gap: 4,
            opacity: dropdownOpen ? 1 : 0,
            pointerEvents: dropdownOpen ? 'auto' : 'none',
            transition: 'opacity 0.18s cubic-bezier(.4,0,.2,1)'
          }}
          role="listbox"
        >
          {levels.map((l, idx) => (
            <button
              key={l.value}
              type="button"
              onClick={() => handleLevelSelect(l.value)}
              role="option"
              aria-selected={log.level === l.value}
              style={{
                background: log.level === l.value ? l.color : dropdownFocus === idx ? '#e3ecfc' : 'transparent',
                color: log.level === l.value ? l.text : l.color,
                border: `2px solid ${l.color}`,
                borderRadius: 7,
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '7px 12px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s',
                outline: dropdownFocus === idx ? '2px solid #2563eb' : 'none',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: log.level === l.value ? '0 2px 8px rgba(30,64,175,0.10)' : 'none',
                justifyContent: 'flex-start',
                textAlign: 'left',
              }}
              tabIndex={-1}
              onMouseEnter={() => setDropdownFocus(idx)}
            >
              <span style={{ fontSize: 18 }}>{l.icon}</span>
              {l.label}
              {log.level === l.value && (
                <span style={{ marginLeft: 'auto', fontSize: 18, color: l.text }}>✔</span>
              )}
            </button>
          ))}
        </div>
      </div>
      <input name="message" value={log.message} onChange={handleChange} placeholder="Message" required className="ingest-input" />
      <input name="resourceId" value={log.resourceId} onChange={handleChange} placeholder="Resource ID" required className="ingest-input" />
      <input name="timestamp" type="datetime-local" value={log.timestamp} onChange={handleChange} required className="ingest-input date-picker" />
      <input name="traceId" value={log.traceId} onChange={handleChange} placeholder="Trace ID" required className="ingest-input" />
      <input name="spanId" value={log.spanId} onChange={handleChange} placeholder="Span ID" required className="ingest-input" />
      <input name="commit" value={log.commit} onChange={handleChange} placeholder="Commit" required className="ingest-input" />
      <input name="metadata" value={log.metadata} onChange={handleChange} placeholder='Metadata (JSON)' required className="ingest-input metadata-input" />
      <button type="submit" className="ingest-input">Ingest Log</button>
      {error && <div style={{color:'red', flexBasis:'100%'}}>{error}</div>}
      {success && <div style={{color:'green', flexBasis:'100%'}}>Log ingested!</div>}
    </form>
  );
}

export default LogIngestor; 