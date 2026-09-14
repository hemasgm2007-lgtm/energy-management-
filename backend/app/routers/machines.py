from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.machine import Machine
from app.schemas.machine import (
    MachineCreate,
    MachineResponse
)

router = APIRouter(
    prefix="/machines",
    tags=["Machines"]
)


@router.get("/", response_model=list[MachineResponse])
def get_machines(
    db: Session = Depends(get_db)
):
    return db.query(Machine).all()


@router.post("/", response_model=MachineResponse)
def create_machine(
    machine: MachineCreate,
    db: Session = Depends(get_db)
):

    new_machine = Machine(
        name=machine.name,
        machine_type=machine.machine_type,
        power_kw=machine.power_kw,
        status=machine.status,
        priority=machine.priority
    )

    db.add(new_machine)

    db.commit()

    db.refresh(new_machine)

    return new_machine