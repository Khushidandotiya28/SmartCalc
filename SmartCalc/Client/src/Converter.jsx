import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { saveCalculation } from "./api";
import { useState } from 'react';

const conversionTypes = ['Length', 'Weight', 'Temperature', 'Area'];

const units = {
  Length: ['Meters', 'Feet', 'Inches', 'Centimeters'],
  Weight: ['Kilograms', 'Pounds', 'Ounces', 'Grams'],
  Temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
  Area: ['Square Meters', 'Square Feet', 'Acres', 'Hectares'],
};

const conversions = {
  Length: {
    Meters: { Feet: 3.28084, Inches: 39.3701, Centimeters: 100 },
    Feet: { Meters: 0.3048, Inches: 12, Centimeters: 30.48 },
    Inches: { Meters: 0.0254, Feet: 0.0833333, Centimeters: 2.54 },
    Centimeters: { Meters: 0.01, Feet: 0.0328084, Inches: 0.393701 },
  },
  Weight: {
    Kilograms: { Pounds: 2.20462, Ounces: 35.274, Grams: 1000 },
    Pounds: { Kilograms: 0.453592, Ounces: 16, Grams: 453.592 },
    Ounces: { Kilograms: 0.0283495, Pounds: 0.0625, Grams: 28.3495 },
    Grams: { Kilograms: 0.001, Pounds: 0.00220462, Ounces: 0.035274 },
  },
  Temperature: {
    Celsius: {
      Fahrenheit: (c) => (c * 9) / 5 + 32,
      Kelvin: (c) => c + 273.15,
    },
    Fahrenheit: {
      Celsius: (f) => ((f - 32) * 5) / 9,
      Kelvin: (f) => ((f - 32) * 5) / 9 + 273.15,
    },
    Kelvin: {
      Celsius: (k) => k - 273.15,
      Fahrenheit: (k) => ((k - 273.15) * 9) / 5 + 32,
    },
  },
  Area: {
    'Square Meters': { 'Square Feet': 10.7639, Acres: 0.000247105, Hectares: 0.0001 },
    'Square Feet': { 'Square Meters': 0.092903, Acres: 0.0000229568, Hectares: 0.00000929 },
    Acres: { 'Square Meters': 4046.86, 'Square Feet': 43560, Hectares: 0.404686 },
    Hectares: { 'Square Meters': 10000, 'Square Feet': 107639, Acres: 2.47105 },
  },
};

export default function Converter() {
  const navigate = useNavigate();

  const [conversionType, setConversionType] = useState(conversionTypes[0]);
  const [fromUnit, setFromUnit] = useState(units[conversionType][0]);
  const [toUnit, setToUnit] = useState(units[conversionType][1]);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const handleCalculation = (expression, result) => {
    saveCalculation({ source: "Converter", expression, result })
    .then(() =>console.log("calculation saved"))
    .catch((error) => console.error("Failed to save calculations:" , error));
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('Please enter a valid number');
      return;
    }
  
    let convertedValue;
    let expression;
  
    if (conversionType === 'Temperature') {
      convertedValue = conversions[conversionType][fromUnit][toUnit](value);
      expression = `${value} ${fromUnit} to ${toUnit}`;
    } else {
      const factor = conversions[conversionType][fromUnit][toUnit];
      convertedValue = value * factor;
      expression = `${value} ${fromUnit} to ${toUnit}`;
    }
  
    const formattedResult = `${value} ${fromUnit} = ${convertedValue.toFixed(2)} ${toUnit}`;
    setResult(formattedResult);
  
    // Save the calculation
    handleCalculation(expression, formattedResult);
  };
  

  return (
    <div
      style={{
        width: '100vw',
        margin: '0 auto',
        height: '100vh',
        background: '#1e1e1e',
        
      }}
    >
      <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", 
    padding: "10px 20px", 
    backgroundColor: "#2e2e2e",
    height: "60px", 
    width: "100vw",
    boxSizing: "border-box", 
  }}
