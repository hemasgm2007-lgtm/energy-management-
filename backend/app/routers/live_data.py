from fastapi import APIRouter
from datetime import datetime, timezone
from typing import Optional


router = APIRouter(
    prefix="/api/live-data",
    tags=["Live Monitoring"]
)


# ============================================================
# ESP32 CONNECTION SETTINGS
# ============================================================

# ESP32 must send data regularly.
#
# If the backend does not receive anything from ESP32
# for more than this number of seconds, ESP32 is considered
# disconnected.
#
# We use 10 seconds because your ESP32 can send readings
# every few seconds.
#
ESP32_TIMEOUT_SECONDS = 10


# ============================================================
# LATEST LIVE DATA
# ============================================================

latest_data = {

    # --------------------------------------------------------
    # REAL ENVIRONMENTAL SENSOR DATA
    # --------------------------------------------------------

    "temperature": None,
    "humidity": None,

    # BH1750 is currently simulated/derived
    "light": None,


    # --------------------------------------------------------
    # REAL PZEM ENERGY DATA
    # --------------------------------------------------------

    "voltage": None,
    "current": None,
    "power": None,
    "energy": None,
    "frequency": None,
    "power_factor": None,


    # --------------------------------------------------------
    # CALCULATED / DERIVED VALUES
    # --------------------------------------------------------

    "electrical_demand": None,
    "heating_demand": None,


    # --------------------------------------------------------
    # ENERGY SOURCES
    # --------------------------------------------------------

    "solar_generation": None,

    # Wind is simulated
    "simulated_wind_speed": None,
    "wind_generation": None,

    "chp_output": None,
    "diesel_output": None,
    "fuel_consumption": None,


    # --------------------------------------------------------
    # SYSTEM STATUS
    # --------------------------------------------------------

    "system_status": "Waiting for sensor data",


    # --------------------------------------------------------
    # SENSOR STATUS
    # --------------------------------------------------------

    "sensor_status": {

        "ds18b20": False,

        "dht22": False,

        # BH1750 is simulated
        "bh1750": False,

        "pzem": False,

        # Wind is simulated
        "wind": False
    },


    # --------------------------------------------------------
    # INFORMATION ABOUT SIMULATION
    # --------------------------------------------------------

    "simulation_status": {

        "light": True,

        "wind": True
    },


    # --------------------------------------------------------
    # ESP32 CONNECTION
    # --------------------------------------------------------

    "esp32_connected": False,

    "last_seen": None,

    "seconds_since_last_seen": None,


    # --------------------------------------------------------
    # LAST UPDATE TIMESTAMP
    # --------------------------------------------------------

    "timestamp": None
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def is_valid_value(value):
    """
    Check whether a value is usable.

    Accepts:
        numbers including 0

    Rejects:
        None
        NaN
    """

    if value is None:
        return False

    try:

        return value == value

    except Exception:

        return False


def safe_float(value, default=0.0):
    """
    Safely convert a value to float.
    """

    try:

        if value is None:
            return default

        return float(value)

    except (ValueError, TypeError):

        return default


# ============================================================
# CHECK ESP32 CONNECTION
# ============================================================

def check_esp32_connection():
    """
    Determine whether ESP32 is currently connected.

    ESP32 is considered connected only when it has sent
    data within ESP32_TIMEOUT_SECONDS.
    """

    if latest_data["last_seen"] is None:

        latest_data["esp32_connected"] = False

        latest_data["seconds_since_last_seen"] = None

        return False


    try:

        last_seen = datetime.fromisoformat(
            latest_data["last_seen"]
        )

        now = datetime.now(timezone.utc)

        elapsed = (
            now - last_seen
        ).total_seconds()


        latest_data["seconds_since_last_seen"] = round(
            elapsed,
            1
        )


        if elapsed <= ESP32_TIMEOUT_SECONDS:

            latest_data["esp32_connected"] = True

            return True

        else:

            latest_data["esp32_connected"] = False

            return False


    except Exception:

        latest_data["esp32_connected"] = False

        return False


# ============================================================
# HANDLE DISCONNECTED ESP32
# ============================================================

def mark_disconnected():
    """
    When ESP32 stops communicating, mark all hardware
    sensors as disconnected.

    Simulated values are also hidden from the live dashboard
    because there is no active ESP32 connection.
    """

    # --------------------------------------------------------
    # REAL SENSORS
    # --------------------------------------------------------

    latest_data["sensor_status"]["ds18b20"] = False

    latest_data["sensor_status"]["dht22"] = False

    latest_data["sensor_status"]["pzem"] = False


    # --------------------------------------------------------
    # SIMULATED SENSORS
    #
    # Even though BH1750 and wind values are simulated,
    # the dashboard should still show the ESP32 hardware
    # as disconnected when the ESP32 is unplugged.
    # --------------------------------------------------------

    latest_data["sensor_status"]["bh1750"] = False

    latest_data["sensor_status"]["wind"] = False


    # --------------------------------------------------------
    # SYSTEM STATUS
    # --------------------------------------------------------

    latest_data["system_status"] = "ESP32 Not Connected"


# ============================================================
# DERIVED / SIMULATED VALUES
# ============================================================

def calculate_derived_values(
    temperature,
    humidity,
    voltage,
    current,
    power
):
    """
    Calculate values that are not currently coming directly
    from physical sensors.

    REAL INPUTS:

        temperature
        humidity
        voltage
        current
        power

    DERIVED / SIMULATED:

        light
        heating demand
        simulated wind speed
        solar generation
        wind generation
        CHP output
        diesel output
        fuel consumption
    """

    temperature = safe_float(temperature)

    humidity = safe_float(humidity)

    voltage = safe_float(voltage)

    current = safe_float(current)

    power = safe_float(power)


    # ========================================================
    # 1. SIMULATED LIGHT
    # ========================================================

    simulated_light = (
        250
        + (temperature * 20)
        + ((100 - humidity) * 15)
    )


    simulated_light = max(
        50,
        min(10000, simulated_light)
    )


    # ========================================================
    # 2. HEATING DEMAND
    # ========================================================

    heating_demand = max(
        0,
        min(
            100,
            (20 - temperature) * 2.5
        )
    )


    # ========================================================
    # 3. SIMULATED WIND SPEED
    # ========================================================

    simulated_wind_speed = (
        4.0
        + (humidity / 20.0)
        + (abs(temperature - 20.0) / 10.0)
    )


    simulated_wind_speed = max(
        2.0,
        min(15.0, simulated_wind_speed)
    )


    # ========================================================
    # 4. SOLAR GENERATION
    # ========================================================

    solar_generation = (
        simulated_light / 10000.0
    ) * 30.0


    solar_generation = max(
        0.0,
        min(30.0, solar_generation)
    )


    # ========================================================
    # 5. WIND GENERATION
    # ========================================================

    wind_generation = (
        simulated_wind_speed / 15.0
    ) * 20.0


    wind_generation = max(
        0.0,
        min(20.0, wind_generation)
    )


    # ========================================================
    # 6. CHP OUTPUT
    # ========================================================

    chp_output = (
        heating_demand / 100.0
    ) * 25.0


    chp_output = max(
        0.0,
        min(25.0, chp_output)
    )


    # ========================================================
    # 7. TOTAL AVAILABLE POWER
    # ========================================================

    available_power = (
        solar_generation
        + wind_generation
        + chp_output
    )


    # ========================================================
    # 8. ELECTRICAL DEMAND
    # ========================================================

    electrical_demand = power / 1000.0


    # ========================================================
    # 9. DIESEL OUTPUT
    # ========================================================

    diesel_output = max(
        0.0,
        electrical_demand - available_power
    )


    diesel_output = min(
        50.0,
        diesel_output
    )


    # ========================================================
    # 10. FUEL CONSUMPTION
    # ========================================================

    fuel_consumption = (
        diesel_output * 0.25
    )


    # ========================================================
    # RETURN
    # ========================================================

    return {

        "light": round(
            simulated_light,
            2
        ),

        "heating_demand": round(
            heating_demand,
            2
        ),

        "simulated_wind_speed": round(
            simulated_wind_speed,
            2
        ),

        "solar_generation": round(
            solar_generation,
            2
        ),

        "wind_generation": round(
            wind_generation,
            2
        ),

        "chp_output": round(
            chp_output,
            2
        ),

        "diesel_output": round(
            diesel_output,
            2
        ),

        "fuel_consumption": round(
            fuel_consumption,
            2
        )
    }


# ============================================================
# POST /UPDATE
# ============================================================

@router.post("/update")
async def update_live_data(data: dict):
    """
    Receive live ESP32 sensor data.

    ESP32 should call:

        POST /api/live-data/update

    every few seconds.

    Every successful request updates "last_seen".

    Therefore the backend knows that ESP32 is alive.
    """

    # ========================================================
    # CURRENT TIME
    # ========================================================

    now = datetime.now(timezone.utc)


    # ========================================================
    # REAL SENSOR VALUES
    # ========================================================

    temperature = data.get(
        "temperature"
    )

    humidity = data.get(
        "humidity"
    )

    voltage = data.get(
        "voltage"
    )

    current = data.get(
        "current"
    )

    power = data.get(
        "power"
    )

    energy = data.get(
        "energy"
    )

    frequency = data.get(
        "frequency"
    )

    power_factor = data.get(
        "power_factor"
    )


    # ========================================================
    # SENSOR STATUS FROM ESP32
    # ========================================================

    esp_sensor_status = data.get(
        "sensor_status",
        {}
    )


    # ========================================================
    # DS18B20
    # ========================================================

    if "ds18b20" in esp_sensor_status:

        latest_data["sensor_status"]["ds18b20"] = bool(
            esp_sensor_status["ds18b20"]
        )

    else:

        latest_data["sensor_status"]["ds18b20"] = (
            is_valid_value(temperature)
        )


    # ========================================================
    # DHT22
    # ========================================================

    if "dht22" in esp_sensor_status:

        latest_data["sensor_status"]["dht22"] = bool(
            esp_sensor_status["dht22"]
        )

    else:

        latest_data["sensor_status"]["dht22"] = (
            is_valid_value(humidity)
        )


    # ========================================================
    # PZEM
    # ========================================================

    if "pzem" in esp_sensor_status:

        latest_data["sensor_status"]["pzem"] = bool(
            esp_sensor_status["pzem"]
        )

    else:

        latest_data["sensor_status"]["pzem"] = any(
            is_valid_value(value)
            for value in [
                voltage,
                current,
                power,
                energy
            ]
        )


    # ========================================================
    # BH1750
    # ========================================================
    #
    # BH1750 is currently simulated.
    #
    # It is NOT a physical reading.
    #
    # ========================================================

    latest_data["sensor_status"]["bh1750"] = True


    # ========================================================
    # WIND
    # ========================================================
    #
    # Wind is currently simulated.
    #
    # ========================================================

    latest_data["sensor_status"]["wind"] = True


    # ========================================================
    # CALCULATE DERIVED VALUES
    # ========================================================

    derived_values = calculate_derived_values(

        temperature=temperature,

        humidity=humidity,

        voltage=voltage,

        current=current,

        power=power

    )


    # ========================================================
    # STORE REAL SENSOR DATA
    # ========================================================

    latest_data["temperature"] = (

        round(
            safe_float(temperature),
            2
        )

        if is_valid_value(temperature)

        else None

    )


    latest_data["humidity"] = (

        round(
            safe_float(humidity),
            2
        )

        if is_valid_value(humidity)

        else None

    )


    latest_data["voltage"] = (

        round(
            safe_float(voltage),
            2
        )

        if is_valid_value(voltage)

        else None

    )


    latest_data["current"] = (

        round(
            safe_float(current),
            2
        )

        if is_valid_value(current)

        else None

    )


    latest_data["power"] = (

        round(
            safe_float(power),
            2
        )

        if is_valid_value(power)

        else None

    )


    latest_data["energy"] = (

        round(
            safe_float(energy),
            4
        )

        if is_valid_value(energy)

        else None

    )


    latest_data["frequency"] = (

        round(
            safe_float(frequency),
            2
        )

        if is_valid_value(frequency)

        else None

    )


    latest_data["power_factor"] = (

        round(
            safe_float(power_factor),
            2
        )

        if is_valid_value(power_factor)

        else None

    )


    # ========================================================
    # ELECTRICAL DEMAND
    # ========================================================

    incoming_electrical_demand = data.get(
        "electrical_demand"
    )


    if is_valid_value(
        incoming_electrical_demand
    ):

        latest_data["electrical_demand"] = round(
            safe_float(
                incoming_electrical_demand
            ),
            3
        )

    elif is_valid_value(power):

        latest_data["electrical_demand"] = round(
            safe_float(power) / 1000.0,
            3
        )

    else:

        latest_data["electrical_demand"] = 0.0


    # ========================================================
    # STORE SIMULATED LIGHT
    # ========================================================

    latest_data["light"] = (
        derived_values["light"]
    )


    # ========================================================
    # STORE HEATING DEMAND
    # ========================================================

    latest_data["heating_demand"] = (
        derived_values["heating_demand"]
    )


    # ========================================================
    # STORE SIMULATED WIND SPEED
    # ========================================================

    latest_data["simulated_wind_speed"] = (
        derived_values["simulated_wind_speed"]
    )


    # ========================================================
    # STORE ENERGY SOURCE VALUES
    # ========================================================

    latest_data["solar_generation"] = (
        derived_values["solar_generation"]
    )

    latest_data["wind_generation"] = (
        derived_values["wind_generation"]
    )

    latest_data["chp_output"] = (
        derived_values["chp_output"]
    )

    latest_data["diesel_output"] = (
        derived_values["diesel_output"]
    )

    latest_data["fuel_consumption"] = (
        derived_values["fuel_consumption"]
    )


    # ========================================================
    # SIMULATION INFORMATION
    # ========================================================

    latest_data["simulation_status"] = {

        "light": True,

        "wind": True

    }


    # ========================================================
    # SYSTEM STATUS
    # ========================================================

    real_sensor_count = sum([

        latest_data["sensor_status"]["ds18b20"],

        latest_data["sensor_status"]["dht22"],

        latest_data["sensor_status"]["pzem"]

    ])


    if real_sensor_count >= 3:

        latest_data["system_status"] = (
            "Normal"
        )

    elif real_sensor_count > 0:

        latest_data["system_status"] = (
            "Partial Sensor Connection"
        )

    else:

        latest_data["system_status"] = (
            "Waiting for Sensor Data"
        )


    # ========================================================
    # ESP32 HEARTBEAT
    # ========================================================
    #
    # THIS IS THE IMPORTANT PART.
    #
    # Every time ESP32 sends data, we update last_seen.
    #
    # ========================================================

    latest_data["esp32_connected"] = True


    latest_data["last_seen"] = (
        now.isoformat()
    )


    latest_data["seconds_since_last_seen"] = 0.0


    # ========================================================
    # TIMESTAMP
    # ========================================================

    latest_data["timestamp"] = (
        now.isoformat()
    )


    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "message": (
            "Sensor data received successfully"
        ),

        "esp32_connected": True,

        "last_seen": latest_data[
            "last_seen"
        ],

        "data": latest_data

    }


