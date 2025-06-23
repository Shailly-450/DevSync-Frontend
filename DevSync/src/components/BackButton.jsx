import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ 
  to, 
  fallbackTo = '/', 
  className = '', 
  children = 'Back',
  showIcon = true 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      // Always navigate to the specified route when 'to' is provided
      navigate(to);
    } else {
      // Only use browser history when no specific route is provided
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(fallbackTo);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${className}`}
    >
      {showIcon && <ArrowLeft size={16} />}
      {children}
    </button>
  );
};

export default BackButton; 