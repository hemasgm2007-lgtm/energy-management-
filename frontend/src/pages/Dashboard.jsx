
import { useEffect, useState } from "react";

import {
  Activity,
  Flame,
  Sun,
  Fuel,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Wind,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "../styles/dashboard.css";

/* =========================================================
   EXISTING AI FORECAST DATA
========================================================= */

const forecastData = [
  { time: "14:00", demand: 72 },
  { time: "15:00", demand: 76 },
  { time: "16:00", demand: 81 },
  { time: "17:00", demand: 87 },
  { time: "18:00", demand: 96 },
  { time: "19:00", demand: 101 },
  { time: "20:00", demand: 94 },
  { time: "21:00", demand: 83 },
];

/* =========================================================
   NEW DASHBOARD CHART DATA
   Simulated values for current demo
========================================================= */

const powerTrendData = [
  { time: "08:00", power: 61 },
  { time: "09:00", power: 65 },
  { time: "10:00", power: 69 },
  { time: "11:00", power: 74 },
  { time: "12:00", power: 79 },
  { time: "13:00", power: 83 },
  { time: "14:00", power: 82 },
  { time: "15:00", power: 86 },
  { time: "16:00", power: 81 },
  { time: "17:00", power: 87 },
  { time: "18:00", power: 92 },
  { time: "19:00", power: 101 },
];

const energyConsumptionData = [
  { day: "Mon", energy: 42 },
  { day: "Tue", energy: 48 },
  { day: "Wed", energy: 45 },
  { day: "Thu", energy: 52 },
  { day: "Fri", energy: 57 },
  { day: "Sat", energy: 51 },
  { day: "Sun", energy: 49 },
];

const sensorPowerData = [
  { sensor: "CNC 01", power: 15.5 },
  { sensor: "Compressor", power: 12.8 },
  { sensor: "Injection", power: 10.6 },
  { sensor: "Heating", power: 8.9 },
];

const energySourceData = [
  {
    time: "08:00",
    solar: 12,
    wind: 16,
    diesel: 9,
  },
  {
    time: "10:00",
    solar: 25,
    wind: 18,
    diesel: 7,
  },
  {
    time: "12:00",
    solar: 38,
    wind: 21,
    diesel: 5,
  },
  {
    time: "14:00",
    solar: 39,
    wind: 22,
    diesel: 4,
  },
  {
    time: "16:00",
    solar: 34,
    wind: 20,
    diesel: 6,
  },
  {
    time: "18:00",
    solar: 21,
    wind: 19,
    diesel: 9,
  },
  {
    time: "20:00",
    solar: 8,
    wind: 17,
    diesel: 13,
  },
];

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendType,
  description,
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">
          <Icon size={21} />
        </div>

        <div className={`trend ${trendType}`}>
          {trendType === "up" ? (
            <ArrowUpRight size={15} />
          ) : (
            <ArrowDownRight size={15} />
          )}

          {trend}
        </div>
      </div>

      <div className="stat-title">{title}</div>

      <div className="stat-value">
        {value}
        <span>{unit}</span>
      </div>

      <div className="stat-description">{description}</div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard/")
      .then((response) => response.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Dashboard API error:", error);
        setLoading(false);
      });
  }, []);

  const totalEnergy = dashboardData?.total_energy_kwh ?? 82.4;
  const currentPower = dashboardData?.current_power_kw ?? 82.4;
  const activeAlerts = dashboardData?.active_alerts ?? 2;

  return (
    <div className="dashboard">

      {/* =====================================================
          PAGE HEADING
      ===================================================== */}

      <div className="page-heading">
        <div>
          <div className="eyebrow">ENERGY COMMAND CENTER</div>

          <h1>Smart Energy Dashboard</h1>

          <p>
            Monitor, predict and optimize energy usage across the station.
          </p>
        </div>

        <div className="last-updated">
          <span className="status-dot"></span>
          Live data
        </div>
      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <div className="stats-grid">

        <StatCard
          title="Electrical Demand"
          value={loading ? "--" : currentPower.toFixed(1)}
          unit="kW"
          icon={Activity}
          trend="8.4%"
          trendType="up"
          description="Current station demand"
        />

        <StatCard
          title="Heating Demand"
          value="41.8"
          unit="kW"
          icon={Flame}
          trend="4.2%"
          trendType="up"
          description="Current heating load"
        />

        <StatCard
          title="Renewable Generation"
          value="59.2"
          unit="kW"
          icon={Sun}
          trend="12.8%"
          trendType="up"
          description="Solar + wind generation"
        />

        <StatCard
          title="Fuel Consumption"
          value="18.4"
          unit="L/hr"
          icon={Fuel}
          trend="15.3%"
          trendType="down"
          description="Diesel consumption rate"
        />

      </div>

      {/* =====================================================
          MAIN CHART + ENERGY MIX
      ===================================================== */}

      <div className="dashboard-grid">

        {/* EXISTING ELECTRICAL DEMAND FORECAST */}

        <div className="panel forecast-panel">

          <div className="panel-header">

            <div>
              <h2>Electrical Demand Forecast</h2>

              <p>
                AI predicted demand for the next 8 hours
              </p>
            </div>

            <div className="ai-badge">
              <Zap size={14} />
              AI Forecast
            </div>

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer width="100%" height={300}>

              <AreaChart data={forecastData}>

                <defs>

                  <linearGradient
                    id="demandGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#1677ed"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="100%"
                      stopColor="#1677ed"
                      stopOpacity={0.02}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e8edf3"
                />

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 12,
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="demand"
                  stroke="#1677ed"
                  strokeWidth={3}
                  fill="url(#demandGradient)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* EXISTING ENERGY MIX */}

        <div className="panel">

          <div className="panel-header">

            <div>
              <h2>Energy Mix</h2>

              <p>Current generation sources</p>
            </div>

          </div>

          <div className="energy-mix">

            <div className="mix-total">
              <strong>78.0</strong>
              <span>kW generated</span>
            </div>

            <div className="mix-item">

              <div className="mix-label">
                <span className="mix-dot solar"></span>
                Solar
              </div>

              <strong>38 kW</strong>

            </div>

            <div className="mix-progress">
              <span style={{ width: "49%" }}></span>
            </div>

            <div className="mix-item">

              <div className="mix-label">
                <span className="mix-dot wind"></span>
                Wind
              </div>

              <strong>21 kW</strong>

            </div>

            <div className="mix-progress">
              <span style={{ width: "27%" }}></span>
            </div>

            <div className="mix-item">

              <div className="mix-label">
                <span className="mix-dot chp"></span>
                CHP
              </div>

              <strong>14 kW</strong>

            </div>

            <div className="mix-progress">
              <span style={{ width: "18%" }}></span>
            </div>

            <div className="mix-item">

              <div className="mix-label">
                <span className="mix-dot diesel"></span>
                Diesel
              </div>

              <strong>5 kW</strong>

            </div>

            <div className="mix-progress">
              <span style={{ width: "6%" }}></span>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          NEW DASHBOARD CHARTS
      ===================================================== */}

      <div className="dashboard-charts-grid">

        {/* =================================================
            POWER CONSUMPTION TREND
        ================================================= */}

        <div className="panel dashboard-chart-panel">

          <div className="panel-header">

            <div>
              <h2>Power Consumption Trend</h2>

              <p>
                Station electrical power usage throughout the day
              </p>
            </div>

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer width="100%" height={280}>

              <LineChart data={powerTrendData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e8edf3"
                />

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 11,
                  }}
                  unit=" kW"
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="power"
                  stroke="#1677ed"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* =================================================
            ENERGY CONSUMPTION
        ================================================= */}

        <div className="panel dashboard-chart-panel">

          <div className="panel-header">

            <div>
              <h2>Energy Consumption</h2>

              <p>
                Daily energy consumption for the last 7 days
              </p>
            </div>

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer width="100%" height={280}>

              <BarChart data={energyConsumptionData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e8edf3"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 11,
                  }}
                  unit=" kWh"
                />

                <Tooltip />

                <Bar
                  dataKey="energy"
                  fill="#1677ed"
                  radius={[5, 5, 0, 0]}
                  barSize={28}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* =================================================
            SENSOR POWER COMPARISON
        ================================================= */}

        <div className="panel dashboard-chart-panel">

          <div className="panel-header">

            <div>
              <h2>Sensor Power Comparison</h2>

              <p>
                Power consumption across monitored equipment
              </p>
            </div>

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer width="100%" height={280}>

              <BarChart
                data={sensorPowerData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 20,
                  left: 10,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e8edf3"
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 11,
                  }}
                  unit=" kW"
                />

                <YAxis
                  type="category"
                  dataKey="sensor"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#5e6b80",
                    fontSize: 11,
                  }}
                  width={85}
                />

                <Tooltip />

                <Bar
                  dataKey="power"
                  fill="#1677ed"
                  radius={[0, 5, 5, 0]}
                  barSize={22}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* =================================================
            ENERGY SOURCE TREND
        ================================================= */}

        <div className="panel dashboard-chart-panel">

          <div className="panel-header">

            <div>
              <h2>Energy Source Trend</h2>

              <p>
                Renewable and backup generation throughout the day
              </p>
            </div>

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer width="100%" height={280}>

              <LineChart data={energySourceData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e8edf3"
                />

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#7b8794",
                    fontSize: 11,
                  }}
                  unit=" kW"
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="solar"
                  stroke="#f5b700"
                  strokeWidth={2.5}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="wind"
                  stroke="#38a8e8"
                  strokeWidth={2.5}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="diesel"
                  stroke="#64748b"
                  strokeWidth={2.5}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* =====================================================
          AI FORECAST
      ===================================================== */}

      <div className="section-heading">

        <div>
          <h2>AI Energy Forecast</h2>

          <p>
            Predicted conditions for the upcoming period
          </p>
        </div>

      </div>

      <div className="forecast-cards">

        <div className="forecast-card">
          <Activity size={20} />

          <span>Electrical Demand</span>

          <strong>101 kW</strong>

          <small>
            Peak expected at 19:00
          </small>
        </div>

        <div className="forecast-card">
          <Flame size={20} />

          <span>Heating Demand</span>

          <strong>55 kW</strong>

          <small>
            Increasing with temperature drop
          </small>
        </div>

        <div className="forecast-card">
          <Sun size={20} />

          <span>Solar Generation</span>

          <strong>21 kW</strong>

          <small>
            Expected decline after 18:00
          </small>
        </div>

        <div className="forecast-card">
          <Wind size={20} />

          <span>Wind Generation</span>

          <strong>19 kW</strong>

          <small>
            Moderate generation expected
          </small>
        </div>

      </div>

      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}

      <div className="dashboard-grid bottom-grid">

        {/* OPTIMIZATION */}

        <div className="panel optimization-panel">

          <div className="panel-header">

            <div>
              <h2>Optimization Performance</h2>

              <p>
                AI-based energy source scheduling
              </p>
            </div>

            <div className="saving-badge">
              35.2% saved
            </div>

          </div>

          <div className="optimization-content">

            <div className="saving-number">
              35.2%
            </div>

            <div className="saving-text">

              <strong>
                Estimated Fuel Saving
              </strong>

              <span>
                Compared with diesel-only operation
              </span>

            </div>

          </div>

          <div className="source-order">

            <span>1</span>
            Solar

            <span>→</span>

            <span>2</span>
            Wind

            <span>→</span>

            <span>3</span>
            CHP

            <span>→</span>

            <span>4</span>
            Diesel

          </div>

        </div>

        {/* ALERTS */}

        <div className="panel alert-panel">

          <div className="panel-header">

            <div>
              <h2>Recent Alerts</h2>

              <p>
                Latest system events
              </p>
            </div>

            <div className="alert-count">
              {activeAlerts}
            </div>

          </div>

          <div className="alert-item high">

            <AlertTriangle size={19} />

            <div>

              <strong>
                High Energy Demand
              </strong>

              <span>
                Peak demand predicted at 19:00
              </span>

            </div>

          </div>

          <div className="alert-item medium">

            <Sun size={19} />

            <div>

              <strong>
                Low Solar Generation
              </strong>

              <span>
                Solar output expected to decrease
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SYSTEM SUMMARY
      ===================================================== */}

      <div className="system-summary">

        <div>

          <span>
            Total Energy
          </span>

          <strong>
            {Number(totalEnergy).toFixed(2)} kWh
          </strong>

        </div>

        <div>

          <span>
            Active Machines
          </span>

          <strong>
            {dashboardData?.active_machines ?? 4}
          </strong>

        </div>

        <div>

          <span>
            Connected Sensors
          </span>

          <strong>
            {dashboardData?.total_sensors ?? 4}
          </strong>

        </div>

        <div>

          <span>
            System Status
          </span>

          <strong className="online-text">
            Operational
          </strong>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
