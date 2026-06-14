import React from 'react';

export default function Logo({ size = 24, className = '', style = {} }) {
  return (
    <img 
      src="/favicon.png" 
      alt="MockingAI Logo" 
      width={size} 
      height={size} 
      className={`app-logo ${className}`}
      style={{
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '6px',
        ...style
      }}
    />
  );
}