>
  {/* Back Button */}
  <button
    style={{
      background: "none",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontSize: "18px",
    }}
    onClick={() => navigate(-1)}
  >
    <ArrowLeft size={24} /> 
  </button>

  {/* Title */}
  <h1
    style={{
      fontSize: "20px", 
      fontWeight: "bold",
      color: "white",
      margin: "0 auto", 
      textAlign: "center", 
    }}
  >
    Unit Converter
  </h1>
</div>

<div
  style={{
    marginTop: "20px",
    marginBottom: "15px",
    width: "90%", // Responsive width
    maxWidth: "350px", // Restrict max width for larger screens
    marginLeft: "auto",
    marginRight: "auto", // Center align for smaller devices
  }}
>
  <label
    style={{
      display: "block", // Ensure the label is above the select
      marginBottom: "8px",
      fontWeight: "bold",
      backgroundColor: "#1e1e1e",
      color: "white",
      paddingLeft: "12px",
    }}
  >
    Conversion Type
  </label>
  <select
    style={{
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxSizing: "border-box",
      backgroundColor: "#2e2e2e",
      color: "white",
      margin: "5px 0",
    }}
    value={conversionType}
    onChange={(e) => {
      setConversionType(e.target.value);
      setFromUnit(units[e.target.value][0]);
      setToUnit(units[e.target.value][1]);
    }}
  >
    {conversionTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>

{/* From Unit Selection */}
<div
  style={{
    marginBottom: "15px",
    width: "90%",
    maxWidth: "350px",
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  <label
    style={{
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      backgroundColor: "#1e1e1e",
      color: "white",
      paddingLeft: "12px",
    }}
  >
    From
  </label>
  <select
    style={{
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxSizing: "border-box",
      backgroundColor: "#2e2e2e",
      color: "white",
      margin: "5px 0",
    }}
    value={fromUnit}
    onChange={(e) => setFromUnit(e.target.value)}
  >
    {units[conversionType].map((unit) => (
      <option key={unit} value={unit}>
        {unit}
      </option>
    ))}
  </select>
</div>

{/* To Unit Selection */}
<div
  style={{
    marginBottom: "15px",
    width: "90%",
    maxWidth: "350px",
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  <label
    style={{
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      backgroundColor: "#1e1e1e",
      color: "white",
      paddingLeft: "12px",
    }}
  >
    To
  </label>
  <select
    style={{
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxSizing: "border-box",
      backgroundColor: "#2e2e2e",
      color: "white",
      margin: "5px 0",
    }}
    value={toUnit}
    onChange={(e) => setToUnit(e.target.value)}
  >
    {units[conversionType].map((unit) => (
      <option key={unit} value={unit}>
        {unit}
      </option>
    ))}
  </select>
</div>

{/* Value Input */}
<div
  style={{
    marginBottom: "15px",
    width: "90%",
    maxWidth: "350px",
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  <label
    style={{
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      backgroundColor: "#1e1e1e",
      color: "white",
      paddingLeft: "12px",
    }}
  >
    Value
  </label>
  <input
    type="number"
    style={{
      width: "100%",
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxSizing: "border-box",
      backgroundColor: "#2e2e2e",
      color: "white",
      margin: "5px 0",
    }}
    placeholder="Enter value"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
  />
</div>

{/* Convert Button */}
<button
  style={{
    width: "90%",
    maxWidth: "130px",
    padding: "6px",
    backgroundColor: "#2e2e2e",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    margin: "10px auto", // Center the button
    display: "block", // Block element for responsive centering
  }}
  onMouseEnter={(e) => {
    e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.5)";
  }}
  onMouseLeave={(e) => {
    e.target.style.boxShadow = "none";
  }}
  onClick={handleConvert}
>
  Convert
</button>

{/* Result */}
{result && (
  <div
    style={{
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#1e1e1e",
      color: "white",
      borderRadius: "4px",
      textAlign: "center",
      fontWeight: "bold",
      width: "90%",
      maxWidth: "350px",
      marginLeft: "auto",
      marginRight: "auto",
    }}
  >
    {result}
  </div>
)}

      
    </div>
  );
}
