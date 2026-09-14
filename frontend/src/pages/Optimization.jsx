import { useEffect, useState } from "react";
import {
  Zap,
  TrendingDown,
  Activity,
  Leaf,
  RefreshCw,
  Lightbulb,
  CheckCircle,
  Sun,
  Wind,
  Flame,
  Fuel,
} from "lucide-react";

import "../styles/Optimization.css";

const API_URL = "http://127.0.0.1:8000";

function Optimization() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOptimization = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/optimization/`);

      if (!response.ok) {
        throw new Error("Unable to fetch optimization data");
      }

      const result = await response.json();

      setData(result?.data ?? result);
    } catch (err) {
      console.error("Optimization API error:", err);
      setError("Unable to connect to the FastAPI backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization();
  }, []);

  if (loading) {
    return (
      <div className="optimization-page">
        <div className="optimization-message">
          Loading optimization data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="optimization-page">
        <div className="optimization-message error">
          {error}
        </div>
      </div>
    );
  }

  const strategy = data?.strategy || [];

  const totalGeneration = Number(data?.total_generation_kw || 0);

  const fuelBefore = Number(
    data?.fuel_consumption_without_optimization || 0
  );

  const fuelAfter = Number(
    data?.fuel_consumption_with_optimization || 0
  );

  const savingPercentage = Number(
    data?.fuel_saving_percent || 0
  );

  const fuelSaving = Math.max(
    fuelBefore - fuelAfter,
    0
  );

  const recommendedAction =
    data?.recommended_action ||
    "Continue using renewable energy sources as the primary supply.";

  const getSourceIcon = (source) => {
    const name = source.toLowerCase();

    if (name.includes("solar")) {
      return <Sun size={20} />;
    }

    if (name.includes("wind")) {
      return <Wind size={20} />;
    }

    if (name.includes("chp")) {
      return <Flame size={20} />;
    }

    if (name.includes("diesel")) {
      return <Fuel size={20} />;
    }

    return <Zap size={20} />;
  };

  return (
    <div className="optimization-page">

      {/* HEADER */}
      <div className="optimization-header">

        <div className="optimization-title">

          <div className="optimization-title-icon">
            <Zap size={23} />
          </div>

          <div>
            <h1>Energy Optimization</h1>

            <p>
              AI-powered energy source scheduling
            </p>
          </div>

        </div>

        <button
          className="optimization-refresh"
          onClick={fetchOptimization}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* SUMMARY CARDS */}
      <div className="optimization-stats">

        <div className="optimization-card">

          <div className="optimization-icon blue">
            <Activity size={21} />
          </div>

          <div>
            <span>Total Generation</span>

            <strong>
              {totalGeneration.toFixed(1)}{" "}
              <small>kW</small>
            </strong>
          </div>

        </div>


        <div className="optimization-card">

          <div className="optimization-icon purple">
            <TrendingDown size={21} />
          </div>

          <div>
            <span>Fuel Before</span>

            <strong>
              {fuelBefore.toFixed(1)}
            </strong>
          </div>

        </div>


        <div className="optimization-card">

          <div className="optimization-icon green">
            <Leaf size={21} />
          </div>

          <div>
            <span>Fuel After</span>

            <strong>
              {fuelAfter.toFixed(1)}
            </strong>
          </div>

        </div>


        <div className="optimization-card">

          <div className="optimization-icon orange">
            <TrendingDown size={21} />
          </div>

          <div>
            <span>Fuel Saving</span>

            <strong>
              {savingPercentage.toFixed(1)}
              <small>%</small>
            </strong>
          </div>

        </div>

      </div>


      {/* OPTIMIZATION PERFORMANCE */}
      <div className="optimization-panel">

        <div className="optimization-panel-header">

          <div>
            <h2>Optimization Performance</h2>

            <p>
              Comparison of energy operation before and
              after optimization
            </p>
          </div>

          <div className="optimization-status">
            <span></span>
            Optimization Active
          </div>

        </div>


        <div className="optimization-content">

          <div className="power-comparison">

            <div className="power-box">

              <span>Without Optimization</span>

              <strong>
                {fuelBefore.toFixed(1)}
              </strong>

              <small>
                Fuel Consumption
              </small>

              <div className="power-bar">
                <div
                  className="current-power-fill"
                  style={{
                    width: "100%",
                  }}
                ></div>
              </div>

            </div>


            <div className="optimization-arrow">
              →
            </div>


            <div className="power-box">

              <span>With Optimization</span>

              <strong>
                {fuelAfter.toFixed(1)}
              </strong>

              <small>
                Fuel Consumption
              </small>

              <div className="power-bar">
                <div
                  className="optimized-power-fill"
                  style={{
                    width: `${Math.max(
                      (fuelAfter / fuelBefore) * 100,
                      5
                    )}%`,
                  }}
                ></div>
              </div>

            </div>

          </div>


          {/* SAVING */}
          <div className="optimization-saving">

            <TrendingDown size={22} />

            <div>
              <strong>
                {savingPercentage.toFixed(1)}% Fuel Saved
              </strong>

              <span>
                Estimated saving: {fuelSaving.toFixed(1)} units
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* ENERGY SOURCE SCHEDULING */}
      <div className="recommendation-panel">

        <div className="recommendation-header">

          <div className="recommendation-title">

            <div className="recommendation-icon">
              <Zap size={21} />
            </div>

            <div>
              <h2>Energy Source Scheduling</h2>

              <p>
                Recommended priority for energy generation
              </p>
            </div>

          </div>

        </div>


        <div className="recommendation-list">

          {strategy.length > 0 ? (

            strategy.map((source, index) => (

              <div
                className="recommendation-item"
                key={source.source || index}
              >

                <div className="source-priority">
                  {source.priority || index + 1}
                </div>

                <div className="source-icon">
                  {getSourceIcon(source.source || "")}
                </div>

                <div className="source-info">

                  <strong>
                    {source.source}
                  </strong>

                  <span>
                    {source.status}
                  </span>

                </div>

                <div className="source-power">

                  <strong>
                    {Number(source.power_kw || 0).toFixed(1)}
                    {" "}
                    kW
                  </strong>

                </div>

              </div>

            ))

          ) : (

            <div className="no-recommendations">

              <Lightbulb size={35} />

              <h3>
                No scheduling data available
              </h3>

            </div>

          )}

        </div>

      </div>


      {/* RECOMMENDED ACTION */}
      <div className="optimization-insight">

        <div className="optimization-insight-icon">
          <CheckCircle size={21} />
        </div>

        <div>

          <h3>Recommended Action</h3>

          <p>
            {recommendedAction}
          </p>

        </div>

      </div>


      {/* AI INSIGHT */}
      <div className="optimization-insight">

        <div className="optimization-insight-icon">
          <Zap size={21} />
        </div>

        <div>

          <h3>AI Optimization Insight</h3>

          <p>
            Renewable energy sources are prioritized first,
            followed by CHP support, while diesel generation
            is kept primarily for backup operation.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Optimization;