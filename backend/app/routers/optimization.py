from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(
    prefix="/optimization",
    tags=["Optimization"]
)


# ============================================================
# SIMULATED 6-HOUR PREDICTION DATA
# ============================================================
# For the current prototype, these values are simulated because
# the actual research-station machines/load are not available.
# Later, this can be replaced by the ML prediction service.

PREDICTION_DATA = {
    "electrical_demand": [
        {"hour": "17:00", "value": 82},
        {"hour": "18:00", "value": 91},
        {"hour": "19:00", "value": 101},
        {"hour": "20:00", "value": 96},
        {"hour": "21:00", "value": 88},
        {"hour": "22:00", "value": 79},
    ],

    "heating_demand": [
        {"hour": "17:00", "value": 42},
        {"hour": "18:00", "value": 48},
        {"hour": "19:00", "value": 55},
        {"hour": "20:00", "value": 52},
        {"hour": "21:00", "value": 47},
        {"hour": "22:00", "value": 44},
    ],

    "solar_generation": [
        {"hour": "17:00", "value": 38},
        {"hour": "18:00", "value": 30},
        {"hour": "19:00", "value": 21},
        {"hour": "20:00", "value": 10},
        {"hour": "21:00", "value": 3},
        {"hour": "22:00", "value": 0},
    ],

    "wind_generation": [
        {"hour": "17:00", "value": 21},
        {"hour": "18:00", "value": 23},
        {"hour": "19:00", "value": 19},
        {"hour": "20:00", "value": 24},
        {"hour": "21:00", "value": 22},
        {"hour": "22:00", "value": 25},
    ],

    "peak_period": "18:00 - 20:00"
}


# ============================================================
# SIMULATED ENERGY STORAGE / BATTERY
# ============================================================

BATTERY_CAPACITY_KWH = 100.0

# Battery starts 70% charged
INITIAL_BATTERY_SOC_KWH = 70.0

# Maximum battery charging/discharging per hour
MAX_CHARGE_KW = 20.0
MAX_DISCHARGE_KW = 20.0

# Charging/discharging efficiency
BATTERY_EFFICIENCY = 0.90


# ============================================================
# OTHER ENERGY SOURCE PARAMETERS
# ============================================================

# Maximum CHP electrical output
CHP_CAPACITY_KW = 40.0

# Prototype fuel consumption rates
CHP_FUEL_RATE = 0.08
DIESEL_FUEL_RATE = 0.20


# ============================================================
# BATTERY CHARGE
# ============================================================

def charge_battery(
    available_energy: float,
    battery_soc: float
):
    """
    Store surplus renewable energy in the simulated battery.

    available_energy:
        Excess Solar + Wind energy available for charging.

    battery_soc:
        Current battery energy in kWh.
    """

    if available_energy <= 0:
        return 0.0, battery_soc

    remaining_capacity = max(
        BATTERY_CAPACITY_KWH - battery_soc,
        0
    )

    if remaining_capacity <= 0:
        return 0.0, battery_soc

    # Maximum energy that can be sent to battery
    charge_input = min(
        available_energy,
        MAX_CHARGE_KW
    )

    # Account for battery efficiency
    stored_energy = charge_input * BATTERY_EFFICIENCY

    # Don't exceed battery capacity
    stored_energy = min(
        stored_energy,
        remaining_capacity
    )

    new_soc = battery_soc + stored_energy

    return charge_input, new_soc


# ============================================================
# BATTERY DISCHARGE
# ============================================================

def discharge_battery(
    required_energy: float,
    battery_soc: float
):
    """
    Discharge the simulated battery when renewable energy
    cannot fully satisfy the demand.
    """

    if required_energy <= 0:
        return 0.0, battery_soc

    if battery_soc <= 0:
        return 0.0, battery_soc

    discharge_output = min(
        required_energy,
        MAX_DISCHARGE_KW,
        battery_soc * BATTERY_EFFICIENCY
    )

    # Energy removed from battery
    battery_energy_used = discharge_output / BATTERY_EFFICIENCY

    battery_energy_used = min(
        battery_energy_used,
        battery_soc
    )

    new_soc = battery_soc - battery_energy_used

    return discharge_output, new_soc


