from pydantic import BaseModel


class MachineCreate(BaseModel):
    name: str
    machine_type: str
    power_kw: float
    status: str = "Active"
    priority: str = "Non-Critical"


class MachineResponse(MachineCreate):
    id: int
    is_active: bool

    class Config:
        from_attributes = True