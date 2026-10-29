import { useEffect, useState } from "react";

import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Zap,
  RefreshCw,
  ShieldAlert,
  Clock,
  CircleCheck,
} from "lucide-react";

import "../styles/Alerts.css";
const API_URL = "http://10.22.173.75:8000";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolvingId, setResolvingId] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/alerts/`);

      if (!response.ok) {
        throw new Error("Unable to fetch alerts");
      }

      const result = await response.json();

      const alertData = Array.isArray(result)
        ? result
        : result.data || [];

      setAlerts(alertData);
    } catch (err) {
      console.error("Alerts API error:", err);

      setError(
        "Unable to connect to the FastAPI backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const resolveAlert = async (alertId) => {
    try {
      setResolvingId(alertId);

      const response = await fetch(
        `${API_URL}/alerts/${alertId}/resolve`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to resolve alert");
      }

      await fetchAlerts();
    } catch (err) {
      console.error("Resolve alert error:", err);

      setError("Unable to resolve the alert.");
    } finally {
      setResolvingId(null);
    }
  };

  const activeAlerts = alerts.filter(
    (alert) => alert.is_resolved !== true
  );

  const resolvedAlerts = alerts.filter(
    (alert) => alert.is_resolved === true
  );

  const highSeverityAlerts = alerts.filter(
    (alert) =>
      alert.severity?.toLowerCase() === "high"
  );

  const getSeverityClass = (severity) => {
    const value = severity?.toLowerCase();

    if (value === "high") {
      return "high";
    }

    if (value === "medium") {
      return "medium";
    }

    if (value === "low") {
      return "low";
    }

    return "medium";
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Recently";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString();
  };

  return (
    <div className="alerts-page">

      {/* HEADER */}

      <div className="alerts-header">

        <div className="alerts-title">

          <div className="alerts-title-icon">
            <Bell size={23} />
          </div>

          <div>
            <h1>Alerts</h1>

            <p>
              Monitor energy warnings and predictive system events
            </p>
          </div>

        </div>

        <button
          className="alerts-refresh"
          onClick={fetchAlerts}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "alerts-spin" : ""}
          />

          Refresh
        </button>

      </div>

      {/* SIMULATION NOTICE */}

      <div className="alerts-simulation-banner">

        <div className="simulation-icon">
          <ShieldAlert size={19} />
        </div>

        <div className="simulation-content">
          <strong>Simulated Alert Monitoring</strong>

          <p>
            Alert events shown here are simulated for the
            polar research station prototype.
          </p>
        </div>

        <span className="simulation-label">
          Simulated
        </span>

      </div>

      {/* STATISTICS */}

      <div className="alerts-stats">

        <div className="alert-stat-card">

          <div className="alert-stat-icon red">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>Total Alerts</span>
            <strong>{alerts.length}</strong>
          </div>

        </div>

        <div className="alert-stat-card">

          <div className="alert-stat-icon orange">
            <Zap size={21} />
          </div>

          <div>
            <span>Active Alerts</span>
            <strong>{activeAlerts.length}</strong>
          </div>

        </div>

        <div className="alert-stat-card">

          <div className="alert-stat-icon green">
            <CheckCircle size={21} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{resolvedAlerts.length}</strong>
          </div>

        </div>

        <div className="alert-stat-card">

          <div className="alert-stat-icon blue">
            <ShieldAlert size={21} />
          </div>

          <div>
            <span>High Severity</span>
            <strong>{highSeverityAlerts.length}</strong>
          </div>

        </div>

      </div>

      {/* ALERT HISTORY */}

      <div className="alerts-panel">

        <div className="alerts-panel-header">

          <div>
            <h2>Alert History</h2>

            <p>
              Predictive energy monitoring events
            </p>
          </div>

          <span className="alert-live-badge">
            ● Simulated
          </span>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="alerts-message">
            Loading alerts...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="alerts-message error">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          alerts.length === 0 && (
            <div className="alerts-empty">

              <CircleCheck size={44} />

              <h3>No alerts detected</h3>

              <p>
                The simulated energy monitoring system
                currently has no active alerts.
              </p>

            </div>
          )}

        {/* ALERT LIST */}

        {!loading &&
          !error &&
          alerts.length > 0 && (

            <div className="alert-list">

              {alerts.map((alert, index) => {

                const resolved =
                  alert.is_resolved === true;

                const severityClass =
                  getSeverityClass(alert.severity);

                return (
                  <div
                    className={`alert-row ${
                      resolved
                        ? "resolved"
                        : "active-alert"
                    }`}
                    key={alert.id || index}
                  >

                    {/* ICON */}

                    <div
                      className={`alert-icon ${severityClass}`}
                    >
                      {resolved ? (
                        <CheckCircle size={21} />
                      ) : (
                        <AlertTriangle size={21} />
                      )}
                    </div>

                    {/* MAIN */}

                    <div className="alert-main">

                      <div className="alert-title-line">

                        <strong>
                          {alert.title ||
                            "Energy Alert"}
                        </strong>

                        <span
                          className={`severity-badge ${severityClass}`}
                        >
                          {alert.severity ||
                            "Medium"}
                        </span>

                      </div>

                      <p>
                        {alert.message ||
                          "Energy monitoring event detected."}
                      </p>

                      <div className="alert-time">

                        <Clock size={12} />

                        {formatTimestamp(
                          alert.timestamp
                        )}

                      </div>

                    </div>

                    {/* VALUE */}

                    <div className="alert-value">

                      <span>Value</span>

                      <strong>
                        {alert.value !== null &&
                        alert.value !== undefined
                          ? `${Number(
                              alert.value
                            ).toFixed(1)} kW`
                          : "—"}
                      </strong>

                    </div>

                    {/* STATUS */}

                    <div className="alert-status">

                      <span
                        className={
                          resolved
                            ? "resolved-badge"
                            : "active-badge"
                        }
                      >
                        ●{" "}
                        {resolved
                          ? "Resolved"
                          : "Active"}
                      </span>

                    </div>

                    {/* RESOLVE */}

                    {!resolved && (
                      <button
                        className="resolve-button"
                        onClick={() =>
                          resolveAlert(alert.id)
                        }
                        disabled={
                          resolvingId === alert.id
                        }
                      >
                        {resolvingId === alert.id
                          ? "Resolving..."
                          : "Resolve"}
                      </button>
                    )}

                    {resolved && (
                      <div className="resolved-check">
                        <CheckCircle size={18} />
                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

      </div>

    </div>
  );
}

export default Alerts;