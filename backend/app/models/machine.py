from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base


class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    machine_type = Column(String)

    power_kw = Column(Float, default=0)

    status = Column(String, default="Active")

    priority = Column(String, default="Non-Critical")

    is_active = Column(Boolean, default=True)