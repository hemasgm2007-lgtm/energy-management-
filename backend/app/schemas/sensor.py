from pydantic import BaseModel


class SensorCreate(BaseModel):
    name: str
    sensor_type: str
    location: str
    value: float = 0
    unit: str
    status: str = "Online"


class SensorResponse(SensorCreate):
    id: int
    is_active: bool

    class Config:
        from_attributes = True