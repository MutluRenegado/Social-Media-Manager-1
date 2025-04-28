// app/components/MainLayout.tsx
import React, { ReactNode } from "react";

interface MainLayoutProps {
  left: ReactNode;
  top: ReactNode;
  middle: ReactNode;
  bottom: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ left, top, middle, bottom }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "200px", backgroundColor: "#f0f0f0", display: "flex", flexDirection: "column" }}>
        {left}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ height: "60px", backgroundColor: "#ddd", display: "flex", alignItems: "center", padding: "0 16px" }}>
          {top}
        </div>
        <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          {middle}
        </div>
        <div style={{ height: "50px", backgroundColor: "#ddd", display: "flex", alignItems: "center", padding: "0 16px" }}>
          {bottom}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
