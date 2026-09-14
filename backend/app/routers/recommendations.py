from fastapi import APIRouter

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get("/")
def get_recommendations():

    return [

        {
            "id": 1,
            "priority": "High",
            "title": "Prepare backup generation",
            "reason":
                "Peak electrical demand is expected between 18:00 and 20:00.",
            "action":
                "Keep the Diesel Generator available as backup."
        },

        {
            "id": 2,
            "priority": "Medium",
            "title": "Shift water heating load",
            "reason":
                "Water heating contributes approximately 6 kW during peak period.",
            "action":
                "Move water heating to 21:00."
        },

        {
            "id": 3,
            "priority": "Normal",
            "title": "Continue renewable-first operation",
            "reason":
                "Solar and wind generation are currently available.",
            "action":
                "Continue Solar → Wind → CHP → Diesel priority."
        }
    ]