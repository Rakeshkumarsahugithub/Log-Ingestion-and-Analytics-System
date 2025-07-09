import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const levels = [
  { value: 'error', label: 'Error', color: '#e53935', text: '#fff' },
  { value: 'warn', label: 'Warn', color: '#fbc02d', text: '#222' },
  { value: 'info', label: 'Info', color: '#1976d2', text: '#fff' },
  { value: 'debug', label: 'Debug', color: '#43a047', text: '#fff' },
];

const customLevelStyles = {
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: data.color,
    color: data.text,
    borderRadius: 6,
    fontWeight: 700,
    padding: '0 4px',
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.text,
    fontWeight: 700,
    padding: '0 6px',
    textTransform: 'uppercase',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.text,
    ':hover': { backgroundColor: '#fff', color: data.color },
  }),
  option: (styles, { data, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? data.color : isFocused ? '#e3ecfc' : '#fff',
    color: isSelected ? data.text : data.color,
    fontWeight: isSelected ? 700 : 500,
    textTransform: 'uppercase',
  }),
};

function FilterBar({ filters, setFilters }) {
  // Convert ISO string to Date for DatePicker
  const startDate = filters.timestamp_start ? new Date(filters.timestamp_start) : null;
  const endDate = filters.timestamp_end ? new Date(filters.timestamp_end) : null;

  // Toggle log level filter
  const toggleLevel = (level) => {
    setFilters(f => {
      const exists = f.level.includes(level);
      return { ...f, level: exists ? f.level.filter(l => l !== level) : [...f.level, level] };
    });
  };

  return (
     <div className="filter-bar" style={{ marginBottom: 18 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#2563eb' }}>
        <span role="img" aria-label="filter" style={{ fontSize: 22 }}>🔎</span>
        Filter Logs
      </h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 8, width: '100%', justifyContent: 'flex-start' }}>
        {levels.map(l => (
          <button
            key={l.value}
            type="button"
            onClick={() => toggleLevel(l.value)}
            style={{
              background: filters.level.includes(l.value) ? l.color : 'transparent',
              color: filters.level.includes(l.value) ? l.text : l.color,
              border: `2px solid ${l.color}`,
              borderRadius: 6,
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '7px 18px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              outline: 'none',
              boxShadow: filters.level.includes(l.value) ? '0 2px 8px rgba(30,64,175,0.08)' : 'none',
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="filter-grid">
        <input
          type="text"
          name="message"
          placeholder="Search message..."
          value={filters.message}
          onChange={e => setFilters(f => ({ ...f, message: e.target.value }))}
        />
        <div>
          <Select
            isMulti
            name="level"
            options={levels}
            value={levels.filter(l => filters.level.includes(l.value))}
            onChange={selected => setFilters(f => ({ ...f, level: selected.map(s => s.value) }))}
            placeholder="Level"
            styles={customLevelStyles}
            closeMenuOnSelect={false}
          />
        </div>
        <input
          type="text"
          name="resourceId"
          placeholder="Resource ID"
          value={filters.resourceId}
          onChange={e => setFilters(f => ({ ...f, resourceId: e.target.value }))}
        />
        <input
          type="text"
          name="traceId"
          placeholder="Trace ID"
          value={filters.traceId || ''}
          onChange={e => setFilters(f => ({ ...f, traceId: e.target.value }))}
        />
        <input
          type="text"
          name="spanId"
          placeholder="Span ID"
          value={filters.spanId || ''}
          onChange={e => setFilters(f => ({ ...f, spanId: e.target.value }))}
        />
        <input
          type="text"
          name="commit"
          placeholder="Commit"
          value={filters.commit || ''}
          onChange={e => setFilters(f => ({ ...f, commit: e.target.value }))}
        />
        <div>
          <DatePicker
            selected={startDate}
            onChange={date => setFilters(f => ({ ...f, timestamp_start: date ? date.toISOString() : '' }))}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Start date/time"
            className="date-picker"
            isClearable
          />
        </div>
        <div>
          <DatePicker
            selected={endDate}
            onChange={date => setFilters(f => ({ ...f, timestamp_end: date ? date.toISOString() : '' }))}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="End date/time"
            className="date-picker"
            isClearable
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBar;