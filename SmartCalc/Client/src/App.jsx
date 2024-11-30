import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SmartCalcPage from "./home";
import Calculate from "./calculate";
import DrawToCalculate from "./DrawToCalculate";
import Voice from "./Voice";
import Converter from "./Converter";
import History from "./History";
import Graph from "./Graph";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SmartCalcPage />} />
        <Route path="/calculate" element={<Calculate />} />
        <Route path="/DrawToCalculate" element={<DrawToCalculate />} />
        <Route path="/Voice" element={<Voice />} />
        <Route path="/Converter" element={<Converter />} />
        <Route path="/History" element={<History />} />
        <Route path="/Graph" element={<Graph />} />
      </Routes>
    </Router>
  );
};

export default App;
