from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.machine import Machine
from app.models.sensor import Sensor
from app.models.energy_reading import EnergyReading
from app.models.alert import Alert

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db)
):

    total_machines = db.query(Machine).count()

    active_machines = db.query(Machine).filter(
        Machine.is_active == True
    ).count()

    total_sensors = db.query(Sensor).count()

    total_energy = db.query(
        func.coalesce(
            func.sum(EnergyReading.energy_kwh),
            0
        )
    ).scalar()

    current_power = db.query(
        func.coalesce(
            func.sum(EnergyReading.power_kw),
            0
        )
    ).scalar()

    active_alerts = db.query(Alert).filter(
        Alert.is_resolved == False
    ).count()

    return {
        "total_machines": total_machines,
        "active_machines": active_machines,
        "total_sensors": total_sensors,
        "total_energy_kwh": round(total_energy, 2),
        "current_power_kw": round(current_power, 2),
        "active_alerts": active_alerts
    }