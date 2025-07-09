# Real-time Log Ingestion and Analytics System using WebSocket

A modern, full-stack log management system built with Node.js, Express, React, and WebSocket for real-time log ingestion, querying, and analytics. This project demonstrates scalable architecture patterns for handling structured log data with real-time updates and comprehensive filtering capabilities. Think of it like a smart log viewer that updates instantly when new logs arrive. 
<div style="display: flex; justify-content: space-between; align-items: center;">
  <img src="https://github.com/user-attachments/assets/19690dba-afea-445d-abce-c5a4a2353279" width="300" height="650" style="margin-right: 10px;">
  <img src="https://github.com/user-attachments/assets/6c4701b5-4427-4def-9e9f-6512267a7762" width="300" height="650">
</div>
<div style="display: flex; justify-content: space-between; align-items: center;">
  <img src="https://github.com/user-attachments/assets/7082b7b7-bc65-488d-bc5f-39a714f8bd38" width="300" height="650" style="margin-right: 10px;">
  <img src="https://github.com/user-attachments/assets/069fe048-65b4-4012-9d76-ad430b3d68cf" width="300" height="650">
</div>





## 🚀 Features

### Core Functionality
- **Real-time Log Ingestion**: WebSocket-powered live log streaming with instant UI updates
- **Live Log Collection**: New logs appear instantly on your screen without refreshing
- **Advanced Querying**: Multi-criteria filtering with AND logic across all log fields
- **Smart Search**: Find logs using multiple filters at the same time
- **Analytics Dashboard**: Visual insights with charts and metrics for log analysis
- **Visual Analytics**: See charts and graphs of your log data
- **Schema Validation**: Robust backend validation ensuring data integrity
- **Data Validation**: Ensures all log data is correct before saving
- **Responsive Design**: Modern, developer-friendly UI that works across devices

### Filtering Capabilities
- **Full-text Search**: Case-insensitive message content search
- **Text Search**: Find logs containing specific words
- **Log Levels**: Filter by error, warning, info, or debug messages
- **Multi-level Filtering**: Support for error, warn, info, debug levels
- **Custom Data**: Store and search through additional log information
- **Resource Tracking**: Filter by resource ID, trace ID, span ID, and commit hash
- **Time-based Queries**: Precise timestamp range filtering
- **Metadata Support**: JSON metadata validation and storage

## 🏗️ Architecture Overview

### Design Patterns Implemented

#### 1. **Repository Pattern** (Backend)
- **File-based Repository**: `logs.json` as a simple, persistent data store (like a digital notebook)
- **Abstracted Data Access**: Helper functions handle reading and writing data (`readLogs()`, `writeLogs()`) encapsulate file operations
- **Future-Proof**: Easy to swap with database implementations (MySQL, MongoDB, etc.)

#### 2. **Observer Pattern** (Real-time Updates)
- **WebSocket Broadcasting**: Server notifies all connected clients of new logs
- **Event-driven Architecture**: Decoupled communication between backend and frontend
- **Automatic Reconnection**: Robust WebSocket connection management with exponential backoff

#### 3. **Component Composition** (Frontend)
- **Single Responsibility**: Each component handles one specific concern
- **Props-based Communication**: Clean data flow from parent to child components
- **Custom Hooks**: Reusable logic extraction (debouncing, WebSocket management)

#### 4. **Command Pattern** (API Design)
- **RESTful Endpoints**: Clear separation of concerns (POST for ingestion, GET for querying)
- **Clear Endpoints**: Different URLs for different actions (add logs, search logs)
- **Query Builder**: Dynamic URL parameter construction for complex filtering
- **Smart Queries**: Builds search requests automatically based on your filters
- **Validation Middleware**: Centralized input validation and error handling

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js framework
- **Real-time**: WebSocket (ws) for live updates
- **Persistence**: File-based JSON storage (easily replaceable)
- **Validation**: Custom schema validation middleware
- **Data Validation**: Checks that all data is correct before saving
- **Development**: Nodemon for hot reloading

### Frontend
- **Framework**: React 19 with Vite build tool
- **State Management**: React hooks (useState, useEffect, useRef)
- **UI Components**: Custom components with modern CSS
- **Data Visualization**: Recharts for analytics dashboard
- **Date Handling**: React-datepicker for timestamp selection
- **Multi-select**: React-select for level filtering

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: For cloning the repository

