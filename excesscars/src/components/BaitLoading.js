import React from 'react';
import { GiFishingPole } from "react-icons/gi";
import { FaDollarSign } from "react-icons/fa";

const BaitLoading = ({ text = "Casting your offer..." }) => {
  return (
    <div style={styles.wrapper}>
      <style>
        {`
          @keyframes sway {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-5deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes bob {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}
      </style>

      {/* Fishing pole swaying */}
      <GiFishingPole size={60} color="#007bff" style={{ animation: 'sway 2s ease-in-out infinite' }} />

      {/* Dollar bait bobbing */}
      <div style={styles.bait}>
        <FaDollarSign size={30} color="#28a745" style={{ animation: 'bob 1.5s ease-in-out infinite' }} />
      </div>

      {/* Loading text */}
      <span style={styles.text}>{text}</span>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    color: '#007bff',
    position: 'relative'
  },
  bait: {
    marginTop: '10px',
  },
  text: {
    marginTop: '15px',
    fontSize: '1.1rem',
    animation: 'fadeInOut 2s ease-in-out infinite',
    fontWeight: '500',
  }
};

export default BaitLoading;
