import { Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/Topbar.css";

function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">

      <div className="topbar-left">
        <div>
          <h2>Energy Management</h2>
          <span>Smart monitoring & predictive insights</span>
        </div>
      </div>

      <div className="topbar-right">

        {/* Notification */}
        <button
          className="notification-btn"
          onClick={() => navigate("/alerts")}
          title="Notifications"
        >
          <Bell size={21} />
          <span className="notification-dot"></span>
        </button>

        {/* Profile */}
        <button
          className="profile-btn"
          onClick={() => navigate("/settings")}
        >
          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">
            <strong>Admin</strong>
            <span>Energy Manager</span>
          </div>

          <ChevronDown size={17} />
        </button>

      </div>

    </header>
  );
}

export default Topbar;