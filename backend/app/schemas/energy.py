from pydantic import BaseModel


class EnergyCreate(BaseModel):
    source: str

    voltage: float

    current: float

    power_kw: float

    energy_kwh: float

    temperature: float