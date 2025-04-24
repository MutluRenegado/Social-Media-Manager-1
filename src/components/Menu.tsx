import React from "react";
import Link from "next/link";

const Menu: React.FC = () => {
  return (
    <nav style={{ padding: "0.5rem 1rem", backgroundColor: "#61dafb" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "1rem", margin: 0, padding: 0 }}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/pricing">Pricing</Link>
        </li>
        <li>
          <Link href="/members">Members</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
