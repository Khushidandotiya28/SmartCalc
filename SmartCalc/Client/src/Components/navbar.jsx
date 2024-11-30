import React from 'react';
import { Calculator } from 'lucide-react';
import CustomButton from './custombutton';
import { useNavigate } from 'react-router-dom';


export default function Nav(){
  const navigate = useNavigate();

  const handleCalculateClick = () => {
    navigate("/calculate"); // Navigate to the calculate page
  };
  const handleHomeClick = () => {
    navigate('/');
  };

    return (
        <div>
            <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 3rem',
          backgroundColor: '#313131',
          color: '#ffffff',
          fontSize: '1.2rem',
          height: '20px',
          maxWidth: '100vw'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calculator style={{ width: '2rem', height: '2rem' }} />
          <span style={{ fontSize: '1.75rem', fontWeight: '600' }}>SmartCalc</span>
        </div>
        <div style={{display: 'flex' , justifyContent: 'space-between' , alignItems: 'center'}}>
        <CustomButton style={{ backgroundColor: '#4b4b4b' , margin: '4px'}}
        onClick= {handleHomeClick}
        >
          
          Home
        </CustomButton>
        <CustomButton style={{ backgroundColor: '#4b4b4b', margin: '4px'  }}
        onClick = {handleCalculateClick}
        >
          
          Calculate
        </CustomButton>
        </div>
        
      </nav>
        </div>
        
    );
}