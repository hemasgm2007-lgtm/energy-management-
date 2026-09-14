from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.energy_reading import EnergyReading
from app.schemas.energy import EnergyCreate

router = APIRouter(
    prefix="/energy",
    tags=["Energy"]
)


@router.get("/")
def get_energy_readings(
    db: Session = Depends(get_db)
):

    readings = (
        db.query(EnergyReading)
        .order_by(EnergyReading.timestamp.desc())
        .limit(50)
        .all()
    )

    return readings


@router.post("/")
def create_energy_reading(
    reading: EnergyCreate,
    db: Session = Depends(get_db)
):

    new_reading = EnergyReading(
        source=reading.source,
        voltage=reading.voltage,
        current=reading.current,
        power_kw=reading.power_kw,
        energy_kwh=reading.energy_kwh,
        temperature=reading.temperature
    )

    db.add(new_reading)

    db.commit()

    db.refresh(new_reading)

    return new_reading