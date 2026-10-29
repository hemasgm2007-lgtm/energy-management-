import { Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/Topbar.css";

function Topbar() {
  const navigate = useNavigate();

  // Get the currently logged-in user
  let user = {
    name: "User",
    email: "",
  };

  try {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      user = {
        name: parsedUser.name || "User",
        email: parsedUser.email || "",
      };
    }
  } catch (error) {
    console.error("Unable to read logged-in user:", error);
  }

  // Get first letter for avatar
  const avatarLetter = user.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <header className="topbar">

      {/* LEFT SIDE */}
      <div className="topbar-left">
        <div>
          <h2>Energy Management</h2>

          <span>
            Smart monitoring & predictive insights
          </span>
        </div>
      </div>


      {/* RIGHT SIDE */}
      <div className="topbar-right">

        {/* NOTIFICATION */}
        <button
          className="notification-btn"
          onClick={() => navigate("/alerts")}
          title="Notifications"
        >
          <Bell size={20} />

          <span className="notification-dot"></span>
        </button>


        {/* LOGGED-IN USER */}
        <button
          className="profile-btn"
          onClick={() => navigate("/settings")}
        >

          {/* AVATAR */}
          <div className="profile-avatar">
            {avatarLetter}
          </div>


          {/* USER DETAILS */}
          <div className="profile-info">

            <strong>
              {user.name}
            </strong>

            <span>
              Energy Manager
            </span>

          </div>


          <ChevronDown size={17} />

        </button>

      </div>

    </header>
  );
}

export default Topbar;