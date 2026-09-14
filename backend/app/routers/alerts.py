from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.alert import Alert

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.get("/")
def get_alerts(
    db: Session = Depends(get_db)
):

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

    alert = Alert(
        severity=severity,
        title=title,
        message=message,
        timestamp=datetime.utcnow()
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

    alert = db.query(Alert).filter(
        Alert.id == alert_id
    ).first()

    if not alert:
        return {
            "error": "Alert not found"
        }

    alert.is_resolved = True

    db.commit()

    return {
        "message": "Alert resolved"
    }