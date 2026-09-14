from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    severity = Column(String)

    title = Column(String)

    message = Column(String)

    value = Column(Float, nullable=True)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )

    is_resolved = Column(
        Boolean,
        default=False
    )