# ============================================================
# OPTIMIZE ONE HOUR
# ============================================================

def optimize_hour(
    hour,
    demand,
    solar,
    wind,
    battery_soc
):

    # --------------------------------------------------------
    # STEP 1 — USE SOLAR
    # --------------------------------------------------------

    solar_used = min(
        solar,
        demand
    )

    remaining_demand = max(
        demand - solar_used,
        0
    )


    # --------------------------------------------------------
    # STEP 2 — USE WIND
    # --------------------------------------------------------

    wind_used = min(
        wind,
        remaining_demand
    )

    remaining_demand = max(
        remaining_demand - wind_used,
        0
    )


    # --------------------------------------------------------
    # STEP 3 — CHARGE BATTERY WITH EXCESS RENEWABLE ENERGY
    # --------------------------------------------------------

    renewable_available = solar + wind

    renewable_used = solar_used + wind_used

    renewable_excess = max(
        renewable_available - renewable_used,
        0
    )

    battery_charge_kw, battery_soc = charge_battery(
        renewable_excess,
        battery_soc
    )


    # --------------------------------------------------------
    # STEP 4 — DISCHARGE BATTERY IF DEMAND REMAINS
    # --------------------------------------------------------

    battery_discharge_kw, battery_soc = discharge_battery(
        remaining_demand,
        battery_soc
    )

    remaining_demand = max(
        remaining_demand - battery_discharge_kw,
        0
    )


    # --------------------------------------------------------
    # STEP 5 — USE CHP
    # --------------------------------------------------------

    chp_used = min(
        remaining_demand,
        CHP_CAPACITY_KW
    )

    remaining_demand = max(
        remaining_demand - chp_used,
        0
    )


    # --------------------------------------------------------
    # STEP 6 — DIESEL BACKUP
    # --------------------------------------------------------

    diesel_used = remaining_demand


    # --------------------------------------------------------
    # TOTAL GENERATION USED
    # --------------------------------------------------------

    total_generation = (
        solar_used
        + wind_used
        + battery_discharge_kw
        + chp_used
        + diesel_used
    )


    # --------------------------------------------------------
    # FUEL CALCULATION
    # --------------------------------------------------------

    fuel_without_optimization = (
        demand * DIESEL_FUEL_RATE
    )

    fuel_with_optimization = (
        chp_used * CHP_FUEL_RATE
        + diesel_used * DIESEL_FUEL_RATE
    )

    fuel_saving = max(
        fuel_without_optimization
        - fuel_with_optimization,
        0
    )

    if fuel_without_optimization > 0:

        fuel_saving_percent = (
            fuel_saving
            / fuel_without_optimization
            * 100
        )

    else:

        fuel_saving_percent = 0


    # --------------------------------------------------------
    # BATTERY STATUS
    # --------------------------------------------------------

    battery_soc_percent = (
        battery_soc
        / BATTERY_CAPACITY_KWH
        * 100
    )


    return {

        "hour": hour,

        "demand_kw": round(
            demand,
            2
        ),

        "solar_kw": round(
            solar_used,
            2
        ),

        "wind_kw": round(
            wind_used,
            2
        ),

        "battery_charge_kw": round(
            battery_charge_kw,
            2
        ),

        "battery_discharge_kw": round(
            battery_discharge_kw,
            2
        ),

        "battery_soc_kwh": round(
            battery_soc,
            2
        ),

        "battery_soc_percent": round(
            battery_soc_percent,
            2
        ),

        "chp_kw": round(
            chp_used,
            2
        ),

        "diesel_kw": round(
            diesel_used,
            2
        ),

        "total_generation_kw": round(
            total_generation,
            2
        ),

        "fuel_without_optimization": round(
            fuel_without_optimization,
            2
        ),

        "fuel_with_optimization": round(
            fuel_with_optimization,
            2
        ),

        "fuel_saving": round(
            fuel_saving,
            2
        ),

        "fuel_saving_percent": round(
            fuel_saving_percent,
            2
        )
    }


# ============================================================
# COMPLETE 6-HOUR OPTIMIZATION
# ============================================================

