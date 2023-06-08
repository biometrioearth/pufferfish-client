import React from "react";
import { Route, Routes } from "react-router-dom";
import './index.css'
import Pufferfish from "./components/Pufferfish";
import Project from "./components/Project";
import Landscape from "./components/Landscape";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Pufferfish />} />
        <Route path="/project" element={<Project />} />
        <Route path="/landscape" element={<Landscape />} />
      </Routes>
    </div>
  );
}

export default App;
