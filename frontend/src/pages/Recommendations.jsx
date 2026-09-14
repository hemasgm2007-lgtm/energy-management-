import { useEffect, useState } from "react";
import {
  Lightbulb,
  Zap,
  TrendingDown,
  Leaf,
  RefreshCw,
  CheckCircle,
  Clock,
  Factory,
} from "lucide-react";

import "../styles/Recommendations.css";

function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated recommendation data
  const simulatedData = {
    energy_saving_percent: 12.5,
    estimated_cost_saving: 1840,
    efficiency_percent: 18.7,

    recommendations: [
      {
        id: 1,
        title: "Reduce CNC Machine Idle Time",
        description:
          "CNC Machine 01 is consuming high power during idle periods. Turn off or reduce idle operation when the machine is not actively processing.",
        priority: "High",
        machine: "CNC Machine 01",
        energy_saving: 8.5,
      },
      {
        id: 2,
        title: "Optimize Compressor Usage",
        description:
          "Compressor 01 has higher than normal energy consumption. Check for air leakage and optimize compressor operating hours.",
        priority: "High",
        machine: "Compressor 01",
        energy_saving: 7.2,
      },
      {
        id: 3,
        title: "Shift Heavy Loads to Off-Peak Hours",
        description:
          "Schedule high-energy machines during off-peak hours to reduce electricity costs and improve energy efficiency.",
        priority: "Medium",
        machine: "Overall System",
        energy_saving: 5.8,
      },
      {
        id: 4,
        title: "Optimize Injection Molding Operation",
        description:
          "Injection Molding Machine is operating within normal limits. Optimizing cycle time can further reduce energy consumption.",
        priority: "Medium",
        machine: "Injection Molding 01",
        energy_saving: 4.6,
      },
      {
        id: 5,
        title: "Monitor Welding Unit Consumption",
        description:
          "Welding Unit 01 is operating normally. Continue monitoring its energy consumption to identify unnecessary usage.",
        priority: "Low",
        machine: "Welding Unit 01",
        energy_saving: 3.1,
      },
    ],
  };

  const fetchRecommendations = () => {
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setData(simulatedData);
      setLoading(false);
    }, 700);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const recommendations = data?.recommendations || [];

  return (
    <div className="recommendations-page">

      {/* HEADER */}
      <div className="recommendations-header">
        <div>
          <h1>Recommendations</h1>

          <p>
            AI-powered recommendations for improving
            energy efficiency and reducing operating costs
          </p>
        </div>

        <button
          className="recommendations-refresh"
          onClick={fetchRecommendations}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "refresh-spin" : ""}
          />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>


      {/* LOADING */}
      {loading && (
        <div className="recommendations-message">
          <RefreshCw size={20} className="refresh-spin" />
          <span>Loading recommendations...</span>
        </div>
      )}


      {/* CONTENT */}
      {!loading && (
        <>
          {/* SUMMARY CARDS */}
          <div className="recommendation-stats">

            {/* TOTAL RECOMMENDATIONS */}
            <div className="recommendation-stat-card">
              <div className="recommendation-stat-icon">
                <Lightbulb size={21} />
              </div>

              <div>
                <span>Total Recommendations</span>
                <strong>{recommendations.length}</strong>
              </div>
            </div>


            {/* ENERGY SAVING */}
            <div className="recommendation-stat-card">
              <div className="recommendation-stat-icon">
                <Zap size={21} />
              </div>

              <div>
                <span>Energy Saving</span>

                <strong>
                  {data.energy_saving_percent}%
                </strong>
              </div>
            </div>


            {/* COST SAVING */}
            <div className="recommendation-stat-card">
              <div className="recommendation-stat-icon">
                <TrendingDown size={21} />
              </div>

              <div>
                <span>Potential Cost Saving</span>

                <strong>
                  ₹{data.estimated_cost_saving.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>


            {/* EFFICIENCY */}
            <div className="recommendation-stat-card">
              <div className="recommendation-stat-icon">
                <Leaf size={21} />
              </div>

              <div>
                <span>Efficiency Improvement</span>

                <strong>
                  {data.efficiency_percent}%
                </strong>
              </div>
            </div>

          </div>


          {/* MAIN PANEL */}
          <div className="recommendations-panel">

            <div className="panel-header">

              <div>
                <h2>Energy Optimization Suggestions</h2>

                <p>
                  Recommended actions based on current
                  machine and energy consumption
                </p>
              </div>

              <div className="ai-badge">
                <Lightbulb size={14} />
                AI Powered
              </div>

            </div>


            {/* RECOMMENDATION LIST */}
            {recommendations.length === 0 ? (

              <div className="no-recommendations">
                <CheckCircle size={35} />

                <h3>No Recommendations Available</h3>

                <p>
                  The system currently has no optimization
                  recommendations.
                </p>
              </div>

            ) : (

              <div className="recommendation-list">

                {recommendations.map((item, index) => {

                  const priority = item.priority || "Medium";

                  return (
                    <div
                      className="recommendation-card"
                      key={item.id || index}
                    >

                      {/* ICON */}
                      <div className="recommendation-icon">
                        <Lightbulb size={21} />
                      </div>


                      {/* CONTENT */}
                      <div className="recommendation-content">

                        <div className="recommendation-title-row">

                          <h3>{item.title}</h3>

                          <span
                            className={`priority-badge priority-${priority.toLowerCase()}`}
                          >
                            {priority}
                          </span>

                        </div>


                        <p className="recommendation-description">
                          {item.description}
                        </p>


                        <div className="recommendation-details">

                          {/* MACHINE */}
                          <span>
                            <Factory size={14} />
                            {item.machine}
                          </span>


                          {/* SAVING */}
                          <span>
                            <TrendingDown size={14} />
                            Saving: {item.energy_saving}%
                          </span>


                          {/* STATUS */}
                          <span>
                            <Clock size={14} />
                            Recommended
                          </span>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default Recommendations;