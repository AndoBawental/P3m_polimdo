// components/Dashboard/StatsCard.js
import React from 'react';

const StatsCard = ({ title, value, color = 'blue', icon, description, onClick }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-100',
      text: 'text-blue-800',
      valueText: 'text-blue-900',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      iconText: 'text-white',
      shadow: 'shadow-blue-100'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-100',
      text: 'text-green-800',
      valueText: 'text-green-900',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      iconText: 'text-white',
      shadow: 'shadow-green-100'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
      border: 'border-amber-100',
      text: 'text-amber-800',
      valueText: 'text-amber-900',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      iconText: 'text-white',
      shadow: 'shadow-amber-100'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      border: 'border-red-100',
      text: 'text-red-800',
      valueText: 'text-red-900',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
      iconText: 'text-white',
      shadow: 'shadow-red-100'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-100',
      text: 'text-purple-800',
      valueText: 'text-purple-900',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      iconText: 'text-white',
      shadow: 'shadow-purple-100'
    }
  };

  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div 
      className={`${colorClass.bg} ${colorClass.border} border rounded-xl p-5 shadow-sm transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-blue-200' : ''
      } ${colorClass.shadow}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${colorClass.text} text-sm font-medium mb-1`}>
            {title}
          </p>
          <p className={`${colorClass.valueText} text-3xl font-bold mb-1`}>
            {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          </p>
          {description && (
            <p className={`${colorClass.text} text-xs mt-1 opacity-90`}>
              {description}
            </p>
          )}
        </div>
        
        {icon && (
          <div className={`${colorClass.iconBg} rounded-xl p-3 flex items-center justify-center shadow-md`}>
            {typeof icon === 'string' ? (
              <span className={`text-xl ${colorClass.iconText}`}>{icon}</span>
            ) : (
              <div className={`${colorClass.iconText} w-6 h-6`}>
                {icon}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className={`h-1.5 rounded-full ${colorClass.bg}`}>
          <div 
            className={`h-full rounded-full ${colorClass.iconBg}`}
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;