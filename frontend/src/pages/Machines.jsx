import { useEffect, useState } from "react";
import {
  Factory,
  Activity,
  Zap,
  Power,
  RefreshCw,
} from "lucide-react";

import "../styles/Machines.css";

const API_URL = "http://127.0.0.1:8000";

function Machines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMachines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/machines/`);

      if (!response.ok) {
        throw new Error("Unable to fetch machines");
      }

      const result = await response.json();

      // Handles both array response and { data: [] } response
      const machineData = Array.isArray(result)
        ? result
        : result.data || [];

      setMachines(machineData);
    } catch (err) {
      console.error("Machines API error:", err);
      setError("Unable to connect to the FastAPI backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const activeMachines = machines.filter(
    (machine) =>
      machine.status?.toLowerCase() === "active" ||
      machine.status?.toLowerCase() === "online"
  ).length;

  return (
    <div className="machines-page">

      {/* HEADER */}
      <div className="machines-header">

        <div>
          <h1>Machines</h1>

          <p>
            Monitor and manage industrial machines and energy loads
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchMachines}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* SUMMARY CARDS */}
      <div className="machine-stats">

        <div className="machine-stat-card">

          <div className="machine-stat-icon">
            <Factory size={22} />
          </div>

          <div>
            <span>Total Machines</span>
            <strong>{machines.length}</strong>
          </div>

        </div>


        <div className="machine-stat-card">

          <div className="machine-stat-icon active-icon">
            <Power size={22} />
          </div>

          <div>
            <span>Active Machines</span>
            <strong>{activeMachines}</strong>
          </div>

        </div>


        <div className="machine-stat-card">

          <div className="machine-stat-icon">
            <Activity size={22} />
          </div>

          <div>
            <span>Energy Loads</span>
            <strong>{machines.length}</strong>
          </div>

        </div>


        <div className="machine-stat-card">

          <div className="machine-stat-icon">
            <Zap size={22} />
          </div>

          <div>
            <span>Monitoring</span>
            <strong>Live</strong>
          </div>

        </div>

      </div>

      {/* MACHINE TABLE */}
      <div className="machines-panel">

        <div className="panel-header">

          <div>
            <h2>Machine Overview</h2>

            <p>
              Current machines connected to the energy monitoring system
            </p>
          </div>

          <span className="live-badge">
            ● Live
          </span>

        </div>


        {loading ? (

          <div className="machines-message">
            Loading machines...
          </div>

        ) : error ? (

          <div className="machines-message error">
            {error}
          </div>

        ) : machines.length === 0 ? (

          <div className="machines-message">
            No machines found.
          </div>

        ) : (

          <div className="machine-table-wrapper">

            <table className="machine-table">

              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Power</th>
                  <th>Energy</th>
                </tr>
              </thead>

              <tbody>

                {machines.map((machine, index) => {

                  const status =
                    machine.status || "Unknown";

                  return (
                    <tr key={machine.id || index}>

                      <td>
                        <div className="machine-name">

                          <div className="machine-icon">
                            <Factory size={18} />
                          </div>

                          <div>
                            <strong>
                              {machine.name ||
                                `Machine ${index + 1}`}
                            </strong>

                            <span>
                              ID: {machine.id || "N/A"}
                            </span>
                          </div>

                        </div>
                      </td>


                      <td>
                        {machine.location || "Production Floor"}
                      </td>


                      <td>

                        <span
                          className={`status-badge ${
                            status.toLowerCase() === "active" ||
                            status.toLowerCase() === "online"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          ● {status}
                        </span>

                      </td>


                      <td>
                        {machine.power_kw ??
                          machine.power ??
                          0}{" "}
                        kW
                      </td>


                      <td>
                        {machine.energy_kwh ??
                          machine.energy ??
                          0}{" "}
                        kWh
                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Machines;