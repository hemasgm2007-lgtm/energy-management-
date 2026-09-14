from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.sensor import Sensor
from app.schemas.sensor import (
    SensorCreate,
    SensorResponse
)

router = APIRouter(
    prefix="/sensors",
    tags=["Sensors"]
)


@router.get("/", response_model=list[SensorResponse])
def get_sensors(
    db: Session = Depends(get_db)
):

    return db.query(Sensor).all()


@router.post("/", response_model=SensorResponse)
def create_sensor(
    sensor: SensorCreate,
    db: Session = Depends(get_db)
):

    new_sensor = Sensor(
        name=sensor.name,
        sensor_type=sensor.sensor_type,
        location=sensor.location,
        value=sensor.value,
        unit=sensor.unit,
        status=sensor.status
    )

    db.add(new_sensor)

    db.commit()

    db.refresh(new_sensor)

    return new_sensor