from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime

from app.database import Base


class EnergyReading(Base):
    __tablename__ = "energy_readings"

    id = Column(Integer, primary_key=True, index=True)

    source = Column(String)

    voltage = Column(Float)

    current = Column(Float)

    power_kw = Column(Float)

    energy_kwh = Column(Float)

    temperature = Column(Float)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )