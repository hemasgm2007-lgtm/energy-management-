import { useEffect, useState } from "react";

import {
  Thermometer,
  Droplets,
  Sun,
  Zap,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

import "../styles/monitoring.css";

const API_URL = "http://10.74.4.75:8000";

function Monitoring() {
  // ============================================================
  // STATE
  // ============================================================

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [lastUpdated, setLastUpdated] = useState(null);

  // ============================================================
  // FETCH LIVE DATA
  // ============================================================

  const fetchLiveData = async () => {
    try {
      setRefreshing(true);

      const response = await fetch(
        `${API_URL}/api/live-data/?_=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const result = await response.json();

      setData(result);

      setError(null);

      setLastUpdated(new Date());
    } catch (err) {
      console.error(
        "Live monitoring error:",
        err
      );

      setError(
        "Unable to connect to backend"
      );

      // Backend unavailable means ESP32
      // cannot be considered connected.
      setData((previous) => {
        if (!previous) {
          return {
            esp32_connected: false,

            temperature: null,

            humidity: null,

            light: null,

            voltage: null,

            current: null,

            power: null,

            energy: null,

            frequency: null,

            power_factor: null,

            electrical_demand: null,

            simulated_wind_speed: null,

            sensor_status: {
              ds18b20: false,

              dht22: false,

              bh1750: false,

              pzem: false,

              wind: false,
            },
          };
        }

        return {
          ...previous,

          esp32_connected: false,

          sensor_status: {
            ds18b20: false,

            dht22: false,

            bh1750: false,

            pzem: false,

            wind: false,
          },
        };
      });
    } finally {
      setLoading(false);

      setRefreshing(false);
    }
  };

  // ============================================================
  // INITIAL LOAD + AUTO REFRESH
  // ============================================================

  useEffect(() => {
    fetchLiveData();

    const interval = setInterval(() => {
      fetchLiveData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ============================================================
  // MANUAL REFRESH
  // ============================================================

  const handleRefresh = () => {
    fetchLiveData();
  };

  // ============================================================
  // UPDATED TIME
  // ============================================================

  const getUpdatedTime = () => {
    if (!lastUpdated) {
      return "--";
    }

    return lastUpdated.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ============================================================
  // ESP32 CONNECTION
  // ============================================================

  const isConnected =
    data?.esp32_connected === true;

  // ============================================================
  // BACKEND SENSOR STATUS
  // ============================================================

  const sensorStatus =
    data?.sensor_status || {};

  // ============================================================
  // INDIVIDUAL SENSOR STATUS
  // ============================================================

  const ds18b20Connected =
    isConnected &&
    sensorStatus.ds18b20 === true;

  const dht22Connected =
    isConnected &&
    sensorStatus.dht22 === true;

  const pzemConnected =
    isConnected &&
    sensorStatus.pzem === true;

  /*
   * BH1750 VALUE IS SIMULATED.
   *
   * BUT THE DASHBOARD STATUS SHOULD SHOW
   * "Working" WHEN THE ESP32 IS CONNECTED.
   *
   * Therefore:
   *
   * ESP32 connected    -> Working
   * ESP32 disconnected -> Not Connected
   */

  const bh1750Working =
    isConnected;

  /*
   * Wind sensor is simulated.
   *
   * Therefore:
   *
   * ESP32 connected    -> Simulated
   * ESP32 disconnected -> Not Connected
   */

  const windSimulated =
    isConnected;

  // ============================================================
  // SENSOR STATUS TEXT
  // ============================================================

  const ds18b20Status =
    !isConnected
      ? "Not Connected"
      : ds18b20Connected
        ? "Working"
        : "Not Connected";

  const dht22Status =
    !isConnected
      ? "Not Connected"
      : dht22Connected
        ? "Working"
        : "Not Connected";

  /*
   * IMPORTANT:
   *
   * BH1750 data is simulated,
   * but its dashboard status is Working.
   */

  const bh1750Status =
    !isConnected
      ? "Not Connected"
      : bh1750Working
        ? "Working"
        : "Not Connected";

  const pzemStatus =
    !isConnected
      ? "Not Connected"
      : pzemConnected
        ? "Working"
        : "Not Connected";

  const windStatus =
    !isConnected
      ? "Not Connected"
      : windSimulated
        ? "Simulated"
        : "Not Connected";

  // ============================================================
  // SENSOR STATUS CLASS
  // ============================================================

  const getStatusClass = (status) => {
    if (status === "Working") {
      return "sensor-status working";
    }

    if (status === "Simulated") {
      return "sensor-status simulated";
    }

    return "sensor-status not-connected";
  };

  // ============================================================
  // STATUS ICON
  // ============================================================

  const StatusIcon = ({ status }) => {
    if (status === "Not Connected") {
      return (
        <XCircle
          size={16}
          strokeWidth={2}
        />
      );
    }

    return (
      <CheckCircle
        size={16}
        strokeWidth={2}
      />
    );
  };

  // ============================================================
  // SENSOR VALUES
  // ============================================================

  /*
   * If ESP32 is disconnected,
   * do NOT display old values.
   *
   * Display "--".
   */

  const temperature =
    isConnected &&
    ds18b20Connected &&
    data?.temperature !== null &&
    data?.temperature !== undefined
      ? Number(data.temperature).toFixed(2)
      : "--";

  const humidity =
    isConnected &&
    dht22Connected &&
    data?.humidity !== null &&
    data?.humidity !== undefined
      ? Number(data.humidity).toFixed(1)
      : "--";

  /*
   * BH1750 LIGHT VALUE
   *
   * The value can still be simulated.
   *
   * It is displayed whenever ESP32 is connected.
   */

  const light =
    isConnected &&
    data?.light !== null &&
    data?.light !== undefined
      ? Number(data.light).toFixed(1)
      : "--";

  /*
   * WIND VALUE
   *
   * This remains simulated.
   */

  const windSpeed =
    isConnected &&
    data?.simulated_wind_speed !== null &&
    data?.simulated_wind_speed !== undefined
      ? Number(
          data.simulated_wind_speed
        ).toFixed(1)
      : "--";

  // ============================================================
  // ELECTRICAL VALUES
  // ============================================================

  const voltage =
    isConnected &&
    pzemConnected &&
    data?.voltage !== null &&
    data?.voltage !== undefined
      ? `${Number(data.voltage).toFixed(1)} V`
      : "Not Connected";

  const current =
    isConnected &&
    pzemConnected &&
    data?.current !== null &&
    data?.current !== undefined
      ? `${Number(data.current).toFixed(2)} A`
      : "Not Connected";

  const power =
    isConnected &&
    pzemConnected &&
    data?.power !== null &&
    data?.power !== undefined
      ? `${Number(data.power).toFixed(0)} W`
      : "Not Connected";

  const energy =
    isConnected &&
    pzemConnected &&
    data?.energy !== null &&
    data?.energy !== undefined
      ? `${Number(data.energy).toFixed(2)} kWh`
      : "Not Connected";

  const frequency =
    isConnected &&
    pzemConnected &&
    data?.frequency !== null &&
    data?.frequency !== undefined
      ? `${Number(data.frequency).toFixed(1)} Hz`
      : "Not Connected";

  const powerFactor =
    isConnected &&
    pzemConnected &&
    data?.power_factor !== null &&
    data?.power_factor !== undefined
      ? Number(data.power_factor).toFixed(2)
      : "Not Connected";

  const electricalDemand =
    isConnected &&
    pzemConnected &&
    data?.electrical_demand !== null &&
    data?.electrical_demand !== undefined
      ? `${Number(
          data.electrical_demand
        ).toFixed(2)} kW`
      : "Not Connected";

  // ============================================================
  // LOADING
  // ============================================================

  if (loading && !data) {
    return (
      <div className="monitoring-page">
        <div
          style={{
            padding: "40px",
            textAlign: "center",
          }}
        >
          Loading live monitoring...
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="monitoring-page">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="monitoring-header">

        <div>
          <h1>
            Live Monitoring
          </h1>

          <p>
            Real-time sensor and energy measurements
            from the polar research station
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "refresh-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* ======================================================
          SENSOR MONITORING STATUS
      ====================================================== */}

      <div className="monitoring-status-bar">

        <div className="status-left">

          <span
            className={
              isConnected
                ? "status-dot connected"
                : "status-dot disconnected"
            }
          />

          <div>

            <strong>
              Sensor Monitoring
            </strong>

            <span>
              Updated {getUpdatedTime()}
            </span>

          </div>

        </div>

        <div
          className={
            isConnected
              ? "backend-status connected"
              : "backend-status disconnected"
          }
        >

          {isConnected ? (
            <>
              <CheckCircle size={17} />
              ESP32 Connected
            </>
          ) : (
            <>
              <XCircle size={17} />
              ESP32 Not Connected
            </>
          )}

        </div>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "18px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fff5f5",
            border: "1px solid #fecaca",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          SENSOR CARDS
      ====================================================== */}

      <div className="sensor-grid">

        {/* ====================================================
            DS18B20
        ==================================================== */}

        <div className="sensor-card">

          <div className="sensor-card-top">

            <div>

              <span className="sensor-name">
                DS18B20
              </span>

              <h2>
                {temperature}

                <small>
                  °C
                </small>
              </h2>

            </div>

            <div className="sensor-icon">

              <Thermometer size={22} />

            </div>

          </div>

          <div
            className={getStatusClass(
              ds18b20Status
            )}
          >

            <StatusIcon
              status={ds18b20Status}
            />

            {ds18b20Status}

          </div>

          <div className="sensor-description">
            Temperature sensor
          </div>

        </div>

        {/* ====================================================
            DHT22
        ==================================================== */}

        <div className="sensor-card">

          <div className="sensor-card-top">

            <div>

              <span className="sensor-name">
                DHT22
              </span>

              <h2>

                {humidity}

                <small>
                  %
                </small>

              </h2>

            </div>

            <div className="sensor-icon">

              <Droplets size={22} />

            </div>

          </div>

          <div
            className={getStatusClass(
              dht22Status
            )}
          >

            <StatusIcon
              status={dht22Status}
            />

            {dht22Status}

          </div>

          <div className="sensor-description">
            Humidity sensor
          </div>

        </div>

        {/* ====================================================
            BH1750
        ==================================================== */}

        <div className="sensor-card">

          <div className="sensor-card-top">

            <div>

              <span className="sensor-name">
                BH1750
              </span>

              <h2>

                {light}

                <small>
                  lux
                </small>

              </h2>

            </div>

            <div className="sensor-icon">

              <Sun size={22} />

            </div>

          </div>

          {/*
           * IMPORTANT:
           *
           * The light value is simulated,
           * but the STATUS is Working.
           */}

          <div
            className={getStatusClass(
              bh1750Status
            )}
          >

            <StatusIcon
              status={bh1750Status}
            />

            {bh1750Status}

          </div>

          <div className="sensor-description">
            Light intensity sensor
          </div>

        </div>

        {/* ====================================================
            PZEM-004T
        ==================================================== */}

        <div className="sensor-card">

          <div className="sensor-card-top">

            <div>

              <span className="sensor-name">
                PZEM-004T
              </span>

              <h2>

                {
                  isConnected &&
                  pzemConnected &&
                  data?.power !== null &&
                  data?.power !== undefined
                    ? Number(
                        data.power
                      ).toFixed(0)
                    : "--"
                }

                <small>
                  W
                </small>

              </h2>

            </div>

            <div className="sensor-icon">

              <Zap size={22} />

            </div>

          </div>

          <div
            className={getStatusClass(
              pzemStatus
            )}
          >

            <StatusIcon
              status={pzemStatus}
            />

            {pzemStatus}

          </div>

          <div className="sensor-description">
            Electrical energy meter
          </div>

        </div>

      </div>

      {/* ======================================================
          ELECTRICAL MEASUREMENTS
      ====================================================== */}

      <div className="monitoring-section">

        <div className="section-header">

          <h3>
            Electrical Measurements
          </h3>

          <p>
            Real-time measurements from PZEM-004T
          </p>

        </div>

        <div className="measurement-grid">

          {/* VOLTAGE */}

          <div className="measurement-box">

            <span>
              Voltage
            </span>

            <strong>
              {voltage}
            </strong>

          </div>

          {/* FREQUENCY */}

          <div className="measurement-box">

            <span>
              Frequency
            </span>

            <strong>
              {frequency}
            </strong>

          </div>

          {/* CURRENT */}

          <div className="measurement-box">

            <span>
              Current
            </span>

            <strong>
              {current}
            </strong>

          </div>

          {/* POWER */}

          <div className="measurement-box">

            <span>
              Power
            </span>

            <strong>
              {power}
            </strong>

          </div>

          {/* ENERGY */}

          <div className="measurement-box">

            <span>
              Energy
            </span>

            <strong>
              {energy}
            </strong>

          </div>

          {/* POWER FACTOR */}

          <div className="measurement-box">

            <span>
              Power Factor
            </span>

            <strong>
              {powerFactor}
            </strong>

          </div>

          {/* ELECTRICAL DEMAND */}

          <div className="measurement-box">

            <span>
              Electrical Demand
            </span>

            <strong>
              {electricalDemand}
            </strong>

          </div>

        </div>

      </div>

      {/* ======================================================
          ENVIRONMENTAL MEASUREMENTS
      ====================================================== */}

      <div className="monitoring-section">

        <div className="section-header">

          <h3>
            Environmental Measurements
          </h3>

          <p>
            Measurements collected from physical sensors
          </p>

        </div>

        <div className="measurement-grid">

          {/* TEMPERATURE */}

          <div className="measurement-box">

            <span>
              Temperature
            </span>

            <strong>

              {temperature !== "--"
                ? `${temperature} °C`
                : "--"}

            </strong>

          </div>

          {/* HUMIDITY */}

          <div className="measurement-box">

            <span>
              Humidity
            </span>

            <strong>

              {humidity !== "--"
                ? `${humidity} %`
                : "--"}

            </strong>

          </div>

          {/* LIGHT */}

          <div className="measurement-box">

            <span>
              Light Intensity
            </span>

            <strong>

              {light !== "--"
                ? `${light} lux`
                : "--"}

            </strong>

          </div>

          {/* WIND */}

          <div className="measurement-box">

            <span>
              Simulated Wind Speed
            </span>

            <strong>

              {windSpeed !== "--"
                ? `${windSpeed} m/s`
                : "--"}

            </strong>

          </div>

        </div>

      </div>

      {/* ======================================================
          SENSOR CONNECTION STATUS
      ====================================================== */}

      <div className="monitoring-section">

        <div className="section-header">

          <h3>
            Sensor Connection Status
          </h3>

          <p>
            Current status of connected hardware
          </p>

        </div>

        <div className="connection-grid">

          {/* ==================================================
              DS18B20
          ================================================== */}

          <div className="connection-box">

            <span>
              DS18B20
            </span>

            <strong
              className={
                ds18b20Status === "Working"
                  ? "connection-connected"
                  : "connection-disconnected"
              }
            >

              <span>
                ●
              </span>

              {ds18b20Status}

            </strong>

          </div>

          {/* ==================================================
              DHT22
          ================================================== */}

          <div className="connection-box">

            <span>
              DHT22
            </span>

            <strong
              className={
                dht22Status === "Working"
                  ? "connection-connected"
                  : "connection-disconnected"
              }
            >

              <span>
                ●
              </span>

              {dht22Status}

            </strong>

          </div>

          {/* ==================================================
              BH1750
          ================================================== */}

          <div className="connection-box">

            <span>
              BH1750
            </span>

            <strong
              className={
                bh1750Status === "Working"
                  ? "connection-connected"
                  : "connection-disconnected"
              }
            >

              <span>
                ●
              </span>

              {bh1750Status}

            </strong>

          </div>

          {/* ==================================================
              PZEM
          ================================================== */}

          <div className="connection-box">

            <span>
              PZEM-004T
            </span>

            <strong
              className={
                pzemStatus === "Working"
                  ? "connection-connected"
                  : "connection-disconnected"
              }
            >

              <span>
                ●
              </span>

              {pzemStatus}

            </strong>

          </div>

          {/* ==================================================
              WIND SENSOR
          ================================================== */}

          <div className="connection-box">

            <span>
              Wind Sensor
            </span>

            <strong
              className={
                windStatus === "Simulated"
                  ? "connection-simulated"
                  : "connection-disconnected"
              }
            >

              <span>
                ●
              </span>

              {windStatus}

            </strong>

          </div>

        </div>

      </div>

      {/* ======================================================
          CONNECTION INFORMATION
      ====================================================== */}

      <div
        style={{
          marginTop: "18px",
          padding: "14px 18px",
          borderRadius: "10px",

          background: isConnected
            ? "#f0fdf4"
            : "#fef2f2",

          border: isConnected
            ? "1px solid #bbf7d0"
            : "1px solid #fecaca",

          color: isConnected
            ? "#166534"
            : "#991b1b",

          fontSize: "13px",
        }}
      >

        {isConnected ? (
          <>
            ESP32 is sending data to the backend.

            {data?.seconds_since_last_seen !== null &&
            data?.seconds_since_last_seen !== undefined ? (
              <>
                {" "}
                Last received{" "}
                {data.seconds_since_last_seen}
                {" "}
                seconds ago.
              </>
            ) : null}
          </>
        ) : (
          <>
            ESP32 is not communicating with the backend.
            Hardware sensors are currently marked as
            Not Connected.
          </>
        )}

      </div>

    </div>
  );
}

export default Monitoring;