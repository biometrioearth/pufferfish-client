import React from "react";
import { Route, Routes } from "react-router-dom";

import StartPage from "./components/StartPage";
import Dashboard from "./components/Dashboard";
import './index.css'
import Pufferfish from "./components/Pufferfish";
import Project from "./components/Project";
import Admin from "./components/Admin";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/sites/pufferfish" element={<Pufferfish />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
