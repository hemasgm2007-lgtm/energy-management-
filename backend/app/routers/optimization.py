from fastapi import APIRouter

router = APIRouter(
    prefix="/optimization",
    tags=["Optimization"]
)


@router.get("/")
def get_optimization():

    return {

        "strategy": [
            {
                "source": "Solar",
                "power_kw": 38,
                "priority": 1,
                "status": "Primary"
            },
            {
                "source": "Wind",
                "power_kw": 21,
                "priority": 2,
                "status": "Primary"
            },
            {
                "source": "CHP",
                "power_kw": 14,
                "priority": 3,
                "status": "Support"
            },
            {
                "source": "Diesel Generator",
                "power_kw": 5,
                "priority": 4,
                "status": "Backup"
            }
        ],

        "total_generation_kw": 78,

        "fuel_consumption_without_optimization": 28.4,

        "fuel_consumption_with_optimization": 18.4,

        "fuel_saving_percent": 35.2,

        "recommended_action":
            "Keep Diesel Generator in backup mode and shift non-critical loads."
    }