# ============================================================
# GET /
# ============================================================

@router.get("/")
async def get_live_data():
    """
    Return latest live data.

    This endpoint also checks the ESP32 heartbeat.

    If ESP32 has not communicated within
    ESP32_TIMEOUT_SECONDS, the system marks it
    as disconnected.
    """

    # ========================================================
    # CHECK ESP32
    # ========================================================

    connected = check_esp32_connection()


    # ========================================================
    # IF DISCONNECTED
    # ========================================================

    if not connected:

        mark_disconnected()


    # ========================================================
    # RETURN CURRENT DATA
    # ========================================================

    return latest_data


# ============================================================
# GET /SENSOR-STATUS
# ============================================================

@router.get("/sensor-status")
async def get_sensor_status():
    """
    Return current status of all sensors.

    Also checks ESP32 connection.
    """

    # ========================================================
    # CHECK ESP32
    # ========================================================

    connected = check_esp32_connection()


    # ========================================================
    # IF DISCONNECTED
    # ========================================================

    if not connected:

        mark_disconnected()


    # ========================================================
    # RETURN STATUS
    # ========================================================

    return {

        "esp32_connected": latest_data[
            "esp32_connected"
        ],

        "sensor_status": latest_data[
            "sensor_status"
        ],

        "simulation_status": latest_data[
            "simulation_status"
        ],

        "system_status": latest_data[
            "system_status"
        ],

        "last_seen": latest_data[
            "last_seen"
        ],

        "seconds_since_last_seen": latest_data[
            "seconds_since_last_seen"
        ],

        "timestamp": latest_data[
            "timestamp"
        ]

    }