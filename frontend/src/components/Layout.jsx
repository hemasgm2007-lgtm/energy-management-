import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/layout.css";

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>AI Energy Management</h2>
            <p>Indian Polar Research Station</p>
          </div>

          <div className="topbar-status">
            <span className="status-dot"></span>
            System Online
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default Layout;