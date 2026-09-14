from app.database import SessionLocal

from app.models.machine import Machine
from app.models.sensor import Sensor
from app.models.energy_reading import EnergyReading
from app.models.alert import Alert


db = SessionLocal()


machines = [

    Machine(
        name="Laboratory Equipment",
        machine_type="Laboratory",
        power_kw=18.2,
        status="Active",
        priority="Critical"
    ),

    Machine(
        name="Heating System",
        machine_type="Heating",
        power_kw=14.8,
        status="Active",
        priority="Critical"
    ),

    Machine(
        name="Water Heating",
        machine_type="Water Heater",
        power_kw=6.2,
        status="Active",
        priority="Non-Critical"
    ),

    Machine(
        name="Laundry",
        machine_type="Maintenance",
        power_kw=4.8,
        status="Idle",
        priority="Non-Critical"
    )

]


sensors = [

    Sensor(
        name="Main Electrical Sensor",
        sensor_type="Electrical",
        location="Main Power Room",
        value=82.4,
        unit="kW",
        status="Online"
    ),

    Sensor(
        name="Temperature Sensor",
        sensor_type="Temperature",
        location="Research Station",
        value=-18,
        unit="°C",
        status="Online"
    ),

    Sensor(
        name="Solar Sensor",
        sensor_type="Solar",
        location="Solar Array",
        value=38.2,
        unit="kW",
        status="Online"
    ),

    Sensor(
        name="Wind Sensor",
        sensor_type="Wind",
        location="Wind Turbine",
        value=21.4,
        unit="kW",
        status="Online"
    )

]


energy_readings = [

    EnergyReading(
        source="Solar",
        voltage=230,
        current=166,
        power_kw=38.2,
        energy_kwh=38.2,
        temperature=-18
    ),

    EnergyReading(
        source="Wind",
        voltage=230,
        current=93,
        power_kw=21.4,
        energy_kwh=21.4,
        temperature=-18
    ),

    EnergyReading(
        source="CHP",
        voltage=230,
        current=61,
        power_kw=14.2,
        energy_kwh=14.2,
        temperature=-18
    ),

    EnergyReading(
        source="Diesel",
        voltage=230,
        current=22,
        power_kw=5,
        energy_kwh=5,
        temperature=-18
    )

]


alerts = [

    Alert(
        severity="HIGH",
        title="Peak demand expected",
        message=
        "High electrical demand is predicted between 18:00 and 20:00."
    ),

    Alert(
        severity="MEDIUM",
        title="Low solar generation",
        message=
        "Solar generation is expected to decrease after 18:00."
    )

]


db.add_all(machines)

db.add_all(sensors)

db.add_all(energy_readings)

db.add_all(alerts)

db.commit()

db.close()


print("Database seeded successfully!")