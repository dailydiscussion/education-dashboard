// src/components/ProgressChart.js
import React from 'react';
import { motion } from 'framer-motion';

const ProgressChart = ({ data, timeRange }) => {
  // Mock chart data based on time range
  const chartData = React.useMemo(() => {
    const baseData = {
      week: [
        { day: 'Mon', completed: 3, total: 5 },
        { day: 'Tue', completed: 4, total: 6 },
        { day: 'Wed', completed: 2, total: 4 },
        { day: 'Thu', completed: 5, total: 7 },
        { day: 'Fri', completed: 3, total: 5 },
        { day: 'Sat', completed: 6, total: 8 },
        { day: 'Sun', completed: 4, total: 6 }
      ],
      month: [
        { day: 'Week 1', completed: 15, total: 25 },
        { day: 'Week 2', completed: 20, total: 30 },
        { day: 'Week 3', completed: 18, total: 28 },
        { day: 'Week 4', completed: 22, total: 32 }
      ],
      year: [
        { day: 'Q1', completed: 60, total: 90 },
        { day: 'Q2', completed: 75, total: 100 },
        { day: 'Q3', completed: 80, total: 110 },
        { day: 'Q4', completed: 85, total: 120 }
      ]
    };
    
    return baseData[timeRange] || baseData.week;
  }, [timeRange]);

  const maxValue = Math.max(...chartData.map(item => item.total));

  return (
    <div className="w-full h-64">
      <svg width="100%" height="100%" viewBox="0 0 400 200">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Bars */}
        {chartData.map((item, index) => {
          const barWidth = 40;
          const barSpacing = 50;
          const x = index * barSpacing + 20;
          const totalHeight = (item.total / maxValue) * 150;
          const completedHeight = (item.completed / maxValue) * 150;
          
          return (
            <g key={item.day}>
              {/* Total bar (background) */}
              <motion.rect
                x={x}
                y={180 - totalHeight}
                width={barWidth}
                height={totalHeight}
                fill="#e5e7eb"
                initial={{ height: 0, y: 180 }}
                animate={{ height: totalHeight, y: 180 - totalHeight }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
              
              {/* Completed bar (foreground) */}
              <motion.rect
                x={x}
                y={180 - completedHeight}
                width={barWidth}
                height={completedHeight}
                fill="#3b82f6"
                initial={{ height: 0, y: 180 }}
                animate={{ height: completedHeight, y: 180 - completedHeight }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              />
              
              {/* Labels */}
              <text
                x={x + barWidth / 2}
                y={195}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {item.day}
              </text>
              
              {/* Value labels */}
              <text
                x={x + barWidth / 2}
                y={175 - completedHeight}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-medium"
              >
                {item.completed}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Total</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;