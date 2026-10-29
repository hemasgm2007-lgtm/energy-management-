import { useEffect, useState } from "react";

import {
  Sun,
  Wind,
  BatteryCharging,
  Factory,
  Fuel,
  Zap,
  TrendingDown,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react";

import "../styles/Optimization.css";

const API_URL = "http://10.74.4.75:8000";

function Optimization() {
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOptimization = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/optimization/`);

      if (!response.ok) {
        throw new Error(
          `Optimization API returned ${response.status}`
        );
      }

      const data = await response.json();

      setOptimization(data);
    } catch (err) {
      console.error("Optimization fetch error:", err);

      setError(
        "Unable to load optimization data. Make sure the FastAPI backend is running."
      );
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
        <div className="optimization-loading">
          <RefreshCw size={28} className="spin" />
          <p>Loading energy optimization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="optimization-page">
        <div className="optimization-error">
          <AlertTriangle size={30} />
          <h3>Optimization Data Unavailable</h3>
          <p>{error}</p>

          <button
            className="retry-button"
            onClick={fetchOptimization}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!optimization) {
    return null;
  }

  const strategy = Array.isArray(optimization.strategy)
    ? optimization.strategy
    : [];

  const hourlyOptimization = Array.isArray(
    optimization.hourly_optimization
  )
    ? optimization.hourly_optimization
    : [];

  const batteryCapacity =
    Number(optimization.battery_capacity_kwh) || 0;

  const batteryFinalSOC =
    Number(optimization.battery_final_soc_kwh) || 0;

  const batteryFinalPercent =
    Number(optimization.battery_final_soc_percent) || 0;

  const batteryCharge =
    Number(optimization.total_battery_charge_kwh) || 0;

  const batteryDischarge =
    Number(optimization.total_battery_discharge_kwh) || 0;

  const fuelSavingPercent =
    Number(optimization.fuel_saving_percent) || 0;

  const fuelSaving =
    Number(optimization.fuel_saving) || 0;

  const predictedDemand =
    Number(optimization.predicted_demand_kw) || 0;

  const totalDemand =
    Number(optimization.total_predicted_demand_kwh) || 0;

  const renewableGeneration =
    Number(optimization.renewable_generation_kwh) || 0;

  const dieselGeneration =
    Number(optimization.total_diesel_generation_kwh) || 0;

  const getSourceIcon = (source) => {
    const name = source.toLowerCase();

    if (name.includes("solar")) {
      return <Sun size={22} />;
    }

    if (name.includes("wind")) {
      return <Wind size={22} />;
    }

    if (name.includes("battery")) {
      return <BatteryCharging size={22} />;
    }

    if (name.includes("chp")) {
      return <Factory size={22} />;
    }

    if (name.includes("diesel")) {
      return <Fuel size={22} />;
    }

    return <Zap size={22} />;
  };

  const getStatusClass = (status) => {
    if (!status) return "";

    const value = status.toLowerCase();

    if (
      value.includes("primary") ||
      value.includes("active")
    ) {
      return "status-primary";
    }

    if (value.includes("support")) {
      return "status-support";
    }

    if (value.includes("backup required")) {
      return "status-warning";
    }

    if (value.includes("backup")) {
      return "status-backup";
    }

    if (value.includes("charging")) {
      return "status-storage";
    }

    if (value.includes("standby")) {
      return "status-standby";
    }

    return "";
  };

  return (
    <div className="optimization-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="optimization-header">
        <div>
          <h1>Energy Optimization</h1>

          <p>
            AI-based energy source scheduling and simulated
            storage management
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchOptimization}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>


      {/* =====================================================
          PROTOTYPE NOTICE
      ====================================================== */}

      <div className="simulation-banner">
        <Activity size={20} />

        <div>
          <strong>
            Prototype Simulation
          </strong>

          <span>
            Energy demand, generation forecast and battery
            storage are currently simulated because the
            research-station machines and physical storage
            system are not yet available.
          </span>
        </div>
      </div>


      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="optimization-summary">

        <div className="optimization-card">
          <div className="optimization-card-icon demand-icon">
            <Zap size={23} />
          </div>

          <div>
            <span>Peak Demand</span>

            <strong>
              {predictedDemand.toFixed(1)} kW
            </strong>

            <small>
              Peak hour: {optimization.peak_hour || "--"}
            </small>
          </div>
        </div>


        <div className="optimization-card">
          <div className="optimization-card-icon renewable-icon">
            <Sun size={23} />
          </div>

          <div>
            <span>Renewable Generation</span>

            <strong>
              {renewableGeneration.toFixed(1)} kWh
            </strong>

            <small>
              Solar + Wind
            </small>
          </div>
        </div>


        <div className="optimization-card">
          <div className="optimization-card-icon battery-icon">
            <BatteryCharging size={23} />
          </div>

          <div>
            <span>Battery SOC</span>

            <strong>
              {batteryFinalSOC.toFixed(1)} kWh
            </strong>

            <small>
              {batteryFinalPercent.toFixed(1)}% of{" "}
              {batteryCapacity.toFixed(0)} kWh
            </small>
          </div>
        </div>


        <div className="optimization-card">
          <div className="optimization-card-icon saving-icon">
            <TrendingDown size={23} />
          </div>

          <div>
            <span>Fuel Saving</span>

            <strong>
              {fuelSavingPercent.toFixed(1)}%
            </strong>

            <small>
              {fuelSaving.toFixed(1)} fuel units
            </small>
          </div>
        </div>

      </div>


      {/* =====================================================
          BATTERY STORAGE
      ====================================================== */}

      <section className="optimization-section">

        <div className="section-title">
          <div>
            <h2>Battery Storage</h2>

            <p>
              Simulated energy storage state across the
              forecast period
            </p>
          </div>

          <div className="storage-status">
            <BatteryCharging size={18} />

            Simulated Storage
          </div>
        </div>


        <div className="battery-panel">

          <div className="battery-main">

            <div className="battery-icon-large">
              <BatteryCharging size={32} />
            </div>

            <div>
              <span>Final State of Charge</span>

              <h3>
                {batteryFinalSOC.toFixed(1)} kWh
              </h3>

              <p>
                {batteryFinalPercent.toFixed(1)}% remaining
              </p>
            </div>

          </div>


          <div className="battery-progress-container">

            <div className="battery-progress-header">
              <span>
                Battery Capacity
              </span>

              <strong>
                {batteryFinalSOC.toFixed(1)} /{" "}
                {batteryCapacity.toFixed(1)} kWh
              </strong>
            </div>

            <div className="battery-progress">
              <div
                className="battery-progress-fill"
                style={{
                  width: `${Math.min(
                    Math.max(batteryFinalPercent, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="battery-progress-labels">
              <span>0 kWh</span>
              <span>
                {batteryCapacity.toFixed(0)} kWh
              </span>
            </div>

          </div>


          <div className="battery-stats">

            <div>
              <span>Charged</span>

              <strong>
                +{batteryCharge.toFixed(1)} kWh
              </strong>
            </div>

            <div>
              <span>Discharged</span>

              <strong>
                -{batteryDischarge.toFixed(1)} kWh
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SOURCE STRATEGY
      ====================================================== */}

      <section className="optimization-section">

        <div className="section-title">
          <div>
            <h2>Energy Source Strategy</h2>

            <p>
              Source priority during the predicted peak
              period
            </p>
          </div>

          <div className="peak-badge">
            <Clock size={16} />

            Peak: {optimization.peak_hour || "--"}
          </div>
        </div>


        <div className="strategy-list">

          {strategy.map((item, index) => (

            <div
              className="strategy-row"
              key={`${item.source}-${index}`}
            >

              <div className="strategy-priority">
                {item.priority}
              </div>


              <div className="strategy-source-icon">
                {getSourceIcon(item.source)}
              </div>


              <div className="strategy-source">

                <strong>
                  {item.source}
                </strong>

                <span>
                  Priority {item.priority}
                </span>

              </div>


              <div className="strategy-power">

                <strong>
                  {Number(item.power_kw || 0).toFixed(1)}
                  {" "}kW
                </strong>

              </div>


              <div
                className={`strategy-status ${getStatusClass(
                  item.status
                )}`}
              >
                {item.status}
              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          6-HOUR FORECAST
      ====================================================== */}

      <section className="optimization-section">

        <div className="section-title">

          <div>
            <h2>
              6-Hour Energy Schedule
            </h2>

            <p>
              Hour-by-hour simulated source allocation
            </p>
          </div>

          <div className="forecast-badge">
            {optimization.forecast_horizon || "6 hours"}
          </div>

        </div>


        <div className="forecast-table-wrapper">

          <table className="forecast-table">

            <thead>
              <tr>
                <th>Hour</th>
                <th>Demand</th>
                <th>Solar</th>
                <th>Wind</th>
                <th>Battery</th>
                <th>CHP</th>
                <th>Diesel</th>
                <th>Battery SOC</th>
              </tr>
            </thead>


            <tbody>

              {hourlyOptimization.map(
                (item, index) => {

                  const batteryValue =
                    Number(
                      item.battery_discharge_kw || 0
                    );

                  const batteryCharge =
                    Number(
                      item.battery_charge_kw || 0
                    );

                  return (
                    <tr key={`${item.hour}-${index}`}>

                      <td>
                        <strong>
                          {item.hour}
                        </strong>
                      </td>

                      <td>
                        {Number(
                          item.demand_kw || 0
                        ).toFixed(1)}
                        {" "}kW
                      </td>

                      <td>
                        <span className="solar-value">
                          {Number(
                            item.solar_kw || 0
                          ).toFixed(1)}
                        </span>
                        {" "}kW
                      </td>

                      <td>
                        <span className="wind-value">
                          {Number(
                            item.wind_kw || 0
                          ).toFixed(1)}
                        </span>
                        {" "}kW
                      </td>

                      <td>

                        {batteryValue > 0 ? (
                          <span className="battery-discharge">
                            -{batteryValue.toFixed(1)} kW
                          </span>
                        ) : batteryCharge > 0 ? (
                          <span className="battery-charge">
                            +{batteryCharge.toFixed(1)} kW
                          </span>
                        ) : (
                          <span>0.0 kW</span>
                        )}

                      </td>

                      <td>
                        {Number(
                          item.chp_kw || 0
                        ).toFixed(1)}
                        {" "}kW
                      </td>

                      <td>

                        <span
                          className={
                            Number(
                              item.diesel_kw || 0
                            ) > 0
                              ? "diesel-active"
                              : "diesel-zero"
                          }
                        >
                          {Number(
                            item.diesel_kw || 0
                          ).toFixed(1)}
                        </span>

                        {" "}kW

                      </td>

                      <td>

                        <div className="soc-cell">

                          <div className="soc-bar">
                            <div
                              className="soc-fill"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    Number(
                                      item.battery_soc_percent || 0
                                    ),
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span>
                            {Number(
                              item.battery_soc_percent || 0
                            ).toFixed(0)}
                            %
                          </span>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =====================================================
          FUEL COMPARISON
      ====================================================== */}

      <section className="optimization-section">

        <div className="section-title">

          <div>
            <h2>
              Fuel Consumption Comparison
            </h2>

            <p>
              Estimated six-hour fuel usage
            </p>
          </div>

          <TrendingDown size={22} />

        </div>


        <div className="fuel-comparison">

          <div className="fuel-box">

            <span>
              Without Optimization
            </span>

            <strong>
              {Number(
                optimization.fuel_consumption_without_optimization || 0
              ).toFixed(1)}
            </strong>

            <small>
              Diesel-only reference
            </small>

          </div>


          <div className="fuel-arrow">
            ↓
          </div>


          <div className="fuel-box optimized">

            <span>
              With Optimization
            </span>

            <strong>
              {Number(
                optimization.fuel_consumption_with_optimization || 0
              ).toFixed(1)}
            </strong>

            <small>
              Renewable + Storage + CHP + Diesel
            </small>

          </div>


          <div className="fuel-saving-box">

            <CheckCircle size={24} />

            <div>

              <span>
                Estimated Saving
              </span>

              <strong>
                {fuelSavingPercent.toFixed(1)}%
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          RECOMMENDED ACTION
      ====================================================== */}

      <section className="recommendation-section">

        <div className="recommendation-icon">
          <CheckCircle size={25} />
        </div>

        <div>

          <h3>
            Recommended Energy Strategy
          </h3>

          <p>
            {optimization.recommended_action}
          </p>

        </div>

      </section>


      {/* =====================================================
          PROTOTYPE FOOTER INFORMATION
      ====================================================== */}

      <div className="optimization-footer">

        <span>
          <Activity size={15} />
          Optimization Status:{" "}
          <strong>
            {optimization.optimization_status || "Active"}
          </strong>
        </span>

        <span>
          Data Type:{" "}
          <strong>
            {optimization.data_type ||
              "Predicted / Simulated"}
          </strong>
        </span>

        <span>
          Total Predicted Demand:{" "}
          <strong>
            {totalDemand.toFixed(1)} kWh
          </strong>
        </span>

        <span>
          Diesel Requirement:{" "}
          <strong>
            {dieselGeneration.toFixed(1)} kWh
          </strong>
        </span>

      </div>

    </div>
  );
}

export default Optimization;
