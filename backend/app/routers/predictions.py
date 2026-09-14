from fastapi import APIRouter

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)


@router.get("/")
def get_predictions():

    return {
        "forecast_horizon": "6 hours",

        "electrical_demand": [
            {"hour": "17:00", "value": 82},
            {"hour": "18:00", "value": 91},
            {"hour": "19:00", "value": 101},
            {"hour": "20:00", "value": 96},
            {"hour": "21:00", "value": 88},
            {"hour": "22:00", "value": 79}
        ],

        "heating_demand": [
            {"hour": "17:00", "value": 42},
            {"hour": "18:00", "value": 48},
            {"hour": "19:00", "value": 55},
            {"hour": "20:00", "value": 52},
            {"hour": "21:00", "value": 47},
            {"hour": "22:00", "value": 44}
        ],

        "solar_generation": [
            {"hour": "17:00", "value": 38},
            {"hour": "18:00", "value": 30},
            {"hour": "19:00", "value": 21},
            {"hour": "20:00", "value": 10},
            {"hour": "21:00", "value": 3},
            {"hour": "22:00", "value": 0}
        ],

        "wind_generation": [
            {"hour": "17:00", "value": 21},
            {"hour": "18:00", "value": 23},
            {"hour": "19:00", "value": 19},
            {"hour": "20:00", "value": 24},
            {"hour": "21:00", "value": 22},
            {"hour": "22:00", "value": 25}
        ],

        "peak_period": "18:00 - 20:00"
    }