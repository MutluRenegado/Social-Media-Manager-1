"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarDeleted, setSidebarDeleted] = useState(false);

  React.useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div>
      {!sidebarDeleted && sidebarVisible && (
        <nav className={`sidebar${sidebarVisible ? "" : " hidden"}`} id="sidebar">
          <div>
            <h2>ADMIN</h2>
            <ul>
              <li>
                <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className={pathname === "/admin/users" ? "active" : ""}>
                  <span>Users</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className={pathname === "/admin/settings" ? "active" : ""}>
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/reports" className={pathname === "/admin/reports" ? "active" : ""}>
                  <span>Reports</span>
                </Link>
              </li>
            </ul>
          </div>
          <button id="logout-btn" className="logout-btn">
            <span>Logout</span>
          </button>
        </nav>
      )}
      <div className={`main${sidebarVisible && !sidebarDeleted ? "" : " expanded"}`} id="main-content">
        <div className="header">
          <div
            className={`hamburger${!sidebarVisible ? " active" : ""}`}
            id="hamburger"
            title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
            tabIndex={0}
            onClick={() => setSidebarVisible((v) => !v)}
            onDoubleClick={() => setSidebarDeleted(true)}
            style={{ marginRight: 16 }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <h1 id="page-title">Dashboard</h1>
          <button
            className="mode-toggle"
            title="Toggle Dark/Light Mode"
            onClick={() => setDarkMode((d) => !d)}
          >
            {darkMode ? "🌙" : "🌞"}
          </button>
        </div>
        <section id="app-content">{children}</section>
      </div>
    </div>
  );
}
