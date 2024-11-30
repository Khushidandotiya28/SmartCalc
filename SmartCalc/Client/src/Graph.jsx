import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { evaluate, parse } from 'mathjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph() {
  const navigate = useNavigate();
  const [functionInput, setFunctionInput] = useState('');
  const [variable, setVariable] = useState('x');
  const [graphData, setGraphData] = useState([]);

  const generateDataPoints = (func, varName) => {
    const points = [];
    const start = -10;
    const end = 10;
    const step = 0.1;

    for (let val = start; val <= end; val += step) {
      try {
        const scope = { [varName]: val }; // Dynamically replace the variable
        const y = evaluate(func, scope);
        if (typeof y === 'number' && isFinite(y)) {
          points.push({ [varName]: val, y });
        }
      } catch (error) {
        console.error('Error evaluating function:', error);
      }
    }

    return points;
  };

  const handlePlotGraph = () => {
    try {
      const parsed = parse(functionInput);
      const variables = parsed.filter(node => node.isSymbolNode).map(node => node.name);

      if (variables.length > 1) {
        alert('Please enter a function with only one variable (e.g., x, y, z).');
        return;
      }

      const detectedVariable = variables[0] || 'x';
      setVariable(detectedVariable);

      const data = generateDataPoints(functionInput, detectedVariable);
      setGraphData(data);
    } catch (error) {
      alert('Invalid function. Please check your input.');
      console.error('Error parsing function:', error);
    }
  };

  const handleClearGraph = () => {
    setFunctionInput('');
    setGraphData([]);
  };

  const chartData = {
    labels: graphData.map((point) => point[variable].toFixed(2)),
    datasets: [
      {
        label: `f(${variable})`,
        data: graphData.map((point) => point.y),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Function Graph',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: variable,
        },
      },
      y: {
        title: {
          display: true,
          text: 'f(' + variable + ')',
        },
      },
    },
  };

  return (
    <div
  style={{
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1e1e1e',
    display: 'flex',
    flexDirection: 'column', // Ensures the layout stacks vertically
  }}
>
  {/* Header Section */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#2e2e2e',
    }}
  >
    <button
      style={{
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
      }}
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={32} />
    </button>
    <h1
      style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
        margin: '0 auto', // Centers the text
      }}
    >
      Graph
    </h1>
  </div>

  {/* Input and Plot Section */}
  <div
    style={{
      flex: '1', // Allow the content to fill the available space
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Centers items horizontally
    }}
  >
    {/* Function Input */}
    <div
      style={{
        position: 'relative',
        width: '90%', // Adjust width to make it responsive
        maxWidth: '600px', // Restrict maximum width for larger screens
      }}
    >
      <input
        type="text"
        placeholder="Enter a function (e.g., x^2, sin(x))"
        value={functionInput}
        onChange={(e) => setFunctionInput(e.target.value)}
        style={{
          paddingLeft: '18px',
          width: '100%',
          height: '40px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#1e1e1e',
          color: 'white',
        }}
      />
      {functionInput && (
        <button
          onClick={handleClearGraph}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px', // Adjusted to be relative to the input width
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      )}
    </div>

    {/* Plot Button */}
    <button
      onClick={handlePlotGraph}
      style={{
        padding: '8px 10px',
        backgroundColor: '#2e2e2e',
        height: '40px',
        width: '150px',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px',
        boxShadow: 'none',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = 'none';
      }}
    >
      Plot Graph
    </button>
  </div>

  {/* Graph Display Section */}
  {graphData.length > 0 ? (
    <div
      style={{
        marginTop: '20px',
        width: '90%', // Adjust width dynamically for responsiveness
        maxWidth: '800px', // Restrict maximum width
        margin: '0 auto', // Center the graph
      }}
    >
      <Line data={chartData} options={options} />
    </div>
  ) : (
    <p
      style={{
        color: 'white',
        textAlign: 'center',
        fontSize: '20px',
        marginTop: '50px',
      }}
    >
      No data is to be displayed
    </p>
  )}
</div>
  );
}