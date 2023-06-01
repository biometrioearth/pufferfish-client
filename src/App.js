
import React from 'react';
import StartPage from './components/StartPage';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<StartPage/>} />
      </Routes>
    </div>
  );
}

export default App;