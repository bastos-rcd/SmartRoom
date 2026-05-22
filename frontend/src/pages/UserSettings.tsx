import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import type { Event } from "../types/event";
import type { Room } from "../types/room";
import type { Building } from "../types/building";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { eventService } from "../services/event.service";
import { roomService } from "../services/room.service";
import { buildingService } from "../services/building.service";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function UserSettings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"info" | "reservations">("info");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formSaving, setFormSaving] = useState<boolean>(false);

  const [reservations, setReservations] = useState<Event[]>([]);
  const [rooms, setRooms] = useState<Record<number, Room>>({});
  const [buildings, setBuildings] = useState<Record<number, Building>>({});
  const [expandedReservation, setExpandedReservation] = useState<number | null>(
    null,
  );

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");
  const [timeStr, setTimeStr] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(""), 4000);
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

  useEffect(() => {
    const initData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate("/login");
          return;
        }

        const currentUser = await authService.getUser();

        setUser(currentUser);
        setFirstName(currentUser.firstName);
        setLastName(currentUser.lastName);
        setEmail(currentUser.email);

        const [roomsList, buildingsList, allEvents] = await Promise.all([
          roomService.getRooms(),
          buildingService.getBuildings(),
          eventService.getEvents(),
        ]);

        const roomsMap = (roomsList || []).reduce(
          (acc, room) => {
            acc[room.id] = room;
            return acc;
          },
          {} as Record<number, Room>,
        );

        const buildingsMap = (buildingsList || []).reduce(
          (acc, b) => {
            acc[b.id] = b;
            return acc;
          },
          {} as Record<number, Building>,
        );

        setRooms(roomsMap);
        setBuildings(buildingsMap);

        const userEvents = (allEvents || []).filter(
          (evt) => evt.userId === currentUser.id,
        );
        userEvents.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );

        setReservations(userEvents);
      } catch (err) {
        console.error(err);
        showError("Impossible de charger vos données.");
        if (!authService.isAuthenticated()) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      showError("Le prénom, le nom et l'adresse email sont requis.");
      return;
    }

    setFormSaving(true);
    try {
      const updateData: Partial<User> = {
        firstName,
        lastName,
        email,
      };

      if (password.trim() !== "") {
        updateData.password = password;
      }

      const updatedUser = await userService.updateUser(user.id, updateData);
      setUser(updatedUser);
      setPassword("");
      showSuccess("Informations mises à jour avec succès !");
    } catch (err) {
      console.error(err);
      showError("Erreur lors de la mise à jour des informations.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")
    ) {
      return;
    }

    try {
      await eventService.deleteEvent(reservationId);
      setReservations((prev) => prev.filter((res) => res.id !== reservationId));
      showSuccess("Réservation annulée avec succès.");
      if (expandedReservation === reservationId) {
        setExpandedReservation(null);
      }
    } catch (err) {
      console.error(err);
      showError("Erreur lors de l'annulation de la réservation.");
    }
  };

  const toggleReservation = (id: number) => {
    setExpandedReservation((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateStr: any) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div
          className="spinner-border text-emerald"
          role="status"
          style={{ width: "3rem", height: "3rem", color: "#10b981" }}
        >
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex min-vh-100 position-relative"
      style={{ backgroundColor: "#f8fafc" }}
    >
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
      </header>

      <aside
        className={`menu-sidebar ${mobileOpen ? "mobile-open" : ""}`}
        style={{
          width: "280px",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "#0e172a",
          zIndex: 1050,
          display: "flex",
          flexDirection: "column",
          boxShadow: "6px 0 28px rgba(0, 0, 0, 0.25)",
          borderRight: "3px solid rgba(255, 255, 255, 0.08)",
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isMobile && !mobileOpen ? "translateX(-280px)" : "none",
        }}
      >
        <div
          className="d-flex flex-column align-items-center justify-content-center p-3 border-bottom border-white-10 position-relative"
          style={{ minHeight: "100px" }}
        >
          {isMobile && (
            <button
              className="btn btn-link text-white-50 position-absolute"
              style={{ top: "12px", right: "12px" }}
              onClick={() => setMobileOpen(false)}
            >
              <CloseIcon />
            </button>
          )}

          <div
            className="d-flex align-items-center gap-2 text-white-50 cursor-pointer fs-6 hover-emerald"
            onClick={() => navigate("/")}
            style={{ transition: "color 0.2s ease" }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.1rem" }} />
            <span>Retour à l'accueil</span>
          </div>

          {/* <div className="text-center">
            <small className="text-emerald text-uppercase fw-semibold" style={{ color: "#4ade80", fontSize: "0.75rem", letterSpacing: "1px" }}>
              {user?.role === "admin" ? "Administrateur" : "Utilisateur"}
            </small>
          </div> */}
        </div>

        <div className="p-3 d-flex flex-column gap-2 flex-grow-1">
          <div className="d-flex flex-column gap-1">
            <div
              onClick={() => {
                setActiveTab("info");
                setMobileOpen(false);
              }}
              className={`sidebar-link ${activeTab === "info" ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <span
                className="sidebar-link-icon"
                style={{ color: activeTab === "info" ? "#4ade80" : "inherit" }}
              >
                <PersonIcon sx={{ fontSize: "1.5rem" }} />
              </span>
              <span className="sidebar-link-text">Mes informations</span>
            </div>

            <div
              onClick={() => {
                setActiveTab("reservations");
                setMobileOpen(false);
              }}
              className={`sidebar-link ${activeTab === "reservations" ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <span
                className="sidebar-link-icon"
                style={{
                  color: activeTab === "reservations" ? "#4ade80" : "inherit",
                }}
              >
                <CalendarMonthIcon sx={{ fontSize: "1.5rem" }} />
              </span>
              <span className="sidebar-link-text">Mes réservations</span>
            </div>
          </div>
        </div>

        <div className="p-3 border-top border-white-10 mt-auto">
          <div
            onClick={handleLogout}
            className="sidebar-link text-danger d-flex align-items-center"
            style={{
              padding: "1.1rem 1.5rem",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#f87171",
              transition: "all 0.25s ease",
            }}
          >
            <span className="sidebar-link-icon">
              <LogoutIcon sx={{ fontSize: "1.5rem" }} />
            </span>
            <span className="sidebar-link-text fw-bold">Déconnexion</span>
          </div>
        </div>
      </aside>

      {isMobile && mobileOpen && (
        <div
          className="menu-mobile-overlay"
          onClick={() => setMobileOpen(false)}
          style={{ zIndex: 1040 }}
        />
      )}

      <main
        className="flex-grow-1"
        style={{
          marginLeft: isMobile ? 0 : "280px",
          paddingTop: "110px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "40px",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: "100%",
        }}
      >
        <div className="container-fluid" style={{ maxWidth: "800px" }}>
          <div className="tab-content animate-fade-in">
            {activeTab === "info" ? (
              <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 p-md-5">
                <div className="border-bottom pb-3 mb-4">
                  <h2 className="h4 text-dark fw-bold m-0 d-flex align-items-center gap-2">
                    <PersonIcon sx={{ color: "#10b981" }} />
                    Mes informations
                  </h2>
                  <p className="text-secondary small m-0 mt-1">
                    Modifier les détails de votre compte utilisateur.
                  </p>
                </div>

                <form
                  onSubmit={handleSaveInfo}
                  className="d-flex flex-column gap-3"
                >
                  <div className="row g-3">
                    <div className="col-12 col-md-6 text-start">
                      <label
                        className="form-label small fw-bold text-secondary text-uppercase mb-1"
                        htmlFor="firstName"
                      >
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6 text-start">
                      <label
                        className="form-label small fw-bold text-secondary text-uppercase mb-1"
                        htmlFor="lastName"
                      >
                        Nom
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-start">
                    <label
                      className="form-label small fw-bold text-secondary text-uppercase mb-1"
                      htmlFor="email"
                    >
                      Adresse e-mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@gmail.com"
                      required
                    />
                  </div>

                  <div className="text-start">
                    <label
                      className="form-label small fw-bold text-secondary text-uppercase mb-1"
                      htmlFor="password"
                    >
                      Nouveau mot de passe{" "}
                      <span className="text-muted text-lowercase fw-normal">
                        (laisser vide pour ne pas modifier)
                      </span>
                    </label>
                    <div className="position-relative w-100">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ paddingRight: "45px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent text-secondary pe-3 d-flex align-items-center"
                        style={{ cursor: "pointer", zIndex: 5 }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon sx={{ fontSize: "1.3rem" }} />
                        ) : (
                          <VisibilityIcon sx={{ fontSize: "1.3rem" }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-end mt-4 pt-2 border-top border-light-subtle">
                    <button
                      type="submit"
                      disabled={formSaving}
                      className="btn btn-emerald rounded-pill px-5 py-3 fw-bold shadow-sm w-100 w-sm-auto"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {formSaving
                        ? "Enregistrement..."
                        : "Enregistrer les modifications"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 p-md-5">
                <div className="border-bottom pb-3 mb-4">
                  <h2 className="h4 text-dark fw-bold m-0 d-flex align-items-center gap-2">
                    <CalendarMonthIcon sx={{ color: "#10b981" }} />
                    Mes réservations
                  </h2>
                  <p className="text-secondary small m-0 mt-1">
                    Visualisez et gérez l'ensemble de vos réservations de
                    salles.
                  </p>
                </div>

                {reservations.length === 0 ? (
                  <div className="text-center py-5 rounded-4 bg-light border border-light-subtle">
                    <p className="text-secondary mb-0 fs-5">
                      Vous n'avez effectué aucune réservation pour le moment.
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {reservations.map((res) => {
                      const roomObj = rooms[res.roomId];
                      const roomName = roomObj
                        ? roomObj.name
                        : `Salle #${res.roomId}`;
                      const bldObj = roomObj
                        ? buildings[roomObj.buildingId]
                        : null;
                      const buildingName = bldObj
                        ? bldObj.name
                        : "Bâtiment inconnu";
                      const buildingAddr = bldObj ? bldObj.address : "";
                      const isExpanded = expandedReservation === res.id;

                      const isUpcoming =
                        new Date(res.startDate).getTime() > Date.now();

                      return (
                        <div
                          key={res.id}
                          className="accordion-item rounded-3 overflow-hidden border shadow-xs"
                          style={{
                            borderColor: isExpanded ? "#10b981" : "#e2e8f0",
                            transition: "all 0.25s ease",
                            backgroundColor: isExpanded ? "#fcfdfd" : "#ffffff",
                          }}
                        >
                          <div
                            onClick={() => toggleReservation(res.id)}
                            className="p-3 d-flex align-items-center justify-content-between cursor-pointer accordion-trigger"
                            style={{
                              backgroundColor: isExpanded
                                ? "rgba(16, 185, 129, 0.04)"
                                : "transparent",
                              userSelect: "none",
                              transition: "background-color 0.2s ease",
                            }}
                          >
                            <div className="d-flex flex-column align-items-start gap-1">
                              <div className="d-flex align-items-center gap-2 flex-wrap">
                                <span className="fw-bold text-dark fs-5">
                                  {roomName}
                                </span>
                                <span
                                  className="badge rounded-pill small px-2.5 py-1"
                                  style={{
                                    backgroundColor:
                                      res.status === "confirmed"
                                        ? "#d1fae5"
                                        : "#fee2e2",
                                    color:
                                      res.status === "confirmed"
                                        ? "#065f46"
                                        : "#991b1b",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {res.status === "confirmed"
                                    ? "Confirmée"
                                    : "Annulée"}
                                </span>
                                {isUpcoming && (
                                  <span
                                    className="badge bg-primary-subtle text-primary rounded-pill small px-2.5 py-1"
                                    style={{
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      backgroundColor: "#dbeafe",
                                      color: "#1e40af",
                                    }}
                                  >
                                    À venir
                                  </span>
                                )}
                              </div>
                              <span className="text-secondary small">
                                Débute le :{" "}
                                <span className="fw-semibold text-dark">
                                  {formatDate(res.startDate)}
                                </span>
                              </span>
                            </div>

                            <div className="d-flex align-items-center text-secondary">
                              {isExpanded ? (
                                <ExpandLessIcon
                                  sx={{ fontSize: "1.8rem", color: "#10b981" }}
                                />
                              ) : (
                                <ExpandMoreIcon sx={{ fontSize: "1.8rem" }} />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div
                              className="p-3 border-top border-light-subtle bg-white"
                              style={{
                                animation: "slideDown 0.25s ease-out forwards",
                              }}
                            >
                              <div className="row g-3 text-start">
                                <div className="col-12 col-md-6">
                                  <div className="mb-2">
                                    <span className="text-muted small fw-bold text-uppercase d-block mb-0.5">
                                      Bâtiment & Localisation
                                    </span>
                                    <span className="text-dark fw-semibold d-block">
                                      {buildingName}
                                    </span>
                                    {buildingAddr && (
                                      <span className="text-secondary small">
                                        {buildingAddr}
                                      </span>
                                    )}
                                  </div>
                                  <div className="mb-2">
                                    <span className="text-muted small fw-bold text-uppercase d-block mb-0.5">
                                      Étage
                                    </span>
                                    <span className="text-dark fw-semibold">
                                      {roomObj
                                        ? `${roomObj.floor} étage`
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>

                                <div className="col-12 col-md-6">
                                  <div className="mb-2">
                                    <span className="text-muted small fw-bold text-uppercase d-block mb-0.5">
                                      Période réservée
                                    </span>
                                    <span className="text-dark small d-block">
                                      Du :{" "}
                                      <strong className="text-dark">
                                        {formatDate(res.startDate)}
                                      </strong>
                                    </span>
                                    <span className="text-dark small d-block">
                                      Au :{" "}
                                      <strong className="text-dark">
                                        {formatDate(res.endDate)}
                                      </strong>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-end mt-3 pt-3 border-top border-light-subtle">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCancelReservation(res.id)
                                  }
                                  className="btn btn-outline-logout rounded-pill px-4 py-2.5 d-flex align-items-center justify-content-center gap-1 border-0"
                                  style={{
                                    fontSize: "0.85rem",
                                    display: "inline-flex",
                                  }}
                                >
                                  Annuler la réservation
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {successToast && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-success-subtle animate-toast"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            minWidth: "280px",
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          <CheckCircleIcon sx={{ color: "#4ade80", fontSize: "1.8rem" }} />
          <div className="text-start">
            <h6
              className="m-0 fw-semibold text-success"
              style={{ color: "#4ade80" }}
            >
              Succès
            </h6>
            <small className="text-white-50">{successToast}</small>
          </div>
        </div>
      )}

      {errorToast && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-danger-subtle animate-toast"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            minWidth: "280px",
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          <ErrorIcon sx={{ color: "#f87171", fontSize: "1.8rem" }} />
          <div className="text-start">
            <h6
              className="m-0 fw-semibold text-danger"
              style={{ color: "#f87171" }}
            >
              Erreur
            </h6>
            <small className="text-white-50">{errorToast}</small>
          </div>
        </div>
      )}

      <style>{`
        .bullet-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          display: inline-block;
          animation: pulse 2s infinite;
        }

        .hover-emerald:hover {
          color: #4ade80 !important;
        }

        .focus-emerald:focus {
          border-color: #4ade80 !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.15) !important;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
