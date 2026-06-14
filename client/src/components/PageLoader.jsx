import React from 'react';
import Logo from './Logo';

export default function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="page-loader">
      <div 
        className="loader-logo-container" 
        style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          marginBottom: '1rem'
        }}
      >
        <Logo 
          size={32} 
          style={{ 
            animation: 'pulse-slow 1.6s infinite alternate cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 2 
          }} 
        />
        <span 
          className="spinner spinner-lg" 
          style={{ 
            position: 'absolute', 
            width: '64px', 
            height: '64px',
            borderWidth: '4px',
            zIndex: 1
          }}
        ></span>
      </div>
      <span className="loader-text">{text}</span>
    </div>
  );
}
