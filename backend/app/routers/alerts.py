from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.alert import Alert

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


def create_simulated_alerts(db: Session):
    """
    Create demonstration alerts only when the alerts table is empty.
    These values are simulated for the prototype.
    """

    existing_alert = db.query(Alert).first()

    if existing_alert:
        return

    simulated_alerts = [
        Alert(
            severity="High",
            title="High Electrical Demand",
            message=(
                "Predicted electrical demand reached 101.0 kW "
                "during the simulated evening peak period."
            ),
            value=101.0,
            timestamp=datetime.utcnow(),
            is_resolved=False
        ),

        Alert(
            severity="Medium",
            title="Low Renewable Availability",
            message=(
                "Simulated solar and wind generation is currently "
                "below the expected renewable contribution."
            ),
            value=24.0,
            timestamp=datetime.utcnow(),
            is_resolved=False
        ),

        Alert(
            severity="Medium",
            title="Battery Discharge Active",
            message=(
                "Simulated battery storage is supporting the station "
                "during a period of increased energy demand."
            ),
            value=20.0,
            timestamp=datetime.utcnow(),
            is_resolved=False
        ),

        Alert(
            severity="High",
            title="Diesel Backup Active",
            message=(
                "Diesel backup generation is simulated as active "
                "because renewable sources cannot fully meet demand."
            ),
            value=8.6,
            timestamp=datetime.utcnow(),
            is_resolved=False
        ),

        Alert(
            severity="Low",
            title="Solar Generation Decline",
            message=(
                "Simulated solar generation has decreased due to "
                "reduced environmental availability."
            ),
            value=12.5,
            timestamp=datetime.utcnow(),
            is_resolved=True
        )
    ]

    db.add_all(simulated_alerts)
    db.commit()


@router.get("/")
def get_alerts(
    db: Session = Depends(get_db)
):
    """
    Return all alerts.
    Creates simulated demonstration alerts if the table is empty.
    """

    create_simulated_alerts(db)

    return (
        db.query(Alert)
        .order_by(Alert.timestamp.desc())
        .all()
    )


@router.post("/")
def create_alert(
    severity: str,
    title: str,
    message: str,
    db: Session = Depends(get_db)
):
    """
    Create a new alert.
    """

    alert = Alert(
        severity=severity,
        title=title,
        message=message,
        timestamp=datetime.utcnow(),
        is_resolved=False
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


@router.patch("/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    """
    Mark an alert as resolved.
    """

    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id)
        .first()
    )

    if not alert:
        return {
            "error": "Alert not found"
        }

    alert.is_resolved = True

    db.commit()
    db.refresh(alert)

    return {
        "message": "Alert resolved",
        "alert": alert
    }