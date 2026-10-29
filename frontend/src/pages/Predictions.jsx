import { useEffect, useState } from "react";

import {
  BrainCircuit,
  TrendingUp,
  Clock,
  Zap,
  RefreshCw,
  Activity,
  Flame,
  Sun,
  Wind,
  AlertTriangle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "../styles/Predictions.css";

const API_URL = "http://10.74.4.75:8000";

function Predictions() {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/predictions/`);

      if (!response.ok) {
        throw new Error("Unable to fetch prediction data");
      }

      const result = await response.json();

      console.log("Prediction API response:", result);

      setPredictionData(result);
    } catch (err) {
      console.error("Prediction data error:", err);

      setError(
        "Unable to connect to the FastAPI prediction service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  /*
   * ================================
   * PREPARE FORECAST CHART DATA
   * ================================
   */

  const forecastChartData =
    predictionData?.electrical_demand?.map((item, index) => ({
      hour: item.hour,

      electrical:
        Number(item.value) || 0,

      heating:
        Number(
          predictionData?.heating_demand?.[index]?.value
        ) || 0,

      solar:
        Number(
          predictionData?.solar_generation?.[index]?.value
        ) || 0,

      wind:
        Number(
          predictionData?.wind_generation?.[index]?.value
        ) || 0,
    })) || [];

  /*
   * ================================
   * CURRENT / PEAK VALUES
   * ================================
   */

  const electricalValues =
    predictionData?.electrical_demand || [];

  const heatingValues =
    predictionData?.heating_demand || [];

  const solarValues =
    predictionData?.solar_generation || [];

  const windValues =
    predictionData?.wind_generation || [];

  const peakElectrical =
    electricalValues.length > 0
      ? electricalValues.reduce(
          (max, item) =>
            Number(item.value) > Number(max.value)
              ? item
              : max,
          electricalValues[0]
        )
      : null;

  const peakHeating =
    heatingValues.length > 0
      ? heatingValues.reduce(
          (max, item) =>
            Number(item.value) > Number(max.value)
              ? item
              : max,
          heatingValues[0]
        )
      : null;

  const firstElectrical =
    electricalValues.length > 0
      ? Number(electricalValues[0].value)
      : 0;

  const latestElectrical =
    electricalValues.length > 0
      ? Number(
          electricalValues[electricalValues.length - 1].value
        )
      : 0;

  const peakSolar =
    solarValues.length > 0
      ? Math.max(
          ...solarValues.map((item) =>
            Number(item.value) || 0
          )
        )
      : 0;

  const peakWind =
    windValues.length > 0
      ? Math.max(
          ...windValues.map((item) =>
            Number(item.value) || 0
          )
        )
      : 0;

  /*
   * ================================
   * TREND
   * ================================
   */

  const electricalTrend =
    firstElectrical > 0
      ? (
          ((latestElectrical - firstElectrical) /
            firstElectrical) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <div className="predictions-page">

      {/* =================================
          HEADER
      ================================= */}

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
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "refresh-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>


      {/* =================================
          LOADING
      ================================= */}

      {loading && (
        <div className="prediction-message">
          <BrainCircuit size={25} />

          <span>
            Loading AI prediction data...
          </span>
        </div>
      )}


      {/* =================================
          ERROR
      ================================= */}

      {!loading && error && (
        <div className="prediction-message error">

          <AlertTriangle size={22} />

          <span>{error}</span>

          <button
            onClick={fetchPredictions}
            className="retry-button"
          >
            Try Again
          </button>

        </div>
      )}


      {/* =================================
          MAIN CONTENT
      ================================= */}

      {!loading && !error && predictionData && (
        <>

          {/* =================================
              SUMMARY CARDS
          ================================= */}

          <div className="prediction-stats">

            {/* ELECTRICAL DEMAND */}

            <div className="prediction-stat-card">

              <div className="prediction-stat-icon blue">
                <Activity size={21} />
              </div>

              <div>

                <span>
                  Peak Electrical Demand
                </span>

                <strong>
                  {peakElectrical
                    ? Number(peakElectrical.value).toFixed(0)
                    : "0"}

                  <small> kW</small>
                </strong>

                <em>
                  Expected at{" "}
                  {peakElectrical?.hour || "--"}
                </em>

              </div>

            </div>


            {/* HEATING DEMAND */}

            <div className="prediction-stat-card">

              <div className="prediction-stat-icon orange">
                <Flame size={21} />
              </div>

              <div>

                <span>
                  Peak Heating Demand
                </span>

                <strong>
                  {peakHeating
                    ? Number(peakHeating.value).toFixed(0)
                    : "0"}

                  <small> kW</small>
                </strong>

                <em>
                  Expected at{" "}
                  {peakHeating?.hour || "--"}
                </em>

              </div>

            </div>


            {/* SOLAR */}

            <div className="prediction-stat-card">

              <div className="prediction-stat-icon yellow">
                <Sun size={21} />
              </div>

              <div>

                <span>
                  Peak Solar Generation
                </span>

                <strong>
                  {peakSolar.toFixed(0)}
                  <small> kW</small>
                </strong>

                <em>
                  Declines toward evening
                </em>

              </div>

            </div>


            {/* WIND */}

            <div className="prediction-stat-card">

              <div className="prediction-stat-icon cyan">
                <Wind size={21} />
              </div>

              <div>

                <span>
                  Peak Wind Generation
                </span>

                <strong>
                  {peakWind.toFixed(0)}
                  <small> kW</small>
                </strong>

                <em>
                  Available through forecast
                </em>

              </div>

            </div>

          </div>


          {/* =================================
              FORECAST INFORMATION
          ================================= */}

          <div className="forecast-info-row">

            <div className="forecast-info-card">

              <div className="forecast-info-icon">
                <Clock size={19} />
              </div>

              <div>
                <span>Forecast Horizon</span>

                <strong>
                  {predictionData.forecast_horizon || "6 hours"}
                </strong>
              </div>

            </div>


            <div className="forecast-info-card peak">

              <div className="forecast-info-icon">
                <TrendingUp size={19} />
              </div>

              <div>
                <span>Peak Demand Period</span>

                <strong>
                  {predictionData.peak_period || "--"}
                </strong>
              </div>

            </div>


            <div className="forecast-info-card">

              <div className="forecast-info-icon">
                <Zap size={19} />
              </div>

              <div>
                <span>Forecast Points</span>

                <strong>
                  {electricalValues.length}
                </strong>
              </div>

            </div>

          </div>


          {/* =================================
              MAIN FORECAST CHART
          ================================= */}

          <div className="prediction-panel">

            <div className="prediction-panel-header">

              <div>

                <h2>
                  AI Energy Forecast
                </h2>

                <p>
                  Predicted station energy requirements
                  for the upcoming period
                </p>

              </div>

              <div className="ai-badge">

                <BrainCircuit size={16} />

                AI Forecast

              </div>

            </div>


            <div className="prediction-chart">

              <ResponsiveContainer
                width="100%"
                height={390}
              >

                <LineChart
                  data={forecastChartData}
                  margin={{
                    top: 20,
                    right: 25,
                    left: 5,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#edf1f5"
                  />

                  <XAxis
                    dataKey="hour"
                    tick={{
                      fill: "#8194ad",
                      fontSize: 11,
                    }}
                    axisLine={{
                      stroke: "#dfe7ef",
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: "#8194ad",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    unit=" kW"
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e1e8f0",
                      borderRadius: "10px",
                      boxShadow:
                        "0 6px 20px rgba(25,55,90,0.08)",
                    }}
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="electrical"
                    name="Electrical Demand"
                    stroke="#1677ff"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="heating"
                    name="Heating Demand"
                    stroke="#ed8b27"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="solar"
                    name="Solar Generation"
                    stroke="#e2a400"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="wind"
                    name="Wind Generation"
                    stroke="#17a6b8"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* =================================
              FORECAST TABLE
          ================================= */}

          <div className="prediction-panel">

            <div className="prediction-panel-header">

              <div>

                <h2>
                  Hourly Prediction Details
                </h2>

                <p>
                  Predicted energy demand and renewable
                  generation for each forecast hour
                </p>

              </div>

            </div>


            <div className="prediction-table-wrapper">

              <table className="prediction-table">

                <thead>

                  <tr>
                    <th>Hour</th>
                    <th>Electrical Demand</th>
                    <th>Heating Demand</th>
                    <th>Solar Generation</th>
                    <th>Wind Generation</th>
                  </tr>

                </thead>

                <tbody>

                  {forecastChartData.map(
                    (prediction, index) => (

                      <tr key={index}>

                        <td>
                          <div className="table-hour">
                            <Clock size={15} />
                            {prediction.hour}
                          </div>
                        </td>

                        <td>
                          <strong className="electrical-value">
                            {prediction.electrical.toFixed(0)}
                            {" "}kW
                          </strong>
                        </td>

                        <td>
                          {prediction.heating.toFixed(0)}
                          {" "}kW
                        </td>

                        <td>
                          <span className="solar-value">
                            {prediction.solar.toFixed(0)}
                            {" "}kW
                          </span>
                        </td>

                        <td>
                          <span className="wind-value">
                            {prediction.wind.toFixed(0)}
                            {" "}kW
                          </span>
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* =================================
              PEAK PERIOD INSIGHT
          ================================= */}

          <div className="prediction-insight peak-insight">

            <div className="insight-icon">
              <AlertTriangle size={22} />
            </div>

            <div>

              <h3>
                Peak Demand Period
              </h3>

              <p>
                The prediction model identifies{" "}
                <strong>
                  {predictionData.peak_period}
                </strong>{" "}
                as the expected high-demand period.
                Electrical demand reaches approximately{" "}
                <strong>
                  {peakElectrical
                    ? Number(peakElectrical.value).toFixed(0)
                    : "0"}{" "}
                  kW
                </strong>
                . The energy management system can use
                this prediction to prepare available
                generation sources in advance.
              </p>

            </div>

          </div>


          {/* =================================
              AI INSIGHT
          ================================= */}

          <div className="prediction-insight">

            <div className="insight-icon">
              <BrainCircuit size={22} />
            </div>

            <div>

              <h3>
                AI Prediction Insight
              </h3>

              <p>
                The forecast indicates that electrical
                demand increases toward the evening,
                reaching its highest predicted value at{" "}
                <strong>
                  {peakElectrical?.hour || "--"}
                </strong>
                . Solar generation decreases as the
                evening progresses, while wind generation
                remains available throughout the forecast
                period. These predictions can support
                proactive energy-source scheduling at the
                polar research station.
              </p>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default Predictions;