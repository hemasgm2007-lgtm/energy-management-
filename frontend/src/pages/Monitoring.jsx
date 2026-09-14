import { useEffect, useState } from "react";

import {
  Activity,
  Thermometer,
  Droplets,
  Sun,
  Zap,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";

import "../styles/monitoring.css";

const API_URL = "http://127.0.0.1:8000";


function Monitoring() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [lastUpdated, setLastUpdated] = useState(null);

  const [error, setError] = useState(false);


  // ============================================================
  // FETCH REAL SENSOR DATA
  // ============================================================

  const fetchLiveData = async () => {

    try {

      setError(false);

      const response = await fetch(
        `${API_URL}/api/live-data/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sensor data");
      }

      const result = await response.json();

      setData(result);

      setLastUpdated(new Date());

    } catch (err) {

      console.error(
        "Sensor data error:",
        err
      );

      setError(true);

    } finally {

      setLoading(false);
    }
  };


  // ============================================================
  // AUTO REFRESH
  // ============================================================

  useEffect(() => {

    fetchLiveData();

    const interval = setInterval(
      fetchLiveData,
      5000
    );

    return () => clearInterval(interval);

  }, []);


  // ============================================================
  // SENSOR STATUS COMPONENT
  // ============================================================

  const SensorStatus = ({ working }) => {

    if (working) {

      return (
        <span className="card-status">
          <CheckCircle size={15} />
          Working
        </span>
      );

    }

    return (
      <span className="card-status">
        <XCircle size={15} />
        Not Connected
      </span>
    );
  };


  // ============================================================
  // GET SENSOR STATUS
  // ============================================================

  const sensorStatus =
    data?.sensor_status || {};


  return (

    <div className="monitoring-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

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
          onClick={fetchLiveData}
        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </div>


      {/* =====================================================
          CONNECTION STATUS
      ===================================================== */}

      <div className="monitoring-status">

        <div className="status-left">

          <span className="live-dot"></span>

          <div>

            <strong>
              Sensor Monitoring
            </strong>

            <span>

              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : "Waiting for sensor data..."}

            </span>

          </div>

        </div>


        <div className="connection-status">

          {error ? (

            <>
              <XCircle size={16} />
              Backend Offline
            </>

          ) : (

            <>
              <CheckCircle size={16} />
              Backend Connected
            </>

          )}

        </div>

      </div>


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (

        <div className="loading-box">

          <Activity size={22} />

          <span>
            Waiting for sensor data...
          </span>

        </div>

      )}


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && !loading && (

        <div className="error-box">

          Unable to connect to FastAPI.

          <br />

          Make sure the backend server is running.

        </div>

      )}


      {/* =====================================================
          SENSOR DATA
      ===================================================== */}

      {!loading && data && !error && (

        <>


          {/* =================================================
              PHYSICAL SENSORS
          ================================================= */}

          <div className="monitoring-grid">


            {/* DS18B20 */}

            <div className="monitoring-card">

              <div className="monitoring-card-top">

                <div>

                  <p className="monitoring-card-title">
                    DS18B20
                  </p>

                  <div className="monitoring-value">

                    {data.temperature ?? "--"}

                    <span>
                      °C
                    </span>

                  </div>

                </div>


                <div className="monitoring-icon">

                  <Thermometer size={21} />

                </div>

              </div>


              <SensorStatus
                working={
                  sensorStatus.ds18b20
                }
              />

              <p>
                Temperature sensor
              </p>

            </div>


            {/* DHT22 */}

            <div className="monitoring-card">

              <div className="monitoring-card-top">

                <div>

                  <p className="monitoring-card-title">
                    DHT22
                  </p>

                  <div className="monitoring-value">

                    {data.humidity ?? "--"}

                    <span>
                      %
                    </span>

                  </div>

                </div>


                <div className="monitoring-icon">

                  <Droplets size={21} />

                </div>

              </div>


              <SensorStatus
                working={
                  sensorStatus.dht22
                }
              />

              <p>
                Humidity sensor
              </p>

            </div>


            {/* BH1750 */}

            <div className="monitoring-card">

              <div className="monitoring-card-top">

                <div>

                  <p className="monitoring-card-title">
                    BH1750
                  </p>

                  <div className="monitoring-value">

                    {data.light ?? "--"}

                    <span>
                      lux
                    </span>

                  </div>

                </div>


                <div className="monitoring-icon">

                  <Sun size={21} />

                </div>

              </div>


              <SensorStatus
                working={
                  sensorStatus.bh1750
                }
              />

              <p>
                Light intensity sensor
              </p>

            </div>


            {/* PZEM */}

            <div className="monitoring-card">

              <div className="monitoring-card-top">

                <div>

                  <p className="monitoring-card-title">
                    PZEM-004T
                  </p>

                  <div className="monitoring-value">

                    {data.power ?? "--"}

                    <span>
                      W
                    </span>

                  </div>

                </div>


                <div className="monitoring-icon">

                  <Zap size={21} />

                </div>

              </div>


              <SensorStatus
                working={
                  sensorStatus.pzem
                }
              />

              <p>
                Electrical energy meter
              </p>

            </div>

          </div>


          {/* =================================================
              PZEM ELECTRICAL VALUES
          ================================================= */}

          <div className="monitoring-section">

            <div className="section-heading">

              <div>

                <h2>
                  Electrical Measurements
                </h2>

                <p>
                  Real-time measurements from PZEM-004T
                </p>

              </div>

            </div>


            <div className="energy-balance">


              <div className="balance-item">

                <span>
                  Voltage
                </span>

                <strong>

                  {data.voltage ?? "--"} V

                </strong>

              </div>


              <div className="balance-item">

                <span>
                  Current
                </span>

                <strong>

                  {data.current ?? "--"} A

                </strong>

              </div>


              <div className="balance-item">

                <span>
                  Power
                </span>

                <strong>

                  {data.power ?? "--"} W

                </strong>

              </div>


              <div className="balance-item">

                <span>
                  Energy
                </span>

                <strong>

                  {data.energy ?? "--"} kWh

                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              ENVIRONMENT
          ================================================= */}

          <div className="monitoring-section">

            <div className="section-heading">

              <div>

                <h2>
                  Environmental Measurements
                </h2>

                <p>
                  Measurements collected from physical sensors
                </p>

              </div>

            </div>


            <div className="energy-balance">


              <div className="balance-item">

                <span>
                  Temperature
                </span>

                <strong>

                  {data.temperature ?? "--"} °C

                </strong>

              </div>


              <div className="balance-item">

                <span>
                  Humidity
                </span>

                <strong>

                  {data.humidity ?? "--"} %

                </strong>

              </div>


              <div className="balance-item">

                <span>
                  Light Intensity
                </span>

                <strong>

                  {data.light ?? "--"} lux

                </strong>

              </div>


              <div className="balance-item">

                <span>
                  Wind Sensor
                </span>

                <strong>

                  Not Connected

                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              STATION STATUS
          ================================================= */}

          <div className="monitoring-section">

            <div className="section-heading">

              <div>

                <h2>
                  Sensor Connection Status
                </h2>

                <p>
                  Current status of connected hardware
                </p>

              </div>

            </div>


            <div className="station-status-grid">


              <div className="station-status-item">

                <span>
                  DS18B20
                </span>

                <strong>

                  {sensorStatus.ds18b20
                    ? "● Working"
                    : "● Not Connected"}

                </strong>

              </div>


              <div className="station-status-item">

                <span>
                  DHT22
                </span>

                <strong>

                  {sensorStatus.dht22
                    ? "● Working"
                    : "● Not Connected"}

                </strong>

              </div>


              <div className="station-status-item">

                <span>
                  BH1750
                </span>

                <strong>

                  {sensorStatus.bh1750
                    ? "● Working"
                    : "● Not Connected"}

                </strong>

              </div>


              <div className="station-status-item">

                <span>
                  PZEM-004T
                </span>

                <strong>

                  {sensorStatus.pzem
                    ? "● Working"
                    : "● Not Connected"}

                </strong>

              </div>


              <div className="station-status-item">

                <span>
                  Wind Sensor
                </span>

                <strong>
                  ● Not Connected
                </strong>

              </div>

            </div>

          </div>


        </>

      )}

    </div>
  );
}


export default Monitoring;