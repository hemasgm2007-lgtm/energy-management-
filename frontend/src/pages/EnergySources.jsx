import { useEffect, useState } from "react";
import {
  Sun,
  Wind,
  Zap,
  Fuel,
  Activity,
  RefreshCw,
} from "lucide-react";

import "../styles/EnergySources.css";

const API_URL = "http://127.0.0.1:8000";

function EnergySources() {
  const [sources, setSources] = useState([]);
  const [totalGeneration, setTotalGeneration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/optimization/`);

      if (!response.ok) {
        throw new Error("Unable to fetch energy sources");
      }

      const result = await response.json();

      setSources(result.strategy || []);
      setTotalGeneration(result.total_generation_kw || 0);
    } catch (err) {
      console.error("Energy Sources API error:", err);
      setError("Unable to connect to the FastAPI backend.");
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

    if (name.includes("chp")) {
      return <Zap size={23} />;
    }

    return <Fuel size={23} />;
  };

  const getIconClass = (source) => {
    const name = source.toLowerCase();

    if (name.includes("solar")) return "solar";
    if (name.includes("wind")) return "wind";
    if (name.includes("chp")) return "chp";

    return "diesel";
  };

  return (
    <div className="energy-sources-page">

      {/* HEADER */}
      <div className="energy-sources-header">

        <div className="energy-sources-title">

          <div className="energy-sources-title-icon">
            <Activity size={23} />
          </div>

          <div>
            <h1>Energy Sources</h1>

            <p>
              Monitor generation from available energy sources
            </p>
          </div>

        </div>

        <button
          className="energy-refresh"
          onClick={fetchSources}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* TOTAL GENERATION */}
      <div className="generation-card">

        <div className="generation-icon">
          <Zap size={24} />
        </div>

        <div>
          <span>Total Current Generation</span>

          <strong>
            {totalGeneration} <small>kW</small>
          </strong>

          <p>
            Combined output from all available energy sources
          </p>
        </div>

      </div>


      {/* SOURCE CARDS */}
      {loading ? (

        <div className="energy-message">
          Loading energy sources...
        </div>

      ) : error ? (

        <div className="energy-message error">
          {error}
        </div>

      ) : sources.length === 0 ? (

        <div className="energy-message">
          No energy sources available.
        </div>

      ) : (

        <div className="source-grid">

          {sources.map((source, index) => {

            const name = source.source || "Unknown Source";

            const power = source.power_kw ?? 0;

            const priority = source.priority ?? "-";

            const status = source.status || "Unknown";

            const percentage =
              totalGeneration > 0
                ? ((power / totalGeneration) * 100).toFixed(1)
                : 0;

            return (
              <div
                className="source-card"
                key={`${name}-${index}`}
              >

                <div className="source-card-top">

                  <div
                    className={`source-icon ${getIconClass(name)}`}
                  >
                    {getIcon(name)}
                  </div>

                  <span className="source-status">
                    ● {status}
                  </span>

                </div>


                <h2>{name}</h2>

                <div className="source-power">

                  <strong>{power}</strong>

                  <span>kW</span>

                </div>


                <div className="source-progress">

                  <div className="source-progress-top">
                    <span>Generation Share</span>
                    <strong>{percentage}%</strong>
                  </div>

                  <div className="progress-track">

                    <div
                      className={`progress-fill ${getIconClass(name)}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>


                <div className="source-details">

                  <div>
                    <span>Priority</span>
                    <strong>#{priority}</strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>{status}</strong>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}


      {/* SOURCE STRATEGY */}
      <div className="source-strategy">

        <div className="strategy-header">

          <div>
            <h2>Energy Source Strategy</h2>

            <p>
              Current priority order used by the optimization system
            </p>
          </div>

          <span>AI Optimized</span>

        </div>


        {!loading && sources.length > 0 && (

          <div className="strategy-list">

            {sources.map((source, index) => (

              <div
                className="strategy-row"
                key={`strategy-${index}`}
              >

                <div className="priority-number">
                  {source.priority}
                </div>

                <div className="strategy-icon">
                  {getIcon(source.source)}
                </div>

                <div className="strategy-name">
                  <strong>{source.source}</strong>
                  <span>{source.status}</span>
                </div>

                <div className="strategy-power">
                  {source.power_kw} kW
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default EnergySources;