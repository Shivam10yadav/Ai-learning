import React from 'react';

const Spinner = () => {
  return (
    <div className="relative flex items-center justify-start h-[2.8rem] w-[2.8rem]">
      <style jsx>{`
        @keyframes pulse0112 {
          0%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .dot-spinner__dot::before {
          content: '';
          height: 20%;
          width: 20%;
          border-radius: 50%;
          background-color: #183153;
          transform: scale(0);
          opacity: 0.5;
          animation: pulse0112 1s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
        }
      `}</style>
      
      {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
        <div
          key={index}
          className="dot-spinner__dot absolute top-0 left-0 flex items-center justify-start h-full w-full"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div
            style={{
              animationDelay: `${-0.9 * (1 - index / 8)}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Spinner;