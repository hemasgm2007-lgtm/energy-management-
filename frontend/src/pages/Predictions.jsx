import { useEffect, useState } from "react";
import {
  BrainCircuit,
  TrendingUp,
  Clock,
  Zap,
  RefreshCw,
  Activity,
} from "lucide-react";

import "../styles/Predictions.css";

const API_URL = "http://127.0.0.1:8000";

function Predictions() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/energy/`);

      if (!response.ok) {
        throw new Error("Unable to fetch energy readings");
      }

      const result = await response.json();

      const readingData = Array.isArray(result)
        ? result
        : result.data || [];

      setReadings(readingData);
    } catch (err) {
      console.error("Prediction data error:", err);
      setError("Unable to connect to the FastAPI backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  /*
   * GET POWER FROM SIMULATED READINGS
   */
  const getPower = (reading) => {
    return Number(
      reading?.power_kw ??
      reading?.power ??
      0
    );
  };

  /*
   * GET ENERGY FROM SIMULATED READINGS
   */
  const getEnergy = (reading) => {
    return Number(
      reading?.energy_kwh ??
      reading?.energy ??
      0
    );
  };

  /*
   * SORT READINGS BY TIME
   */
  const sortedReadings = [...readings].sort((a, b) => {
    return (
      new Date(a.timestamp || 0) -
      new Date(b.timestamp || 0)
    );
  });

  /*
   * LAST AVAILABLE SIMULATED POWER
   */
  const latestReading =
    sortedReadings.length > 0
      ? sortedReadings[sortedReadings.length - 1]
      : null;

  const currentPower = latestReading
    ? getPower(latestReading)
    : 0;

  /*
   * USE LAST 5 READINGS FOR SIMPLE FORECAST
   */
  const recentReadings = sortedReadings.slice(-5);

  const recentPowers = recentReadings
    .map(getPower)
    .filter((value) => value > 0);

  /*
   * CALCULATE AVERAGE POWER
   */
  const averagePower =
    recentPowers.length > 0
      ? recentPowers.reduce(
          (sum, value) => sum + value,
          0
        ) / recentPowers.length
      : 0;

  /*
   * SIMPLE TREND CALCULATION
   *
   * If power is increasing, forecast slightly higher.
   * If decreasing, forecast slightly lower.
   */
  let trend = 0;

  if (recentPowers.length >= 2) {
    const first =
      recentPowers[0];

    const last =
      recentPowers[recentPowers.length - 1];

    trend = last - first;
  }

  /*
   * PREDICT NEXT POWER DEMAND
   */
  const predictedPower =
    recentPowers.length > 0
      ? Math.max(
          averagePower + trend * 0.25,
          0
        )
      : 0;

  /*
   * ESTIMATE NEXT-HOUR ENERGY
   */
  const predictedEnergy =
    predictedPower > 0
      ? predictedPower
      : 0;

  /*
   * CURRENT TOTAL ENERGY
   */
  const totalEnergy = sortedReadings.reduce(
    (sum, reading) =>
      sum + getEnergy(reading),
    0
  );

  /*
   * CREATE FORECAST ROWS
   */
  const forecastRows = Array.from(
    { length: 5 },
    (_, index) => {

      const futurePower =
        predictedPower *
        (1 + index * 0.02);

      const futureTime = new Date(
        Date.now() +
          (index + 1) * 60 * 60 * 1000
      );

      return {
        id: index,
        time: futureTime,
        power: futurePower,
        energy: futurePower,
      };
    }
  );

  return (
    <div className="predictions-page">

      {/* HEADER */}
      <div className="predictions-header">

        <div className="prediction-title-row">

          <div className="prediction-title-icon">
            <BrainCircuit size={22} />
          </div>

          <div>
            <h1>Energy Predictions</h1>

            <p>
              AI-powered forecasting of future energy demand
            </p>
          </div>

        </div>

        <button
          className="prediction-refresh-button"
          onClick={fetchPredictions}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


      {/* LOADING */}
      {loading && (
        <div className="prediction-message">
          Loading simulated energy data...
        </div>
      )}


      {/* ERROR */}
      {!loading && error && (
        <div className="prediction-message error">
          {error}
        </div>
      )}


      {!loading && !error && (
        <>

          {/* SUMMARY CARDS */}
          <div className="prediction-stats">

            {/* CURRENT POWER */}
            <div className="prediction-stat-card">

              <div className="prediction-stat-icon blue">
                <Activity size={21} />
              </div>

              <div>
                <span>Current Power</span>

                <strong>
                  {currentPower.toFixed(2)}
                  <small> kW</small>
                </strong>
              </div>

            </div>


            {/* PREDICTED POWER */}
            <div className="prediction-stat-card">

              <div className="prediction-stat-icon purple">
                <TrendingUp size={21} />
              </div>

              <div>
                <span>Predicted Power</span>

                <strong>
                  {predictedPower.toFixed(2)}
                  <small> kW</small>
                </strong>
              </div>

            </div>


            {/* PREDICTED ENERGY */}
            <div className="prediction-stat-card">

              <div className="prediction-stat-icon green">
                <Zap size={21} />
              </div>

              <div>
                <span>Predicted Energy</span>

                <strong>
                  {predictedEnergy.toFixed(2)}
                  <small> kWh</small>
                </strong>
              </div>

            </div>


            {/* FORECAST HORIZON */}
            <div className="prediction-stat-card">

              <div className="prediction-stat-icon orange">
                <Clock size={21} />
              </div>

              <div>
                <span>Forecast Horizon</span>

                <strong>
                  5 <small>Hours</small>
                </strong>
              </div>

            </div>

          </div>


          {/* FORECAST PANEL */}
          <div className="prediction-panel">

            <div className="prediction-panel-header">

              <div>
                <h2>
                  AI Energy Forecast
                </h2>

                <p>
                  Forecast generated from simulated
                  historical energy readings
                </p>
              </div>

              <div className="ai-badge">
                <BrainCircuit size={16} />
                AI Forecast
              </div>

            </div>


            {recentPowers.length === 0 ? (

              <div className="prediction-empty">

                <BrainCircuit size={42} />

                <h3>
                  No simulated energy data
                </h3>

                <p>
                  Add energy readings to generate
                  the demand forecast.
                </p>

              </div>

            ) : (

              <div className="prediction-list">

                {forecastRows.map((prediction) => (

                  <div
                    className="prediction-row"
                    key={prediction.id}
                  >

                    <div className="prediction-time">

                      <Clock size={17} />

                      <span>
                        {prediction.time.toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>

                    </div>


                    <div className="prediction-value">

                      <span>
                        Power Demand
                      </span>

                      <strong>
                        {prediction.power.toFixed(2)}
                        {" "}kW
                      </strong>

                    </div>


                    <div className="prediction-value">

                      <span>
                        Energy
                      </span>

                      <strong>
                        {prediction.energy.toFixed(2)}
                        {" "}kWh
                      </strong>

                    </div>


                    <div className="prediction-confidence">

                      <span>
                        Forecast
                      </span>

                      <div className="confidence-bar">

                        <div
                          className="confidence-fill"
                          style={{
                            width: "85%",
                          }}
                        />

                      </div>

                      <small>
                        85% confidence
                      </small>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* DATA SOURCE */}
          <div className="prediction-insight">

            <div className="insight-icon">
              <Activity size={22} />
            </div>

            <div>

              <h3>
                Prediction Data Source
              </h3>

              <p>
                The forecast uses the simulated energy
                readings stored in the system. Currently
                {readings.length} readings are available,
                with a total recorded energy of{" "}
                {totalEnergy.toFixed(2)} kWh.
              </p>

            </div>

          </div>


          {/* INSIGHT */}
          <div className="prediction-insight">

            <div className="insight-icon">
              <BrainCircuit size={22} />
            </div>

            <div>

              <h3>
                Prediction Insight
              </h3>

              <p>
                Based on recent simulated power demand,
                the system estimates the upcoming energy
                requirement so that the station can prepare
                energy sources in advance.
              </p>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default Predictions;