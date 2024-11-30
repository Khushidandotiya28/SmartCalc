import React, { useState, useCallback } from "react";
import { ArrowLeft, Mic } from "lucide-react";
import { saveCalculation } from "./api";

export default function Voice() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showResult, setShowResult] = useState(false); // Controls when to show input and result

  const handleCalculation = (expression, result) => {
    saveCalculation({ source: "Voice", expression, result })
    .then(() =>console.log("calculation saved"))
    .catch((error) => console.error("Failed to save calculations:" , error));
  };
  
  const startListening = useCallback(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setShowResult(false); // Hide result box while recording
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        calculateResult(transcript);
        setShowResult(true); // Show the result box after recording
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert(
        "Web Speech API is not supported in this browser. Please use Chrome or a compatible browser."
      );
    }
  }, []);

  const calculateResult = (input) => {
    try {
      const sanitizedInput = input.replace(/[^0-9+\-*/().]/g, ""); // Sanitize input to allow valid math expressions
      const calculatedResult = eval(sanitizedInput); // Perform the calculation
      const resultString = calculatedResult.toString();
  
      // Set the result in the state
      setResult(resultString);
  
      // Call handleCalculation to save the calculation
      handleCalculation(sanitizedInput, resultString);
    } catch (error) {
      setResult("Error in calculation");
    }
  };
  

  const styles = {
    app: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      width: "100vw",
      margin: "0 auto",
      backgroundColor: "#1e1e1e",
      color: "white",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#2e2e2e",
      padding: "16px",
      borderBottom: "1px solid #444",
      position: "relative",
      height: "30px"
    },
    backButton: {
      position: "absolute",
      left: "16px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "white",
      padding: "8px",
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    main: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px",
    },
    card: {
      backgroundColor: "#2e2e2e",
      border: "1px solid #444",
      borderRadius: "8px",
      padding: "16px",
      width: "100%",
      maxWidth: "500px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    description: {
      textAlign: "center",
      color: "#aaa",
      marginBottom: "16px",
    },
    inputContainer: {
      marginBottom: "16px",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "4px",
    },
    value: {
      backgroundColor: "#2e2e2e",
      padding: "12px",
      borderRadius: "4px",
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
      color: "white",
      border: "1px solid #ddd",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "24px",
    },
    micButton: {
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "50%",
      color: "white",
      width: "64px",
      height: "64px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      transition: "background 0.3s ease",
    },
    micButtonListening: {
      backgroundColor: "#dc3545",
    },
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => window.history.back()}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={styles.title}>Voice Calculator</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          {!showResult ? (
            // Initial Box Before Recording Ends
            <>
              <h4 style={styles.description}>Voice Input</h4>
              <h3 style={styles.description}>Tap the microphone to start</h3>
            </>
          ) : (
            // Show Input and Result After Recording Ends
            <>
              <div style={styles.inputContainer}>
                <p style={styles.label}>Input:</p>
                <p style={styles.value}>{input || "No input yet"}</p>
              </div>
              <div style={styles.inputContainer}>
                <p style={styles.label}>Result:</p>
                <p style={styles.value}>{result || "No result yet"}</p>
              </div>
            </>
          )}
        </div>
        <div style={styles.buttonContainer}>
          <button
            style={{
              ...styles.micButton,
              ...(isListening ? styles.micButtonListening : {}),
            }}
            onClick={startListening}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <Mic size={35} />
          </button>
        </div>
      </main>
    </div>
  );
}
