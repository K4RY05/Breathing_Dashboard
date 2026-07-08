import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import SensorReport from "../pages/SensorReport";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sensor-report" element={<SensorReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;