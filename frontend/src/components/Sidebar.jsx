import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Activity,
  BrainCircuit,
  Zap,
  Factory,
  BatteryCharging,
  Bell,
  Lightbulb,
  FileText,
  Settings,
} from "lucide-react";

import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">

        <div className="logo-icon">
          <Zap size={25} />
        </div>

        <div className="logo-text">
          <h2>Smart Energy</h2>
          <span>Predictive Management</span>
        </div>

      </div>


      {/* MAIN */}
      <div className="sidebar-section">

        <p className="sidebar-heading">
          MAIN
        </p>

        <nav className="sidebar-nav">

          {/* DASHBOARD */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <LayoutDashboard size={21} />
            <span>Dashboard</span>
          </NavLink>


          {/* MONITORING */}
          <NavLink
            to="/monitoring"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Activity size={21} />
            <span>Live Monitoring</span>
          </NavLink>

        </nav>

      </div>


      {/* ENERGY MANAGEMENT */}
      <div className="sidebar-section">

        <p className="sidebar-heading">
          ENERGY MANAGEMENT
        </p>

        <nav className="sidebar-nav">

          {/* PREDICTIONS */}
          <NavLink
            to="/predictions"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <BrainCircuit size={21} />
            <span>Predictions</span>
          </NavLink>


          {/* OPTIMIZATION */}
          <NavLink
            to="/optimization"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Zap size={21} />
            <span>Optimization</span>
          </NavLink>


          {/* MACHINES */}
          <NavLink
            to="/machines"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Factory size={21} />
            <span>Machines / Loads</span>
          </NavLink>


          {/* ENERGY SOURCES */}
          <NavLink
            to="/energy-sources"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <BatteryCharging size={21} />
            <span>Energy Sources</span>
          </NavLink>

        </nav>

      </div>


      {/* INTELLIGENCE */}
      <div className="sidebar-section">

        <p className="sidebar-heading">
          INTELLIGENCE
        </p>

        <nav className="sidebar-nav">

          {/* ALERTS */}
          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Bell size={21} />
            <span>Alerts</span>
          </NavLink>


          {/* RECOMMENDATIONS */}
          <NavLink
            to="/recommendations"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Lightbulb size={21} />
            <span>Recommendations</span>
          </NavLink>


          {/* REPORTS */}
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FileText size={21} />
            <span>Reports</span>
          </NavLink>


          {/* SETTINGS */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Settings size={21} />
            <span>Settings</span>
          </NavLink>

        </nav>

      </div>


      {/* SYSTEM STATUS */}
      <div className="sidebar-bottom">

        <div className="system-status">

          <span className="status-dot"></span>

          <div>
            <strong>System Online</strong>
            <span>All services operational</span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;