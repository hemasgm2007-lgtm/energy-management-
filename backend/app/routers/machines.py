from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.machine import Machine
from app.schemas.machine import MachineCreate, MachineResponse


router = APIRouter(
    prefix="/machines",
    tags=["Machines"]
)


# GET ALL MACHINES
@router.get("/", response_model=list[MachineResponse])
def get_machines(db: Session = Depends(get_db)):

    machines = db.query(Machine).filter(
        Machine.is_active == True
    ).all()

    # Convert old "Active" records to "Running"
    for machine in machines:
        if machine.status == "Active":
            machine.status = "Running"

    db.commit()

    return machines


# GET ONE MACHINE
@router.get("/{machine_id}", response_model=MachineResponse)
def get_machine(
    machine_id: int,
    db: Session = Depends(get_db)
):

    machine = db.query(Machine).filter(
        Machine.id == machine_id,
        Machine.is_active == True
    ).first()

    if not machine:
        raise HTTPException(
            status_code=404,
            detail="Machine not found"
        )

    return machine


# CREATE MACHINE
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
        priority=machine.priority,
        is_active=True
    )

    db.add(new_machine)
    db.commit()
    db.refresh(new_machine)

    return new_machine


# UPDATE MACHINE
@router.put("/{machine_id}", response_model=MachineResponse)
def update_machine(
    machine_id: int,
    machine_data: MachineCreate,
    db: Session = Depends(get_db)
):

    machine = db.query(Machine).filter(
        Machine.id == machine_id,
        Machine.is_active == True
    ).first()

    if not machine:
        raise HTTPException(
            status_code=404,
            detail="Machine not found"
        )

    machine.name = machine_data.name
    machine.machine_type = machine_data.machine_type
    machine.power_kw = machine_data.power_kw
    machine.status = machine_data.status
    machine.priority = machine_data.priority

    db.commit()
    db.refresh(machine)

    return machine


# DELETE MACHINE
@router.delete("/{machine_id}")
def delete_machine(
    machine_id: int,
    db: Session = Depends(get_db)
):

    machine = db.query(Machine).filter(
        Machine.id == machine_id,
        Machine.is_active == True
    ).first()

    if not machine:
        raise HTTPException(
            status_code=404,
            detail="Machine not found"
        )

    machine.is_active = False

    db.commit()

    return {
        "message": "Machine deactivated successfully"
    }