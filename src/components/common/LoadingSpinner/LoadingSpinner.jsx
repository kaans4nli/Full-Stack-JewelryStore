import React from 'react';

/**
 * LoadingSpinner Component
 * Sayfa yüklenirken gösterilen spinner bileşeni
 */
const LoadingSpinner = ({ 
  fullScreen = true, 
  size = 'md',
  label = 'Yükleniyor...'
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center gap-4">
      {/* Spinner Circle */}
      <div
        className={`
          ${sizeClasses[size]}
          border-gray-200 border-t-blue-600 rounded-full animate-spin
        `}
        style={{
          borderTopColor: 'var(--color-primary)',
        }}
        aria-label="Yükleniyor"
      />
      
      {/* Loading Text */}
      {label && (
        <p className="text-gray-600 text-sm font-medium">{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;