def calculate_optimization():

    electrical_demand = (
        PREDICTION_DATA["electrical_demand"]
    )

    solar_generation = (
        PREDICTION_DATA["solar_generation"]
    )

    wind_generation = (
        PREDICTION_DATA["wind_generation"]
    )


    # Make sure all arrays have matching data
    number_of_hours = min(
        len(electrical_demand),
        len(solar_generation),
        len(wind_generation)
    )


    if number_of_hours == 0:

        return {
            "optimization_status": "No prediction data",
            "data_type": "Predicted / Simulated"
        }


    # --------------------------------------------------------
    # BATTERY STARTING STATE
    # --------------------------------------------------------

    battery_soc = INITIAL_BATTERY_SOC_KWH


    hourly_optimization = []


    # --------------------------------------------------------
    # PROCESS EVERY HOUR
    # --------------------------------------------------------

    for index in range(number_of_hours):

        hour = electrical_demand[index]["hour"]

        demand = electrical_demand[index]["value"]

        solar = solar_generation[index]["value"]

        wind = wind_generation[index]["value"]


        result = optimize_hour(

            hour=hour,

            demand=demand,

            solar=solar,

            wind=wind,

            battery_soc=battery_soc
        )


        # Update battery SOC for next hour

        battery_soc = result[
            "battery_soc_kwh"
        ]


        hourly_optimization.append(
            result
        )


    # ========================================================
    # FIND PEAK HOUR
    # ========================================================

    peak_result = max(
        hourly_optimization,
        key=lambda item: item["demand_kw"]
    )

    peak_hour = peak_result["hour"]

    peak_demand = peak_result["demand_kw"]


    # ========================================================
    # SIX-HOUR TOTALS
    # ========================================================

    total_demand = sum(
        item["demand_kw"]
        for item in hourly_optimization
    )


    total_solar = sum(
        item["solar_kw"]
        for item in hourly_optimization
    )


    total_wind = sum(
        item["wind_kw"]
        for item in hourly_optimization
    )


    total_battery_charge = sum(
        item["battery_charge_kw"]
        for item in hourly_optimization
    )


    total_battery_discharge = sum(
        item["battery_discharge_kw"]
        for item in hourly_optimization
    )


    total_chp = sum(
        item["chp_kw"]
        for item in hourly_optimization
    )


    total_diesel = sum(
        item["diesel_kw"]
        for item in hourly_optimization
    )


    total_generation = sum(
        item["total_generation_kw"]
        for item in hourly_optimization
    )


    total_renewable = (
        total_solar
        + total_wind
    )


    total_remaining_after_renewables = max(
        total_demand
        - total_renewable,
        0
    )


    # ========================================================
    # FUEL TOTALS
    # ========================================================

    fuel_without_optimization = sum(
        item["fuel_without_optimization"]
        for item in hourly_optimization
    )


    fuel_with_optimization = sum(
        item["fuel_with_optimization"]
        for item in hourly_optimization
    )


    fuel_saving = max(
        fuel_without_optimization
        - fuel_with_optimization,
        0
    )


    if fuel_without_optimization > 0:

        fuel_saving_percent = (
            fuel_saving
            / fuel_without_optimization
            * 100
        )

    else:

        fuel_saving_percent = 0


    # ========================================================
    # SOURCE STATUS
    # ========================================================

    solar_status = (
        "Primary"
        if total_solar > 0
        else "Unavailable"
    )


    wind_status = (
        "Primary"
        if total_wind > 0
        else "Unavailable"
    )


    battery_status = (
        "Charging / Discharging"
        if (
            total_battery_charge > 0
            or total_battery_discharge > 0
        )
        else "Standby"
    )


    chp_status = (
        "Support"
        if total_chp > 0
        else "Standby"
    )


    diesel_status = (
        "Backup Required"
        if total_diesel > 0
        else "Backup"
    )


    # ========================================================
    # RECOMMENDATION
    # ========================================================

    if total_diesel > 0:

        recommended_action = (

            f"Prioritize Solar and Wind across the "
            f"{number_of_hours}-hour forecast, store surplus "
            f"renewable energy in the battery, discharge the "
            f"battery when required, use CHP as support, and "
            f"keep Diesel Generator as backup for the remaining "
            f"{total_diesel:.1f} kW of predicted demand."

        )

    else:

        recommended_action = (

            f"Prioritize Solar and Wind across the "
            f"{number_of_hours}-hour forecast, store surplus "
            f"renewable energy in the battery, and use CHP "
            f"to cover remaining demand while keeping Diesel "
            f"Generator in backup mode."

        )


    # ========================================================
    # PEAK-HOUR STRATEGY
    # ========================================================

    strategy = [

        {
            "source": "Solar",
            "power_kw": round(
                peak_result["solar_kw"],
                2
            ),
            "priority": 1,
            "status": solar_status
        },

        {
            "source": "Wind",
            "power_kw": round(
                peak_result["wind_kw"],
                2
            ),
            "priority": 2,
            "status": wind_status
        },

        {
            "source": "Battery Storage",
            "power_kw": round(
                peak_result["battery_discharge_kw"],
                2
            ),
            "priority": 3,
            "status": battery_status
        },

        {
            "source": "CHP",
            "power_kw": round(
                peak_result["chp_kw"],
                2
            ),
            "priority": 4,
            "status": chp_status
        },

        {
            "source": "Diesel Generator",
            "power_kw": round(
                peak_result["diesel_kw"],
                2
            ),
            "priority": 5,
            "status": diesel_status
        }

    ]


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        # Existing fields — kept for frontend compatibility

        "strategy": strategy,

        "total_generation_kw": round(
            peak_result["total_generation_kw"],
            2
        ),

        "fuel_consumption_without_optimization": round(
            fuel_without_optimization,
            2
        ),

        "fuel_consumption_with_optimization": round(
            fuel_with_optimization,
            2
        ),

        "fuel_saving": round(
            fuel_saving,
            2
        ),

        "fuel_saving_percent": round(
            fuel_saving_percent,
            2
        ),

        "recommended_action":
            recommended_action,


        # ----------------------------------------------------
        # Forecast
        # ----------------------------------------------------

        "forecast_horizon":
            f"{number_of_hours} hours",

        "peak_period":
            PREDICTION_DATA["peak_period"],

        "peak_hour":
            peak_hour,

        "predicted_demand_kw":
            round(peak_demand, 2),


        # ----------------------------------------------------
        # Six-hour energy totals
        # ----------------------------------------------------

        "total_predicted_demand_kwh":
            round(total_demand, 2),

        "total_solar_generation_kwh":
            round(total_solar, 2),

        "total_wind_generation_kwh":
            round(total_wind, 2),

        "total_chp_generation_kwh":
            round(total_chp, 2),

        "total_diesel_generation_kwh":
            round(total_diesel, 2),

        "renewable_generation_kwh":
            round(total_renewable, 2),

        "remaining_demand_kwh":
            round(
                total_remaining_after_renewables,
                2
            ),


        # ----------------------------------------------------
        # Battery information
        # ----------------------------------------------------

        "battery_capacity_kwh":
            BATTERY_CAPACITY_KWH,

        "battery_initial_soc_kwh":
            INITIAL_BATTERY_SOC_KWH,

        "battery_final_soc_kwh":
            round(
                battery_soc,
                2
            ),

        "battery_final_soc_percent":
            round(
                battery_soc
                / BATTERY_CAPACITY_KWH
                * 100,
                2
            ),

        "total_battery_charge_kwh":
            round(
                total_battery_charge,
                2
            ),

        "total_battery_discharge_kwh":
            round(
                total_battery_discharge,
                2
            ),


        # ----------------------------------------------------
        # Hour-by-hour result
        # ----------------------------------------------------

        "hourly_optimization":
            hourly_optimization,


        # ----------------------------------------------------
        # System status
        # ----------------------------------------------------

        "optimization_status":
            "Active",

        "data_type":
            "Predicted / Simulated",

        "storage_status":
            "Simulated Battery Storage",

        "calculated_at":
            datetime.now(
                timezone.utc
            ).isoformat()
    }


# ============================================================
# API ENDPOINT
# ============================================================

@router.get("/")
def get_optimization():

    return calculate_optimization()