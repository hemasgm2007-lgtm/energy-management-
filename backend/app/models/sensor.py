from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base


class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    sensor_type = Column(String)

    location = Column(String)

    value = Column(Float, default=0)

    unit = Column(String)

    status = Column(String, default="Online")

    is_active = Column(Boolean, default=True)