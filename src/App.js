import React from "react";
import { Route, Routes } from "react-router-dom";
import './index.css'
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FileUpload />} />
      </Routes>
    </div>
  );
}

export default App;
