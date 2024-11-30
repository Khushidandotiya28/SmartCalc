import React from "react";
import Nav from "./Components/navbar";
import Footer from "./Components/footer";
import { useNavigate } from "react-router-dom";
import { MdDraw, MdMic, MdTimeline, MdSwapHoriz, MdHistory } from "react-icons/md";

export default function Calculate() {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <MdDraw size={45} />,
      description: "Draw to Calculate",
      path: "/DrawToCalculate",
    },
    {
      icon: <MdMic size={45} />,
      description: "Voice Calculator",
      path: "/Voice",
    },
    {
      icon: <MdTimeline size={45} />,
      description: "Graph",
      path: "/Graph",
    },
    {
      icon: <MdSwapHoriz size={45} />,
      description: "Conversion",
      path: "/Converter",
    },
    {
      icon: <MdHistory size={45} />,
      description: "History",
      path: "/History",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#1e1e1e",
        maxHeight: '100vh'
      }}
    >
      <Nav />
      <main
        style={{
          flexGrow: 1,
          margin: "0 auto",
          padding: "3rem 1rem",
          textAlign: "center",
          backgroundColor: "#1e1e1e",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#2e2e2e",
                color: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                width: "100%",
                maxWidth: "300px",
                textAlign: "left",
                height: "230px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s, background-color 0.2s",
                marginTop: '30px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor = "#3e3e3e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#2e2e2e";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(card.path)}
            >
              {card.icon && <div style={{ marginBottom: "10px" }}>{card.icon}</div>}
              <p style={{ margin: "0", textAlign: "center" }}>{card.description}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
