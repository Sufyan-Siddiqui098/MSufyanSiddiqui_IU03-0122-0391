import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const types = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      icon: <CheckCircle className="text-green-500" size={20} />,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      icon: <AlertCircle className="text-red-500" size={20} />,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      icon: <AlertCircle className="text-yellow-500" size={20} />,
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      icon: <Info className="text-blue-500" size={20} />,
    },
  };

  const { bgColor, borderColor, textColor, icon } = types[type];

  return (
    <div className={`${bgColor} ${borderColor} border-l-4 p-4 mb-4 rounded`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <p className={`ml-3 ${textColor}`}>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className={`${textColor} hover:opacity-70`}>
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
