import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboard = () =>
  api.get("/dashboard/");

export const getMachines = () =>
  api.get("/machines/");

export const getSensors = () =>
  api.get("/sensors/");

export const getEnergy = () =>
  api.get("/energy/");

export const getPredictions = () =>
  api.get("/predictions/");

export const getOptimization = () =>
  api.get("/optimization/");

export const getAlerts = () =>
  api.get("/alerts/");

export const getRecommendations = () =>
  api.get("/recommendations/");

export default api;