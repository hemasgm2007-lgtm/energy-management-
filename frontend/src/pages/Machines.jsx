import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  Cpu,
  Edit3,
  Factory,
  Gauge,
  Plus,
  RefreshCw,
  Trash2,
  X,
  Zap,
  CheckCircle,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import "../styles/machines.css";


const API_URL = "http://10.74.4.75:8000";


function Machines() {

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingMachine, setEditingMachine] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    machine_type: "Production",
    power_kw: "",
    status: "Running",
    priority: "Non-Critical",
  });


  // ---------------------------------------------------------
  // FETCH MACHINES
  // ---------------------------------------------------------

  const fetchMachines = async () => {

    try {

      setError("");

      const response = await fetch(`${API_URL}/machines/`);

      if (!response.ok) {
        throw new Error("Unable to fetch machines");
      }

      const data = await response.json();

      setMachines(data);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to connect to the Machines API. Make sure FastAPI is running."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  useEffect(() => {

    fetchMachines();

  }, []);


  // ---------------------------------------------------------
  // SIMULATED CURRENT POWER
  // ---------------------------------------------------------

  const getCurrentPower = (machine) => {

    const ratedPower = Number(machine.power_kw) || 0;

    if (machine.status === "Idle") {
      return Number((ratedPower * 0.18).toFixed(1));
    }

    if (machine.status === "Stopped") {
      return 0;
    }

    if (machine.status === "Maintenance") {
      return Number((ratedPower * 0.08).toFixed(1));
    }

    // Simulated running load
    const variation = 0.65 + Math.random() * 0.30;

    return Number((ratedPower * variation).toFixed(1));
  };


  // ---------------------------------------------------------
  // SIMULATED POWER VALUES
  // ---------------------------------------------------------

  const simulatedMachines = useMemo(() => {

    return machines.map((machine) => ({
      ...machine,
      currentPower: getCurrentPower(machine),
    }));

  }, [machines]);


  // ---------------------------------------------------------
  // SUMMARY VALUES
  // ---------------------------------------------------------

  const totalMachines = machines.length;

  const runningMachines = machines.filter(
    (machine) => machine.status === "Running"
  ).length;

  const idleMachines = machines.filter(
    (machine) => machine.status === "Idle"
  ).length;

  const totalRatedPower = machines.reduce(
    (total, machine) => total + Number(machine.power_kw || 0),
    0
  );


  const totalCurrentPower = simulatedMachines.reduce(
    (total, machine) => total + Number(machine.currentPower || 0),
    0
  );


  // ---------------------------------------------------------
  // OPEN ADD MODAL
  // ---------------------------------------------------------

  const openAddModal = () => {

    setEditingMachine(null);

    setFormData({
      name: "",
      machine_type: "Production",
      power_kw: "",
      status: "Running",
      priority: "Non-Critical",
    });

    setShowModal(true);
  };


  // ---------------------------------------------------------
  // OPEN EDIT MODAL
  // ---------------------------------------------------------

  const openEditModal = (machine) => {

    setEditingMachine(machine);

    setFormData({
      name: machine.name || "",
      machine_type: machine.machine_type || "Production",
      power_kw: machine.power_kw || "",
      status: machine.status || "Running",
      priority: machine.priority || "Non-Critical",
    });

    setShowModal(true);
  };


  // ---------------------------------------------------------
  // CLOSE MODAL
  // ---------------------------------------------------------

  const closeModal = () => {

    setShowModal(false);
    setEditingMachine(null);

  };


  // ---------------------------------------------------------
  // FORM INPUT
  // ---------------------------------------------------------

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ---------------------------------------------------------
  // SAVE MACHINE
  // ---------------------------------------------------------

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a machine name.");
      return;
    }

    if (!formData.power_kw || Number(formData.power_kw) <= 0) {
      alert("Please enter a valid power value.");
      return;
    }


    const payload = {
      name: formData.name.trim(),
      machine_type: formData.machine_type,
      power_kw: Number(formData.power_kw),
      status: formData.status,
      priority: formData.priority,
    };


    try {

      const url = editingMachine
        ? `${API_URL}/machines/${editingMachine.id}`
        : `${API_URL}/machines/`;

      const method = editingMachine ? "PUT" : "POST";


      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {

        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Unable to save machine"
        );

      }


      closeModal();

      await fetchMachines();


    } catch (err) {

      console.error(err);

      alert(err.message || "Unable to save machine.");

    }

  };


  // ---------------------------------------------------------
  // DELETE MACHINE
  // ---------------------------------------------------------

  const handleDelete = async (machine) => {

    const confirmed = window.confirm(
      `Deactivate "${machine.name}"?`
    );

    if (!confirmed) {
      return;
    }


    try {

      const response = await fetch(
        `${API_URL}/machines/${machine.id}`,
        {
          method: "DELETE",
        }
      );


      if (!response.ok) {

        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || "Unable to deactivate machine"
        );

      }


      await fetchMachines();


    } catch (err) {

      console.error(err);

      alert(
        err.message ||
        "Unable to deactivate machine."
      );

    }

  };


  // ---------------------------------------------------------
  // REFRESH
  // ---------------------------------------------------------

  const handleRefresh = async () => {

    setRefreshing(true);

    await fetchMachines();

  };


  // ---------------------------------------------------------
  // STATUS CLASS
  // ---------------------------------------------------------

  const getStatusClass = (status) => {

    switch (status) {

      case "Running":
        return "status-running";

      case "Idle":
        return "status-idle";

      case "Maintenance":
        return "status-maintenance";

      case "Stopped":
        return "status-stopped";

      default:
        return "status-default";

    }

  };


  // ---------------------------------------------------------
  // PRIORITY CLASS
  // ---------------------------------------------------------

  const getPriorityClass = (priority) => {

    switch (priority) {

      case "Critical":
        return "priority-critical";

      case "High":
        return "priority-high";

      case "Medium":
        return "priority-medium";

      default:
        return "priority-normal";

    }

  };


  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {

    return (
      <div className="machines-page">

        <div className="machines-loading">

          <RefreshCw
            size={28}
            className="loading-spin"
          />

          <p>Loading virtual machines...</p>

        </div>

      </div>
    );

  }


  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (

    <div className="machines-page">


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="machines-header">

        <div>

          <div className="machines-title-row">

            <div className="machines-title-icon">
              <Factory size={24} />
            </div>

            <div>

              <h1>Machines</h1>

              <p>
                Virtual machine monitoring and simulated energy usage
              </p>

            </div>

          </div>

        </div>


        <div className="machines-header-actions">

          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >

            <RefreshCw
              size={17}
              className={refreshing ? "loading-spin" : ""}
            />

            Refresh

          </button>


          <button
            className="add-machine-button"
            onClick={openAddModal}
          >

            <Plus size={18} />

            Add Virtual Machine

          </button>

        </div>

      </div>


      {/* =====================================================
          SIMULATION NOTICE
      ====================================================== */}

      <div className="simulation-banner">

        <div className="simulation-icon">
          <Activity size={20} />
        </div>

        <div>

          <strong>Simulation Mode</strong>

          <p>
            No physical machines are connected. Current machine
            power values are simulated from each machine's rated power.
          </p>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="machines-error">

          <AlertTriangle size={19} />

          <span>{error}</span>

        </div>

      )}


      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="machine-summary-grid">


        <div className="summary-box">

          <div className="summary-icon blue">
            <Factory size={20} />
          </div>

          <div>

            <span>Total Machines</span>

            <strong>{totalMachines}</strong>

          </div>

        </div>


        <div className="summary-box">

          <div className="summary-icon green">
            <CheckCircle size={20} />
          </div>

          <div>

            <span>Running</span>

            <strong>{runningMachines}</strong>

          </div>

        </div>


        <div className="summary-box">

          <div className="summary-icon orange">
            <Clock3 size={20} />
          </div>

          <div>

            <span>Idle</span>

            <strong>{idleMachines}</strong>

          </div>

        </div>


        <div className="summary-box">

          <div className="summary-icon purple">
            <Gauge size={20} />
          </div>

          <div>

            <span>Rated Capacity</span>

            <strong>
              {totalRatedPower.toFixed(1)} kW
            </strong>

          </div>

        </div>


        <div className="summary-box">

          <div className="summary-icon cyan">
            <Zap size={20} />
          </div>

          <div>

            <span>Simulated Demand</span>

            <strong>
              {totalCurrentPower.toFixed(1)} kW
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          MACHINE TABLE
      ====================================================== */}

      <div className="machines-card">

        <div className="machines-card-header">

          <div>

            <h2>Virtual Machines</h2>

            <p>
              Simulated equipment available for energy analysis
            </p>

          </div>

          <div className="virtual-badge">

            <Cpu size={15} />

            Virtual

          </div>

        </div>


        {simulatedMachines.length === 0 ? (

          <div className="empty-machines">

            <Factory size={45} />

            <h3>No virtual machines</h3>

            <p>
              Add a virtual machine to start simulating energy usage.
            </p>

            <button
              className="add-machine-button"
              onClick={openAddModal}
            >

              <Plus size={17} />

              Add Virtual Machine

            </button>

          </div>

        ) : (

          <div className="machine-table-wrapper">

            <table className="machine-table">

              <thead>

                <tr>

                  <th>Machine</th>

                  <th>Type</th>

                  <th>Rated Power</th>

                  <th>Current Demand</th>

                  <th>Status</th>

                  <th>Priority</th>

                  <th>Mode</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {simulatedMachines.map((machine) => (

                  <tr key={machine.id}>


                    {/* MACHINE */}

                    <td>

                      <div className="machine-name-cell">

                        <div className="machine-avatar">
                          <Factory size={18} />
                        </div>

                        <div>

                          <strong>
                            {machine.name}
                          </strong>

                          <span>
                            M-{String(machine.id).padStart(3, "0")}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* TYPE */}

                    <td>

                      <span className="machine-type">
                        {machine.machine_type}
                      </span>

                    </td>


                    {/* RATED POWER */}

                    <td>

                      <div className="power-value">

                        <Zap size={15} />

                        {Number(machine.power_kw).toFixed(1)} kW

                      </div>

                    </td>


                    {/* CURRENT POWER */}

                    <td>

                      <div className="current-power">

                        <Activity size={15} />

                        <strong>
                          {machine.currentPower.toFixed(1)} kW
                        </strong>

                      </div>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${getStatusClass(
                          machine.status
                        )}`}
                      >

                        <span className="status-dot"></span>

                        {machine.status}

                      </span>

                    </td>


                    {/* PRIORITY */}

                    <td>

                      <span
                        className={`priority-badge ${getPriorityClass(
                          machine.priority
                        )}`}
                      >

                        {machine.priority}

                      </span>

                    </td>


                    {/* MODE */}

                    <td>

                      <span className="virtual-mode">

                        <Cpu size={14} />

                        Simulated

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="machine-actions">

                        <button
                          className="action-button edit"
                          onClick={() =>
                            openEditModal(machine)
                          }
                          title="Edit machine"
                        >

                          <Edit3 size={16} />

                        </button>


                        <button
                          className="action-button delete"
                          onClick={() =>
                            handleDelete(machine)
                          }
                          title="Deactivate machine"
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                    </td>


                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          MODAL
      ====================================================== */}

      {showModal && (

        <div
          className="machine-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="machine-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  {editingMachine
                    ? "Edit Virtual Machine"
                    : "Add Virtual Machine"}
                </h2>

                <p>
                  Configure simulated machine parameters
                </p>

              </div>


              <button
                className="modal-close"
                onClick={closeModal}
              >

                <X size={20} />

              </button>

            </div>


            <form onSubmit={handleSubmit}>


              {/* MACHINE NAME */}

              <div className="form-group">

                <label>
                  Machine Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: CNC Machine"
                  required
                />

              </div>


              {/* MACHINE TYPE */}

              <div className="form-group">

                <label>
                  Machine Type
                </label>

                <select
                  name="machine_type"
                  value={formData.machine_type}
                  onChange={handleChange}
                >

                  <option value="Production">
                    Production
                  </option>

                  <option value="Utility">
                    Utility
                  </option>

                  <option value="Heating">
                    Heating
                  </option>

                  <option value="Cooling">
                    Cooling
                  </option>

                  <option value="Research">
                    Research
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* POWER */}

              <div className="form-group">

                <label>
                  Rated Power (kW)
                </label>

                <input
                  type="number"
                  name="power_kw"
                  value={formData.power_kw}
                  onChange={handleChange}
                  placeholder="Example: 15.5"
                  min="0.1"
                  step="0.1"
                  required
                />

                <small>
                  Used as the base value for simulated energy demand.
                </small>

              </div>


              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Running">
                    Running
                  </option>

                  <option value="Idle">
                    Idle
                  </option>

                  <option value="Stopped">
                    Stopped
                  </option>

                  <option value="Maintenance">
                    Maintenance
                  </option>

                </select>

              </div>


              {/* PRIORITY */}

              <div className="form-group">

                <label>
                  Energy Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >

                  <option value="Non-Critical">
                    Non-Critical
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="save-machine-button"
                >

                  {editingMachine
                    ? "Update Machine"
                    : "Create Machine"}

                </button>

              </div>


            </form>

          </div>

        </div>

      )}

    </div>

  );

}

export default Machines;