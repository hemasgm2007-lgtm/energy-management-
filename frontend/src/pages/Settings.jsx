import { useState } from "react";

import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  SlidersHorizontal,
  Database,
  Info,
  Mail,
  Smartphone,
  FileText,
  Globe,
  Clock,
  HardDrive,
  Save,
  Lock,
}
from "lucide-react";

import "../styles/Settings.css";

function Settings() {

  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@smartenergy.com",
    phone: "+91 98765 43210",
    designation: "System Administrator",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    reports: true,
  });


  const updateProfile = (e) => {

    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value,
    });

  };


  const toggleNotification = (name) => {

    setNotifications({
      ...notifications,
      [name]: !notifications[name],
    });

  };
  


  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "security",
      label: "Account Security",
      icon: Shield,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "system",
      label: "System Preferences",
      icon: SlidersHorizontal,
    },
    {
      id: "storage",
      label: "Data & Storage",
      icon: Database,
    },
    {
      id: "about",
      label: "About",
      icon: Info,
    },
  ];


  return (
    <div className="settings-page">


      {/* =================================================
          HEADER
          ================================================= */}

      <div className="settings-header">

        <div className="settings-heading">

          <div className="settings-heading-icon">
            <SettingsIcon size={25} />
          </div>

          <div>

            <h1>Settings</h1>

            <p>
              Manage your account, system preferences
              and notification settings
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          SETTINGS LAYOUT
          ================================================= */}

      <div className="settings-layout">


        {/* =================================================
            LEFT NAVIGATION
            ================================================= */}

        <div className="settings-sidebar">

          {tabs.map((tab) => {

            const Icon = tab.icon;

            return (

              <button
                key={tab.id}
                className={
                  activeTab === tab.id
                    ? "settings-tab active"
                    : "settings-tab"
                }
                onClick={() =>
                  setActiveTab(tab.id)
                }
              >

                <Icon size={17} />

                <span>
                  {tab.label}
                </span>

              </button>

            );

          })}

        </div>


        {/* =================================================
            CONTENT
            ================================================= */}

        <div className="settings-content">


          {/* =================================================
              PROFILE
              ================================================= */}

          {activeTab === "profile" && (

            <>

              <div className="settings-card">

                <div className="settings-card-header">

                  <div>

                    <h2>Profile Settings</h2>

                    <p>
                      Update your personal information
                    </p>

                  </div>

                </div>


                <div className="profile-section">

                  <div className="profile-avatar">

                    <span>
                      {profile.name
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <div className="avatar-lock">
                      <Lock size={10} />
                    </div>

                  </div>


                  <div className="profile-fields">

                    <div className="settings-field">

                      <label>Full Name</label>

                      <input
                        name="name"
                        value={profile.name}
                        onChange={updateProfile}
                      />

                    </div>


                    <div className="settings-field">

                      <label>Email Address</label>

                      <input
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={updateProfile}
                      />

                    </div>


                    <div className="settings-field">

                      <label>Phone Number</label>

                      <input
                        name="phone"
                        value={profile.phone}
                        onChange={updateProfile}
                      />

                    </div>


                    <div className="settings-field">

                      <label>Designation</label>

                      <input
                        name="designation"
                        value={profile.designation}
                        onChange={updateProfile}
                      />

                    </div>

                  </div>

                </div>


                <div className="settings-card-footer">

                  <button className="save-button">

                    <Save size={15} />

                    Save Changes

                  </button>

                </div>

              </div>


              <NotificationCard
                notifications={notifications}
                toggleNotification={toggleNotification}
              />


              <SystemPreferences />

            </>

          )}


          {/* =================================================
              NOTIFICATIONS
              ================================================= */}

          {activeTab === "notifications" && (

            <NotificationCard
              notifications={notifications}
              toggleNotification={toggleNotification}
            />

          )}


          {/* =================================================
              SYSTEM
              ================================================= */}

          {activeTab === "system" && (
            <SystemPreferences />
          )}


          {/* =================================================
              SECURITY
              ================================================= */}

          {activeTab === "security" && (

            <div className="settings-card">

              <div className="settings-card-header">

                <div>

                  <h2>Account Security</h2>

                  <p>
                    Manage password and account security
                  </p>

                </div>

              </div>


              <div className="security-row">

                <div className="security-icon">
                  <Lock size={20} />
                </div>

                <div>

                  <h3>Password</h3>

                  <p>
                    Last changed 30 days ago
                  </p>

                </div>

                <button className="outline-button">
                  Change Password
                </button>

              </div>


              <div className="security-row">

                <div className="security-icon">
                  <Shield size={20} />
                </div>

                <div>

                  <h3>Two-Factor Authentication</h3>

                  <p>
                    Add an additional layer of security
                  </p>

                </div>

                <div className="toggle off">
                  <div></div>
                </div>

              </div>

            </div>

          )}


          {/* =================================================
              STORAGE
              ================================================= */}

          {activeTab === "storage" && (

            <div className="settings-card">

              <div className="settings-card-header">

                <div>

                  <h2>Data & Storage</h2>

                  <p>
                    Manage your energy monitoring data
                  </p>

                </div>

              </div>


              <div className="storage-status">

                <div className="storage-icon">
                  <Database size={22} />
                </div>

                <div>

                  <h3>Database Status</h3>

                  <p>
                    Smart Energy database is connected
                    and operational.
                  </p>

                </div>

                <span className="connected-badge">
                  ● Connected
                </span>

              </div>


              <div className="storage-grid">

                <div>

                  <HardDrive size={18} />

                  <span>Energy Readings</span>

                  <strong>1,248</strong>

                </div>

                <div>

                  <Database size={18} />

                  <span>Database Size</span>

                  <strong>24.6 MB</strong>

                </div>

                <div>

                  <Clock size={18} />

                  <span>Retention Period</span>

                  <strong>12 Months</strong>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              ABOUT
              ================================================= */}

          {activeTab === "about" && (

            <div className="settings-card about-card">

              <div className="about-logo">
                ⚡
              </div>

              <h2>
                Smart Energy Monitoring System
              </h2>

              <p>
                Intelligent energy monitoring and
                optimization platform for MSMEs.
              </p>

              <div className="version">
                Version 1.0.0
              </div>

              <div className="about-info">

                <span>Platform</span>
                <strong>Web Application</strong>

                <span>Frontend</span>
                <strong>React + Vite</strong>

                <span>Backend</span>
                <strong>FastAPI</strong>

                <span>Monitoring</span>
                <strong>Real-time Energy Analytics</strong>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   NOTIFICATION CARD
   ========================================================= */

function NotificationCard({
  notifications,
  toggleNotification,
}) {

  const items = [
    {
      key: "email",
      icon: Mail,
      title: "Email Notifications",
      description:
        "Receive alerts and reports via email",
    },
    {
      key: "push",
      icon: Bell,
      title: "Push Notifications",
      description:
        "Get real-time alerts in your browser",
    },
    {
      key: "sms",
      icon: Smartphone,
      title: "SMS Notifications",
      description:
        "Receive critical alerts via SMS",
    },
    {
      key: "reports",
      icon: FileText,
      title: "Report Notifications",
      description:
        "Get notified when reports are ready",
    },
  ];


  return (

    <div className="settings-card">

      <div className="settings-card-header">

        <div>

          <h2>Notification Preferences</h2>

          <p>
            Choose how you want to receive
            alerts and notifications
          </p>

        </div>

      </div>


      <div className="notification-list">

        {items.map((item) => {

          const Icon = item.icon;

          return (

            <div
              className="notification-row"
              key={item.key}
            >

              <div className="notification-icon">
                <Icon size={17} />
              </div>

              <div className="notification-text">

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

              </div>


              <button
                className={
                  notifications[item.key]
                    ? "toggle on"
                    : "toggle off"
                }
                onClick={() =>
                  toggleNotification(item.key)
                }
              >

                <div></div>

              </button>

            </div>

          );

        })}

      </div>

    </div>

  );
}


/* =========================================================
   SYSTEM PREFERENCES
   ========================================================= */

function SystemPreferences() {

  return (

    <div className="settings-card">

      <div className="settings-card-header">

        <div>

          <h2>System Preferences</h2>

          <p>
            Configure your system settings
          </p>

        </div>

      </div>


      <div className="preferences-grid">

        <div className="settings-field">

          <label>
            <Globe size={13} />
            Language
          </label>

          <select>
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>

        </div>


        <div className="settings-field">

          <label>
            <Clock size={13} />
            Time Zone
          </label>

          <select>
            <option>
              (GMT+5:30) India Standard Time
            </option>

            <option>
              (GMT+0:00) UTC
            </option>

          </select>

        </div>


        <div className="settings-field">

          <label>
            Currency
          </label>
          <select>
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
          </select>
        </div>
        <div className="settings-field">
          <label>
            Energy Unit
          </label>
          <select>
            <option>kWh</option>
            <option>MWh</option>
          </select>
        </div>
      </div>
    </div>
  );
}
export default Settings;