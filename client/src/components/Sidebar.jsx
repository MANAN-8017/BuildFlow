import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/user", label: "Users", icon: "👤" },
    { path: "/product", label: "Products", icon: "📦" },
    { path: "/estimation", label: "Estimations", icon: "📐" },
    { path: "/cart", label: "Cart", icon: "🛒" },
    { path: "/order", label: "Orders", icon: "🚚" },
    { path: "/payment", label: "Payments", icon: "💳" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span>🏗️</span>
        <h2>BuildFlow</h2>
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;