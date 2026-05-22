import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import type { User } from "../types/user";
import { authService } from "../services/auth.service";

import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChatIcon from "@mui/icons-material/Chat";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [dropdownOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.innerWidth < 768;
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", JSON.stringify(next));
      return next;
    });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    authService.logout();
    setLogged(false);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setLogged(true);
      authService.getUser().then((user) => {
        setUser(user);
      });
    }
  }, []);

  useEffect(() => {
    document.body.classList.add("has-sidebar");
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    return () => {
      document.body.classList.remove("has-sidebar");
      document.body.classList.remove("sidebar-collapsed");
    };
  }, [collapsed]);

  const menuItems = [
    {
      title: "Accueil",
      path: "/",
      icon: <HomeIcon sx={{ fontSize: "1.5rem" }} />,
    },
    ...(logged
      ? [
          {
            title: "Réserver",
            path: "/rooms",
            icon: <CalendarMonthIcon sx={{ fontSize: "1.5rem" }} />,
          },
          {
            title: "Mes réservations",
            path: "/reservations",
            icon: <ApartmentIcon sx={{ fontSize: "1.5rem" }} />,
          },
        ]
      : []),
    ...(user?.role === "admin"
      ? [
          {
            title: "Gestion des utilisateurs",
            path: "/users",
            icon: <SupervisorAccountIcon sx={{ fontSize: "1.5rem" }} />,
          },
          {
            title: "My Admin",
            path: "/admin",
            icon: <AdminPanelSettingsIcon sx={{ fontSize: "1.5rem" }} />,
          },
          {
            title: "Analyses",
            path: "/analytics",
            icon: <BarChartIcon sx={{ fontSize: "1.5rem" }} />,
          },
        ]
      : []),
    {
      title: "Mes demandes",
      path: "/requests",
      icon: <ChatIcon sx={{ fontSize: "1.5rem" }} />,
    },
  ];
  const handleNavigation = (item: (typeof menuItems)[0]) => {
    setMobileOpen(false);
    navigate(item.path);
  };

  const logoSrc = isMobile
    ? "/logo-desktop.webp"
    : collapsed
      ? "/logo-mobile.webp"
      : "/logo-desktop.webp";

  return (
    <>
      <div
        className={`menu-sidebar ${mobileOpen ? "mobile-open" : ""}`}
        style={{
          width: isMobile ? "280px" : collapsed ? "78px" : "280px",
          overflow: "visible",
        }}
      >
        {!isMobile && (
          <button
            className="sidebar-floating-toggle-btn"
            onClick={toggleCollapsed}
            title={collapsed ? "Déplier le menu" : "Replier le menu"}
          >
            {collapsed ? (
              <ChevronRightIcon sx={{ fontSize: "1.2rem" }} />
            ) : (
              <ChevronLeftIcon sx={{ fontSize: "1.2rem" }} />
            )}
          </button>
        )}

        <div
          className="d-flex flex-column h-100 w-100"
          style={{ overflowY: "auto", overflowX: "hidden" }}
        >
          <div
            className="d-flex align-items-center justify-content-center p-3 border-bottom border-white-10"
            style={{
              minHeight: collapsed ? "78px" : "150px",
              transition: "min-height 0.3s ease",
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center w-100"
              onClick={() => {
                setMobileOpen(false);
                navigate("/");
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={logoSrc}
                alt="SmartRoom"
                className="sidebar-logo"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="p-3 d-flex flex-column gap-2">
            <div className="d-flex flex-column gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <div
                    key={item.title}
                    onClick={() => handleNavigation(item)}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    title={collapsed ? item.title : ""}
                  >
                    <span className="sidebar-link-icon">{item.icon}</span>
                    <span
                      className={`sidebar-link-text ${
                        collapsed && !isMobile ? "sidebar-collapsed-text" : ""
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-grow-1"></div>
        </div>
      </div>

      <header className="top-header bg-slate border-bottom border-white-10 px-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center" style={{ minWidth: "60px" }}>
          {isMobile && (
            <button
              className="btn btn-link text-white rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
              onClick={() => setMobileOpen((prev) => !prev)}
              title="Menu"
            >
              {mobileOpen ? (
                <CloseIcon sx={{ fontSize: "1.8rem" }} />
              ) : (
                <MenuIcon sx={{ fontSize: "1.8rem" }} />
              )}
            </button>
          )}
        </div>

        <div className="d-flex justify-content-center align-items-center flex-grow-1">
          <div className="header-clock" title="Heure actuelle">
            {timeStr}
          </div>
        </div>

        <div
          className="d-flex align-items-center justify-content-end gap-3"
          style={{ minWidth: "60px" }}
        >
          {!logged ? (
            <button
              type="button"
              className="btn btn-emerald rounded-pill px-4 py-2"
              onClick={handleLogin}
            >
              <LoginIcon sx={{ fontSize: "1.2rem", marginRight: "6px" }} />
              Connexion
            </button>
          ) : (
            <div className="position-relative">
              <div
                className="d-flex align-items-center gap-2 cursor-pointer px-2 py-1.5 rounded-pill hover-user-badge"
                onClick={toggleDropdown}
                title="Mon compte"
                style={{ transition: "all 0.2s ease", userSelect: "none" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center text-white fw-bold rounded-circle shadow-sm"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#10b981",
                    fontSize: "1rem",
                    border: "2px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {user?.firstName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-white fw-semibold d-none d-sm-inline me-1">
                  {user?.firstName} {user?.lastName}
                </span>
                <ExpandMoreIcon
                  sx={{
                    fontSize: "1.2rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    transition: "transform 0.2s ease",
                    transform: dropdownOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </div>

              {dropdownOpen && (
                <div
                  className="position-absolute end-0 mt-2 bg-slate border rounded-3 shadow-lg p-1.5 animate-fade-in"
                  style={{
                    width: "180px",
                    backgroundColor: "#0f172a",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                    zIndex: 2000,
                  }}
                >
                  <div
                    onClick={() => {
                      if (user?.role === "admin") {
                        navigate("/adminSettings");
                      } else {
                        navigate("/userSettings");
                      }
                    }}
                    className="d-flex align-items-center gap-2 text-white-50 p-2 rounded-2 cursor-pointer hover-emerald-bg"
                    style={{ transition: "all 0.2s ease", cursor: "pointer" }}
                  >
                    <SettingsIcon sx={{ fontSize: "1.1rem" }} />
                    <span className="fw-medium" style={{ fontSize: "0.9rem" }}>
                      Paramètres
                    </span>
                  </div>
                  <div
                    onClick={handleLogout}
                    className="d-flex align-items-center gap-2 text-white-50 p-2 rounded-2 cursor-pointer hover-danger-bg mt-1"
                    style={{
                      transition: "all 0.2s ease",
                      color: "#f87171",
                      cursor: "pointer",
                    }}
                  >
                    <LogoutIcon sx={{ fontSize: "1.1rem" }} />
                    <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                      Déconnexion
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {isMobile && mobileOpen && (
        <div
          className="menu-mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <style>{`
        .hover-user-badge:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .hover-emerald-bg:hover {
          background-color: rgba(16, 185, 129, 0.1) !important;
          color: #4ade80 !important;
        }
        .hover-danger-bg:hover {
          background-color: rgba(239, 68, 68, 0.1) !important;
          color: #f87171 !important;
        }
        .animate-toast {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
