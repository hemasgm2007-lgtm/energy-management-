from fastapi import APIRouter
from datetime import datetime


router = APIRouter(
    prefix="/api/live-data",
    tags=["Live Monitoring"]
)


# ============================================================
# LATEST REAL SENSOR DATA
# ============================================================

latest_data = {
    "timestamp": None,

    "temperature": None,
    "humidity": None,
    "light": None,

    "voltage": None,
    "current": None,
    "power": None,
    "energy": None,

    "electrical_demand": None,
    "heating_demand": None,

    "solar_generation": None,
    "wind_generation": None,

    "chp_output": None,
    "diesel_output": None,
    "fuel_consumption": None,

    "system_status": "Waiting for sensor data",

    "sensor_status": {
        "ds18b20": False,
        "dht22": False,
        "bh1750": False,
        "pzem": False,
        "wind": False
    }
}


# ============================================================
# RECEIVE SENSOR DATA FROM ESP32
# ============================================================

@router.post("/update")
def update_live_data(data: dict):

    global latest_data

    # --------------------------------------------
    # Temperature
    # --------------------------------------------

    if "temperature" in data:
        latest_data["temperature"] = data["temperature"]

    # --------------------------------------------
    # Humidity
    # --------------------------------------------

    if "humidity" in data:
        latest_data["humidity"] = data["humidity"]

    # --------------------------------------------
    # Light
    # --------------------------------------------

    if "light" in data:
        latest_data["light"] = data["light"]

    # --------------------------------------------
    # PZEM electrical values
    # --------------------------------------------

    if "voltage" in data:
        latest_data["voltage"] = data["voltage"]

    if "current" in data:
        latest_data["current"] = data["current"]

    if "power" in data:
        latest_data["power"] = data["power"]

    if "energy" in data:
        latest_data["energy"] = data["energy"]

    # --------------------------------------------
    # Electrical demand
    # --------------------------------------------

    if "electrical_demand" in data:
        latest_data["electrical_demand"] = data["electrical_demand"]
    elif data.get("power") is not None:
        latest_data["electrical_demand"] = round(
            float(data["power"]) / 1000,
            2
        )

    # --------------------------------------------
    # Heating demand
    # --------------------------------------------

    if "heating_demand" in data:
        latest_data["heating_demand"] = data["heating_demand"]

    # --------------------------------------------
    # Energy sources
    # --------------------------------------------

    if "solar_generation" in data:
        latest_data["solar_generation"] = data["solar_generation"]

    # IMPORTANT:
    # There is NO physical wind sensor.
    # Therefore we do not create fake wind data.

    latest_data["wind_generation"] = None

    if "chp_output" in data:
        latest_data["chp_output"] = data["chp_output"]

    if "diesel_output" in data:
        latest_data["diesel_output"] = data["diesel_output"]

    if "fuel_consumption" in data:
        latest_data["fuel_consumption"] = data["fuel_consumption"]

    # --------------------------------------------
    # Sensor status
    # --------------------------------------------

    if "sensor_status" in data:

        incoming_status = data["sensor_status"]

        for sensor in [
            "ds18b20",
            "dht22",
            "bh1750",
            "pzem"
        ]:

            if sensor in incoming_status:
                latest_data["sensor_status"][sensor] = bool(
                    incoming_status[sensor]
                )

    # Wind sensor is physically unavailable

    latest_data["sensor_status"]["wind"] = False

    # --------------------------------------------
    # Timestamp
    # --------------------------------------------

    latest_data["timestamp"] = datetime.utcnow().isoformat()

    # --------------------------------------------
    # System status
    # --------------------------------------------

    working_sensors = sum(
        latest_data["sensor_status"][sensor]
        for sensor in [
            "ds18b20",
            "dht22",
            "bh1750",
            "pzem"
        ]
    )

    if working_sensors == 4:
        latest_data["system_status"] = "Normal"

    elif working_sensors > 0:
        latest_data["system_status"] = "Partial Sensor Connection"

    else:
        latest_data["system_status"] = "Waiting for Sensor Data"

    return {
        "message": "Sensor data received successfully",
        "data": latest_data
    }


# ============================================================
# GET CURRENT LIVE DATA
# ============================================================

@router.get("/")
def get_live_data():

    return latest_data


# ============================================================
# SENSOR STATUS
# ============================================================

@router.get("/sensor-status")
def get_sensor_status():

    return {
        "timestamp": latest_data["timestamp"],
        "sensor_status": latest_data["sensor_status"],
        "system_status": latest_data["system_status"]
    }