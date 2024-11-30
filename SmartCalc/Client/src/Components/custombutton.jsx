import React from "react";
import { useNavigate } from "react-router-dom";


export default function CustomButton({ children, onClick, disabled = false, style = {} }) {
    const buttonStyle = {
      padding: '12px 24px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#4b4b4b',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      ...style,
    };

    
    const navigate = useNavigate(); // Initialize navigate
  
    const hoverStyle = {
      backgroundColor: '#242424',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.5)'
    };
  
    const activeStyle = {
      backgroundColor: '#2e2e2e',
    };
  
    const disabledStyle = {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed',
    };
  
    const [isHovered, setIsHovered] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);
  
    const getComputedStyle = () => {
      if (disabled) return { ...buttonStyle, ...disabledStyle };
      if (isActive) return { ...buttonStyle, ...hoverStyle, ...activeStyle };
      if (isHovered) return { ...buttonStyle, ...hoverStyle };
      return buttonStyle;
    };

    
  
    return (
      <button
        style={getComputedStyle()}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsActive(false);
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        aria-disabled={disabled}
      >
        {children}
      </button>
    );
  }
  