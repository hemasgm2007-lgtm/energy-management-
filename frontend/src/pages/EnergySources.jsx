import { useEffect, useState } from "react";

import {
Sun,
Wind,
Zap,
Fuel,
BatteryCharging,
Activity,
RefreshCw,
CheckCircle,
Clock,
TrendingUp,
} from "lucide-react";

import "../styles/EnergySources.css";

const API_URL = "http://10.74.4.75:8000";

function EnergySources() {
const [sources, setSources] = useState([]);
const [totalGeneration, setTotalGeneration] = useState(0);
const [peakHour, setPeakHour] = useState("-");
const [predictedDemand, setPredictedDemand] = useState(0);
const [dataType, setDataType] = useState("Predicted / Simulated");
const [optimizationStatus, setOptimizationStatus] = useState("Active");

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchSources = async () => {
try {
setLoading(true);
setError("");

  const response = await fetch(`${API_URL}/optimization/`);

  if (!response.ok) {
    throw new Error("Unable to fetch energy source data");
  }

  const result = await response.json();

  setSources(result.strategy || []);
  setTotalGeneration(result.total_generation_kw || 0);
  setPeakHour(result.peak_hour || "-");
  setPredictedDemand(result.predicted_demand_kw || 0);
  setDataType(result.data_type || "Predicted / Simulated");
  setOptimizationStatus(result.optimization_status || "Active");
} catch (err) {
  console.error("Energy Sources API error:", err);

  setError(
    "Unable to connect to the FastAPI backend. Make sure the backend is running."
  );
} finally {
  setLoading(false);
}

};

useEffect(() => {
fetchSources();
}, []);

const getIcon = (source) => {
const name = source.toLowerCase();

if (name.includes("solar")) {
  return <Sun size={23} />;
}

if (name.includes("wind")) {
  return <Wind size={23} />;
}

if (name.includes("battery")) {
  return <BatteryCharging size={23} />;
}

if (name.includes("chp")) {
  return <Zap size={23} />;
}

return <Fuel size={23} />;

};

const getIconClass = (source) => {
const name = source.toLowerCase();

if (name.includes("solar")) {
  return "solar";
}

if (name.includes("wind")) {
  return "wind";
}

if (name.includes("battery")) {
  return "battery";
}

if (name.includes("chp")) {
  return "chp";
}

return "diesel";

};

const getStatusClass = (status) => {
const value = status.toLowerCase();

if (
  value.includes("unavailable") ||
  value.includes("backup required")
) {
  return "warning";
}

if (
  value.includes("standby") ||
  value.includes("backup")
) {
  return "standby";
}

return "available";

};

return ( <div className="energy-sources-page">

  {/* =====================================================
      HEADER
  ====================================================== */}

  <div className="energy-sources-header">

    <div className="energy-sources-title">

      <div className="energy-sources-title-icon">
        <Activity size={23} />
      </div>

      <div>
        <h1>Energy Sources</h1>

        <p>
          Monitor predicted generation and source utilization
        </p>
      </div>

    </div>

    <button
      className="energy-refresh"
      onClick={fetchSources}
      disabled={loading}
    >
      <RefreshCw
        size={16}
        className={loading ? "refresh-spinning" : ""}
      />

      {loading ? "Refreshing..." : "Refresh"}
    </button>

  </div>


  {/* =====================================================
      SIMULATION / SYSTEM STATUS
  ====================================================== */}

  <div className="energy-status-bar">

    <div className="status-left">

      <div className="status-icon">
        <CheckCircle size={17} />
      </div>

      <div>
        <strong>Optimization System {optimizationStatus}</strong>

        <span>
          Energy source values are currently predicted / simulated
        </span>
      </div>

    </div>

    <div className="simulation-badge">
      {dataType}
    </div>

  </div>


  {/* =====================================================
      PEAK HOUR SUMMARY
  ====================================================== */}

  <div className="energy-summary-grid">

    <div className="summary-card">

      <div className="summary-icon generation">
        <Zap size={21} />
      </div>

      <div>
        <span>Peak Hour Generation</span>

        <strong>
          {Number(totalGeneration).toFixed(1)}
          <small> kW</small>
        </strong>

        <p>
          Combined source output
        </p>
      </div>

    </div>


    <div className="summary-card">

      <div className="summary-icon demand">
        <TrendingUp size={21} />
      </div>

      <div>
        <span>Predicted Demand</span>

        <strong>
          {Number(predictedDemand).toFixed(1)}
          <small> kW</small>
        </strong>

        <p>
          Maximum forecast demand
        </p>
      </div>

    </div>


    <div className="summary-card">

      <div className="summary-icon time">
        <Clock size={21} />
      </div>

      <div>
        <span>Peak Hour</span>

        <strong className="summary-text">
          {peakHour}
        </strong>

        <p>
          Highest predicted electrical demand
        </p>
      </div>

    </div>

  </div>


  {/* =====================================================
      SOURCE SECTION
  ====================================================== */}

  <div className="section-heading">

    <div>
      <h2>Available Energy Sources</h2>

      <p>
        Source contribution at the predicted peak hour
      </p>
    </div>

  </div>


  {/* =====================================================
      LOADING
  ====================================================== */}

  {loading && (

    <div className="energy-message">

      <RefreshCw
        size={22}
        className="message-spinner"
      />

      <span>
        Loading energy source data...
      </span>

    </div>

  )}


  {/* =====================================================
      ERROR
  ====================================================== */}

  {!loading && error && (

    <div className="energy-message error">

      <Fuel size={22} />

      <span>
        {error}
      </span>

      <button onClick={fetchSources}>
        Try Again
      </button>

    </div>

  )}


  {/* =====================================================
      EMPTY
  ====================================================== */}

  {!loading &&
    !error &&
    sources.length === 0 && (

      <div className="energy-message">

        <Activity size={22} />

        <span>
          No energy source data available.
        </span>

      </div>
    )}


  {/* =====================================================
      SOURCE CARDS
  ====================================================== */}

  {!loading &&
    !error &&
    sources.length > 0 && (

      <div className="source-grid">

        {sources.map((source, index) => {

          const name =
            source.source || "Unknown Source";

          const power =
            Number(source.power_kw || 0);

          const priority =
            source.priority ?? "-";

          const status =
            source.status || "Unknown";

          const percentage =
            totalGeneration > 0
              ? ((power / totalGeneration) * 100)
              : 0;

          const iconClass =
            getIconClass(name);

          return (

            <div
              className="source-card"
              key={`${name}-${index}`}
            >

              {/* CARD TOP */}

              <div className="source-card-top">

                <div
                  className={`source-icon ${iconClass}`}
                >
                  {getIcon(name)}
                </div>

                <span
                  className={`source-status ${getStatusClass(
                    status
                  )}`}
                >
                  <span className="status-dot">
                    ●
                  </span>

                  {status}
                </span>

              </div>


              {/* SOURCE NAME */}

              <h2>
                {name}
              </h2>


              {/* POWER */}

              <div className="source-power">

                <strong>
                  {power.toFixed(1)}
                </strong>

                <span>
                  kW
                </span>

              </div>


              {/* CONTRIBUTION */}

              <div className="source-progress">

                <div className="source-progress-top">

                  <span>
                    Generation Share
                  </span>

                  <strong>
                    {percentage.toFixed(1)}%
                  </strong>

                </div>

                <div className="progress-track">

                  <div
                    className={`progress-fill ${iconClass}`}
                    style={{
                      width: `${Math.min(
                        percentage,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>


              {/* DETAILS */}

              <div className="source-details">

                <div>

                  <span>
                    Priority
                  </span>

                  <strong>
                    #{priority}
                  </strong>

                </div>

                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {status}
                  </strong>

                </div>

              </div>

            </div>
          );
        })}

      </div>
    )}


  {/* =====================================================
      ENERGY SOURCE STRATEGY
  ====================================================== */}

  {!loading &&
    !error &&
    sources.length > 0 && (

      <div className="source-strategy">

        <div className="strategy-header">

          <div>

            <h2>
              Energy Source Strategy
            </h2>

            <p>
              Priority order used by the optimization engine
            </p>

          </div>

          <span>
            AI Optimized
          </span>

        </div>


        <div className="strategy-list">

          {sources.map((source, index) => (

            <div
              className="strategy-row"
              key={`strategy-${index}`}
            >

              <div className="priority-number">
                {source.priority}
              </div>

              <div
                className={`strategy-icon ${getIconClass(
                  source.source
                )}`}
              >
                {getIcon(source.source)}
              </div>

              <div className="strategy-name">

                <strong>
                  {source.source}
                </strong>

                <span>
                  {source.status}
                </span>

              </div>

              <div className="strategy-power">
                {Number(
                  source.power_kw || 0
                ).toFixed(1)}{" "}
                kW
              </div>

            </div>

          ))}

        </div>

      </div>
    )}

</div>

);
}

export default EnergySources;
