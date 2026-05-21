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

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    ...(user
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
            title: "Demandes",
            path: "/requests",
            icon: <ChatIcon sx={{ fontSize: "1.5rem" }} />,
          },
        ]
      : []),
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
          <div className="offcanvas-header d-flex justify-content-center">
            <img src="/logo-desktop.png" alt="Logo" height={"150px"} />
          </div>
          <div className="offcanvas-body d-flex flex-column align-items-center justify-content-between">
            <ul className="navbar-nav text-center py-4 w-100 gap-3">
              {!logged ? (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      aria-current="page"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/")}
                    >
                      Tableau de bord
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/rooms")}
                    >
                      Salles
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      aria-current="page"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/")}
                    >
                      Tableau de bord
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/rooms")}
                    >
                      Salles
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/reservations")}
                    >
                      Mes réservations
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/account")}
                    >
                      Mon compte
                    </a>
                  </li>
                  {user?.role === "admin" && (
                    <>
                      <li className="nav-item">
                        <a
                          className="nav-link fs-4"
                          data-bs-dismiss="offcanvas"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/users")}
                        >
                          Gérer les utilisateurs
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link fs-4"
                          style={{ cursor: "pointer" }}
                          data-bs-dismiss="offcanvas"
                          onClick={() => navigate("/manage-rooms")}
                        >
                          Gérer les salles
                        </a>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
            <div className="d-flex justify-content-center">
              {logged ? (
                <button
                  type="submit"
                  className="bg-custom-login-btn rounded px-5 py-2 mt-3 fs-4 text-black"
                  onClick={handleLogout}
                  data-bs-dismiss="offcanvas"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-custom-login-btn rounded px-5 py-2 mt-3 fs-4 text-black"
                  onClick={handleLogin}
                  data-bs-dismiss="offcanvas"
                >
                  Connexion
                </button>
              )}
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
            <div className="d-flex align-items-center gap-3">
              <span className="text-white-50 small d-none d-sm-inline">
                Utilisateur :
              </span>
              <span className="text-white fw-bold d-none d-sm-inline me-2">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                type="button"
                className="btn btn-outline-logout rounded-pill px-4 py-2"
                onClick={handleLogout}
              >
                <LogoutIcon sx={{ fontSize: "1.2rem", marginRight: "6px" }} />
                Déconnexion
              </button>
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
