// app/page.tsx
import React from "react";
import MainLayout from "./components/MainLayout";

const HomePage = () => {
  return (
    <MainLayout
      left={
        <nav style={{ padding: "16px" }}>
          <h2>Menu</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      }
      top={
        <header style={{ fontWeight: "bold", fontSize: "20px" }}>
          My Website Header
        </header>
      }
      middle={
        <main>
          <h1>Welcome to the Homepage</h1>
          <p>This is the main content area where your content goes.</p>
          <p>Feel free to customize this section with your own components.</p>
        </main>
      }
      bottom={
        <footer style={{ fontSize: "14px", color: "#555" }}>
          © 2025 My Website. All rights reserved.
        </footer>
      }
    />
  );
};

export default HomePage;
