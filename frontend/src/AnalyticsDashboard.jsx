// // AnalyticsDashboard.jsx
// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// const levelColors = {
//   error: '#e53935',
//   warn: '#fbc02d',
//   info: '#1976d2',
//   debug: '#43a047',
// };
// const levelIcons = {
//   error: '⚠️',
//   warn: '!',
//   info: 'ℹ️',
//   debug: '🐞',
// };

// function getLevelCounts(logs) {
//   const counts = { error: 0, warn: 0, info: 0, debug: 0 };
//   logs.forEach(log => {
//     if (counts[log.level] !== undefined) counts[log.level]++;
//   });
//   return Object.entries(counts).map(([level, count]) => ({ level, count }));
// }

// function CustomLegend() {
//   return (
//     <div style={{ display: 'flex', gap: 18, marginBottom: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
//       {Object.entries(levelColors).map(([level, color]) => (
//         <span key={level} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '1rem', color: '#1a2233' }}>
//           <span style={{ width: 16, height: 16, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 4, border: '2px solid #fff', boxShadow: '0 1px 4px rgba(30,64,175,0.08)' }}></span>
//           {levelIcons[level]} {level.charAt(0).toUpperCase() + level.slice(1)}
//         </span>
//       ))}
//     </div>
//   );
// }

// function AnalyticsDashboard({ logs }) {
//   const data = getLevelCounts(logs);
//   return (
//     <div style={{
//       margin: '32px 0',
//       background: '#fff',
//       borderRadius: 20,
//       boxShadow: '0 4px 24px rgba(30,64,175,0.10)',
//       border: '1.5px solid #e0e7ef',
//       padding: 0,
//       width: '100%',
//       fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
//     }}>
//       <div style={{
//         background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
//         color: '#fff',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         padding: '22px 24px 12px 24px',
//         fontWeight: 800,
//         fontSize: '1.45rem',
//         letterSpacing: 1,
//         display: 'flex',
//         alignItems: 'center',
//         gap: 12,
//         justifyContent: 'center',
//       }}>
//         <span style={{ fontSize: 28, marginRight: 8 }}>📊</span> Log Count by Level
//       </div>
//       <div style={{ padding: '28px 24px 36px 24px' }}>
//         <CustomLegend />
//         <div style={{ width: '100%', height: 340 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis 
//                 dataKey="level" 
//                 style={{ textTransform: 'capitalize' }} 
//                 label={{ 
//                   value: 'Level', 
//                   position: 'insideBottom', 
//                   offset: -5, 
//                   fontSize: 18, 
//                   fill: '#1a2233' 
//                 }} 
//               />
//               <YAxis 
//                 allowDecimals={false} 
//                 label={{ 
//                   value: 'Count', 
//                   angle: -90, 
//                   position: 'insideLeft', 
//                   fontSize: 18, 
//                   fill: '#1a2233' 
//                 }} 
//               />
//               <Tooltip />
//               <Bar dataKey="count" isAnimationActive fill="#8884d8">
//                 {data.map((entry, idx) => (
//                   <cell key={`cell-${idx}`} fill={levelColors[entry.level]} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AnalyticsDashboard;

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const levelColors = {
  error: '#e53935',
  warn: '#fbc02d',
  info: '#1976d2',
  debug: '#43a047',
};
const levelIcons = {
  error: '⚠️',
  warn: '!',
  info: 'ℹ️',
  debug: '🐞',
};

function getLevelCounts(logs) {
  const counts = { error: 0, warn: 0, info: 0, debug: 0 };
  logs.forEach(log => {
    if (counts[log.level] !== undefined) counts[log.level]++;
  });
  return Object.entries(counts).map(([level, count]) => ({ level, count }));
}

function CustomLegend() {
  return (
    <div style={{ display: 'flex', gap: 18, marginBottom: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
      {Object.entries(levelColors).map(([level, color]) => (
        <span key={level} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '1rem', color: '#1a2233' }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 4, border: '2px solid #fff', boxShadow: '0 1px 4px rgba(30,64,175,0.08)' }}></span>
          {levelIcons[level]} {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
      ))}
    </div>
  );
}

function AnalyticsDashboard({ logs }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Set true for mobile view
  const data = getLevelCounts(logs);

  // Update the screen size dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Choose margin based on screen size
  const barChartMargin = isMobile
    ? { left: 10, right: 10, top: 10, bottom: 10 }
    : { left: 110, right: 110, top: 10, bottom: 10 };

  return (
    <div style={{
      margin: '32px 0',
      background: '#fff',
      borderRadius: 20,
      boxShadow: '0 4px 24px rgba(30,64,175,0.10)',
      border: '1.5px solid #e0e7ef',
      padding: 0,
      width: '100%',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    }}>
      <div style={{
        background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
        color: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: '22px 24px 12px 24px',
        fontWeight: 800,
        fontSize: '1.45rem',
        letterSpacing: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: 28, marginRight: 8 }}>📊</span> Log Count by Level
      </div>
      <div style={{ padding: '28px 24px 36px 24px' }}>
        <CustomLegend />
        <div style={{ width: '100%', height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={barChartMargin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="level" 
                style={{ textTransform: 'capitalize' }} 
                label={{ 
                  value: 'Level', 
                  position: 'insideBottom', 
                  offset: -5, 
                  fontSize: 18, 
                  fill: '#1a2233' 
                }} 
              />
              <YAxis 
                allowDecimals={false} 
                label={{ 
                  value: 'Count', 
                  angle: -90, 
                  position: 'insideLeft', 
                  fontSize: 18, 
                  fill: '#1a2233' 
                }} 
              />
              <Tooltip />
              <Bar dataKey="count" isAnimationActive fill="#8884d8">
                {data.map((entry, idx) => (
                  <cell key={`cell-${idx}`} fill={levelColors[entry.level]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
