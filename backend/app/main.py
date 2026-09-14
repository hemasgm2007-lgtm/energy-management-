from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.routers import (
    dashboard,
    machines,
    sensors,
    energy,
    predictions,
    optimization,
    alerts,
    recommendations,
    live_data
)

from app.models import (
    Machine,
    Sensor,
    EnergyReading,
    Alert
)


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI Predictive Smart Energy Management API",
    description="AI-Based Predictive Energy Management System",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============================================================
# API ROUTERS
# ============================================================

# Dashboard
app.include_router(
    dashboard.router
)


# Machines / Loads
app.include_router(
    machines.router
)


# Sensors
app.include_router(
    sensors.router
)


# Energy Readings
app.include_router(
    energy.router
)


# AI Predictions
app.include_router(
    predictions.router
)


# Energy Optimization
app.include_router(
    optimization.router
)


# Alerts
app.include_router(
    alerts.router
)


# Recommendations
app.include_router(
    recommendations.router
)


# Live Monitoring
app.include_router(
    live_data.router
)


# ============================================================
# ROOT API
# ============================================================

@app.get("/")
def root():

    return {
        "message": "Smart Energy Management API is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }