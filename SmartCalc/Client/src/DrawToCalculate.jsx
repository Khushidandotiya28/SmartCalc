import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, X, PenTool, Eraser } from 'lucide-react';
import Tesseract from "tesseract.js";
import { saveCalculation } from "./api";


export default function DrawToCalculate() {
  const navigate = useNavigate();

  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [calculation, setCalculation] = useState('');
  const [showCalculation, setShowCalculation] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
    setContext(ctx);
  }, [lineWidth]);

  const handleCalculation = (expression, result) => {
    saveCalculation({ source: "DrawToCalculate", expression, result })
    .then(() =>console.log("calculation saved"))
    .catch((error) => console.error("Failed to save calculations:" , error));
  };

  const startDrawing = (e) => {
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    if (isEraser) {
      context.clearRect(e.nativeEvent.offsetX - eraserWidth / 2, e.nativeEvent.offsetY - eraserWidth / 2, eraserWidth, eraserWidth);
    } else {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    }
  };

  const endDrawing = () => {
    context.closePath();
    setDrawing(false);
    const newStep = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSteps([...steps.slice(0, currentStep + 1), newStep]);
    setCurrentStep(currentStep + 1);
  };

  const changeColor = (newColor) => {
    setColor(newColor);
    if (!isEraser) {
      context.strokeStyle = newColor;
    }
  };

  const calculateDrawing = () => {
    const preprocessCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg > 128 ? 255 : 0;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    preprocessCanvas();
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();

    Tesseract.recognize(imageData, "eng", {
      tessedit_char_whitelist: "0123456789+-*/().",
      logger: (info) => console.log(info),
    })
      .then(({ data: { text } }) => {
        console.log("Recognized text:", text);

        const sanitizedText = text.replace(/[^0-9+\-*/().]/g, "").trim();
        if (!sanitizedText) {
          setCalculation("Error: Could not recognize valid input");
          setShowCalculation(true);
          return;
        }

        try {
          const tokens = sanitizedText.match(/(\d+\.?\d*|\+|\-|\*|\/|$$|$$)/g);
          if (!tokens) throw new Error("Invalid expression");

          const result = evaluateExpression(tokens);
          handleCalculation(sanitizedText, result);
          setCalculation(`Calculation: ${sanitizedText} = ${result}`);
        } catch (error) {
          console.error("Calculation error:", error);
          setCalculation("Error: Invalid expression");
        }
        setShowCalculation(true);
      })
      .catch((err) => {
        console.error("OCR error:", err);
        setCalculation("Error: Could not recognize text");
        setShowCalculation(true);
      });
  };

  const evaluateExpression = (tokens) => {
    const precedence = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2
    };

    const applyOperator = (operators, values) => {
      const operator = operators.pop();
      const right = values.pop();
      const left = values.pop();
      switch (operator) {
        case '+': values.push(left + right); break;
        case '-': values.push(left - right); break;
        case '*': values.push(left * right); break;
        case '/': 
          if (right === 0) throw new Error("Division by zero");
          values.push(left / right); 
          break;
      }
    };

    const operators = [];
    const values = [];

    tokens.forEach(token => {
      if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          applyOperator(operators, values);
        }
        operators.pop();
      } else if (token in precedence) {
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
          applyOperator(operators, values);
        }
        operators.push(token);
      } else {
        values.push(parseFloat(token));
      }
    });

    while (operators.length) {
      applyOperator(operators, values);
    }

    return values[0];
  };

  const togglePenEraser = () => {
    setIsEraser(!isEraser);
    if (isEraser) {
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
    } else {
      context.strokeStyle = "#FFFFFF";
      context.lineWidth = eraserWidth;
    }
  };

  const closeCalculationBox = () => {
    setShowCalculation(false);
  };

  const handleStepChange = (direction) => {
    const newStep = direction === "forward" ? currentStep + 1 : currentStep - 1;
  
    if (newStep < 0) {
      // Clear the canvas if the user goes before the first step
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setCurrentStep(-1); // Indicate an empty state
      return;
    }
  
    if (newStep < steps.length) {
      // Navigate to the appropriate step
      context.putImageData(steps[newStep], 0, 0);
      setCurrentStep(newStep);
    }
  };
  

  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    if (isEraser) {
      setEraserWidth(newSize);
      context.lineWidth = newSize;
    } else {
      setLineWidth(newSize);
      context.lineWidth = newSize;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#1e1e1e", position: "relative", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", backgroundColor: "#2e2e2e", height: "30px" }}>
        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={32} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Draw to Calculate</h1>
        <button
          onClick={togglePenEraser}
          style={{
            backgroundColor: isEraser ? "#2e2e2e" : "#2e2e2e",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          {isEraser ? <Eraser size={20} /> : <PenTool size={20} />}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={350}
          style={{
            border: "2px #d1d5db",
            borderRadius: "8px",
            backgroundColor: "#2e2e2e",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            cursor: drawing ? "none" : "default",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        >
          <div
            style={{
              width: isEraser ? eraserWidth : lineWidth,
              height: isEraser ? eraserWidth : lineWidth,
              borderRadius: "50%",
              border: "1px solid white",
              position: "absolute",
              pointerEvents: "none",
            }}
          />
        </canvas>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", position: "absolute", bottom: "13px", left: "10px",}}>
        <button onClick={() => changeColor("#000000")} style={{ backgroundColor: "#000000", borderRadius: "50%", width: "27px", height: "27px", cursor: "pointer",  border: "1px solid gray"}} />
        <button onClick={() => changeColor("#ff0000")} style={{ backgroundColor: "#ff0000", borderRadius: "50%", width: "27px", height: "27px", cursor: "pointer" , border: "1px solid gray"}} />
        <button onClick={() => changeColor("#00ff00")} style={{ backgroundColor: "#00ff00", borderRadius: "50%", width: "27px", height: "27px", cursor: "pointer", border: "1px solid gray"}} />
        <button onClick={() => changeColor("#0000ff")} style={{ backgroundColor: "#0000ff", borderRadius: "50%", width: "27px", height: "27px", cursor: "pointer", border: "1px solid gray" }} />
        <button onClick={() => changeColor("#ffffff")} style={{ backgroundColor: "#ffffff", borderRadius: "50%", width: "27px", height: "27px", cursor: "pointer", border: "1px solid gray" }} />
      </div>

      <div style={{ position: "absolute", bottom: "10px", right: "20px" }}>
        <button
          onClick={() => handleStepChange('backward')}
          style={{
            backgroundColor: "#2e2e2e",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            marginRight: "10px",
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          <ArrowLeft size={12} />
        </button>
        <button
          onClick={() => handleStepChange('forward')}
          style={{
            backgroundColor: "#2e2e2e",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            marginRight: "10px",
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          <ArrowRight size={12} />
        </button>
        <button
          onClick={calculateDrawing}
          style={{
            backgroundColor: "#2e2e2e",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        >
          Calculate
        </button>
      </div>

      <div
  style={{
    position: "absolute",
    bottom: "3px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "300px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  }}
>
  {/* Progress Bar Background */}
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "4px",
      backgroundColor: "#e5e7eb",
      borderRadius: "4px",
    }}
  >
    {/* Dynamic Progress Bar */}
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: `${Math.min(Math.max(isEraser ? eraserWidth : lineWidth, 1), 100)}%`,
        height: "100%",
        backgroundColor: "#3B82F6",
        borderRadius: "4px",
        transition: "width 0.2s ease",
        
      }}
    ></div>
    {/* Range Input */}
    <input
      type="range"
      min="1"
      max="100"
      value={isEraser ? eraserWidth : lineWidth}
      onChange={handleSizeChange}
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "3px",
        appearance: "none",
        background: "transparent",
        cursor: "pointer",
        zIndex: "2",
      }}
    />
  </div>
</div>


      {showCalculation && (
        <div style={{ position: "absolute", bottom: "70px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#2e2e2e", padding: "20px", borderRadius: "8px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Calculation Result</h3>
            <button onClick={closeCalculationBox} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
          <p>{calculation}</p>
        </div>
      )}
    </div>
  );
}

