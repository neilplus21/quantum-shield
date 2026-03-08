import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";

const NavHeader = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Live Demo" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-primary" />
        <span className="text-lg font-semibold text-foreground tracking-wide">
          QuantumSecure IoT
        </span>
      </div>
      <nav className="flex gap-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === link.to
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default NavHeader;
