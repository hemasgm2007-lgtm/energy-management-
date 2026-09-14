import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import Machines from "./pages/Machines";
import Predictions from "./pages/Predictions";
import Optimization from "./pages/Optimization";
import EnergySources from "./pages/EnergySources";
import Alerts from "./pages/Alerts";
import Recommendations from "./pages/Recommendations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import "./App.css";


function MainLayout() {
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Topbar />

        <Routes>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/monitoring"
            element={<Monitoring />}
          />

          <Route
            path="/machines"
            element={<Machines />}
          />

          <Route
            path="/predictions"
            element={<Predictions />}
          />

          <Route
            path="/optimization"
            element={<Optimization />}
          />

          <Route
            path="/energy-sources"
            element={<EnergySources />}
          />

          <Route
            path="/alerts"
            element={<Alerts />}
          />

          <Route
            path="/recommendations"
            element={<Recommendations />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>

      </main>

    </div>
  );
}


function App() {
  return (
    <Routes>

      {/* ROOT → LOGIN */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* LOGIN PAGE */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* APPLICATION */}
      <Route
        path="/*"
        element={<MainLayout />}
      />

    </Routes>
  );
}


export default App;