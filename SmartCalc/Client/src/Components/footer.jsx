import React from "react";

export default function Footer(){
    return (
        <div>
           <footer
        style={{
          display: 'flex',
          alignContent: 'AlignCenter',
          justifyContent: 'center',
          backgroundColor: '#313131',
          padding: '2rem',
          paddingTop: '15px',
          lineHeight: '5px',
          maxHeight: '10px',
          textAlign: 'center',
          fontSize: '1rem',
          color: '#666',
          maxWidth: '100vw',
        
          
        }}
      >
        <p style={{color: 'white'}}>&copy; 2024 SmartCalc. All rights reserved.</p>
      </footer>
        </div>
    );
}
