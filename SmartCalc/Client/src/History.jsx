import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { fetchHistory, clearHistory, deleteCalculation } from "./api";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  // Fetch history from the server
  useEffect(() => {
    const getHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    getHistory();
  }, []);


  // Clear all history
  const handleClearAll = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("Attempting to delete item with _id:", id);
      await deleteCalculation(id);
      setHistory((prevHistory) => prevHistory.filter((calc) => calc.id !== id));
      console.log("Deletion successful. Updated history:", history);
    } catch (error) {
      console.error("Error deleting calculation:", error);
    }
  };
  

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1e1e1e" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#2e2e2e",
          color: "white",
          width: "100vw",
          height: "70px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            aria-label="Go back"
          >
            <ArrowLeft style={{ height: "24px", width: "24px", color: "white" }} />
          </button>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>History</h1>
          <button
            onClick={handleClearAll}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            aria-label="Delete all history"
          >
            <Trash2
              style={{ height: "24px", width: "24px", color: "white" }}
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          width: "100vw",
          margin: "0 auto",
          padding: "16px 24px",
          backgroundColor: "#1e1e1e",
        }}
      >
        {history.length === 0 ? (
          <p style={{ textAlign: "center", color: "white" }}>No calculation history available.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
            {history.map((calc) => (
              <li
                key={calc.id}
                style={{
                  borderBottom: "1px solid gray",
                  padding: "8px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      color: "white",
                    }}
                  >
                    {calc.expression} = {calc.result}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "14px",
                      color: "#6B7280",
                    }}
                  >
                    {calc.timestamp}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(calc._id)}
                  style={{ background: "none", border: "none", cursor: "pointer" , marginRight:'45px'}}
                  aria-label={`Delete calculation: ${calc.expression} = ${calc.result}`}
                >
                  <Trash2 style={{ height: "20px", width: "20px", color: "white" }} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
