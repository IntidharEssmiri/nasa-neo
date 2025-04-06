import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-2xl w-full max-w-6xl mx-auto">
      {children}
    </div>
  );
}

export default Card;