### Step 1: Download the Code
```bash
git clone <repository-url>
cd logingio
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Backend will run on:** http://localhost:4000

### Step 3: Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on:** http://localhost:5173

### Step 4: Verify Installation
1. Open http://localhost:5173 in your browser
2. Check WebSocket status indicator (should show "connected")
3. Try ingesting a test log using the form
4. Verify real-time updates appear in the log list

## 🎯 Usage Guide

### Ingesting Logs
1. **Fill Required Fields**: All fields are mandatory and validated
2. **Metadata Format**: Must be valid JSON object (e.g., `{"user": "john", "action": "login"}`)
3. **Timestamp**: Use ISO 8601 format (automatically handled by date picker)
4. **Submit**: Click "Ingest Log" to add to the system

### Querying Logs
1. **Text Search**: Enter keywords in the message field for full-text search
2. **Level Filtering**: Select multiple log levels (error, warn, info, debug)
3. **Resource Filtering**: Filter by specific resource ID, trace ID, or span ID
4. **Time Range**: Set start and end timestamps for time-based filtering
5. **Combined Filters**: All filters work together with AND logic

### Analytics Dashboard
- **Log Distribution**: Visual breakdown of logs by level
- **Time Trends**: Log volume over time analysis
- **Resource Usage**: Most active resources and trace patterns

## 🏛️ Design Decisions & Trade-offs

### 1. **File-based Persistence**
**Decision**: Using `logs.json` for data storage
**Rationale**: 
- ✅ Simple setup, no external dependencies
- ✅ Easy to inspect and debug data
- ✅ Meets assignment requirements
- ❌ Limited scalability for high-volume logs
- ❌ No concurrent write safety

**Future Enhancement**: Implement database adapter pattern for MySQL/PostgreSQL

### 2. **WebSocket for Real-time Updates**
**Decision**: WebSocket over Server-Sent Events or polling
**Rationale**:
- ✅ Bidirectional communication capability
- ✅ Lower latency than polling
- ✅ Efficient for real-time log streaming
- ❌ More complex connection management
- ❌ Requires fallback for connection issues

### 3. **In-memory Filtering**
**Decision**: Client-side filtering vs server-side pagination
**Rationale**:
- ✅ Instant filter response
- ✅ Reduces server load
- ✅ Better user experience
- ❌ Limited to client memory constraints
- ❌ Not suitable for very large datasets

### 4. **Component Architecture**
**Decision**: Functional components with hooks over class components
**Rationale**:
- ✅ Modern React patterns
- ✅ Better performance with hooks
- ✅ Easier testing and maintenance
- ✅ Smaller bundle size

### 5. **Validation Strategy**
**Decision**: Backend-only validation with detailed error messages
**Rationale**:
- ✅ Single source of truth for data integrity
- ✅ Prevents invalid data persistence
- ✅ Clear error feedback to users
- ❌ Additional server round-trip for validation

## 📁 Project Structure

```
logingio/
├── backend/
│   ├── index.js          # Main server with WebSocket and REST API
│   ├── logs.json         # File-based data store
│   ├── package.json      # Backend dependencies
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main application component
│   │   ├── LogIngestor.jsx    # Log ingestion form
│   │   ├── FilterBar.jsx      # Advanced filtering interface
│   │   ├── LogList.jsx        # Log display with pagination
│   │   ├── AnalyticsDashboard.jsx  # Charts and metrics
│   │   ├── App.css       # Global styles
│   │   └── main.jsx      # Application entry point
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
└── README.md
```

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev      # Start development server with hot reload
npm test         # Run tests (when implemented)
```

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🚀 Production Deployment

### Environment Variables
```bash
# Backend
PORT=4000                    # Server port
NODE_ENV=production          # Environment mode

# Frontend
VITE_API_URL=http://localhost:4000  # Backend API URL
```

### Build Process
```bash
# Backend
cd backend
npm install --production
npm start

# Frontend
cd frontend
npm run build
# Serve dist/ folder with nginx or similar

**Note**: This system is designed for development and demonstration purposes. For production use, consider implementing the suggested scalability improvements and security measures.
