import React from 'react';
import { ArrowRight } from 'lucide-react';
import Nav from './Components/navbar';
import CustomButton from './Components/custombutton';
import Footer from './Components/footer';
import { useNavigate } from "react-router-dom";

export default function SmartCalcPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#1e1e1e',
      }}
    >
      {/* Header/Nav */}
      <Nav />

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          margin: '0 auto',
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: '#1e1e1e',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {/* Image Section */}
          <div style={{ flex: 1, maxWidth: '450px', width: '100%' }}>
            <img
              src="https://images.pexels.com/photos/27288569/pexels-photo-27288569/free-photo-of-a-stock-chart-with-green-and-red-lines.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Calculator"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          </div>

          {/* Text and Button Section */}
          <div
            style={{
              flex: 1,
              maxWidth: '600px',
              width: '100%',
              textAlign: 'left',
              color: 'white',
            }}
          >
            <h3
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: 'white',
              }}
            >
              Welcome to SmartCalc
            </h3>
            <p
              style={{
                fontSize: '1rem',
                color: 'white',
                marginBottom: '1.5rem',
                lineHeight: '1.6',
              }}
            >
              The next-generation calculator with advanced features to make your calculations
              easier and smarter.
            </p>
            <CustomButton
              onClick={() => navigate("/calculate")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1rem',
              }}
            >
              Start Calculating
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </CustomButton>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
