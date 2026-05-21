import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import Menu from "../components/Menu";
import { eventService } from "../services/event.service";
import { roomService } from "../services/roomService";
import { buildingService } from "../services/buildingService";
import { equipmentService } from "../services/equipmentService";
import { authService } from "../services/auth.service";

import type { Event } from "../types/event";
import type { Room } from "../types/room";
import type { Building } from "../types/building";

export default function Home() {
  const [calendarView, setCalendarView] = useState(
    window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek"
  );
  const [events, setEvents] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"building" | "room" | "equipment" | null>(null);

  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");

  const [buildingForm, setBuildingForm] = useState({ name: "", address: "", nbFloors: 1 });
  const [roomForm, setRoomForm] = useState({ name: "", capacity: 10, floor: 1, location: "", buildingId: "" });
  const [equipmentForm, setEquipmentForm] = useState({ name: "", type: "informatique", roomId: "" });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCalendarView("timeGridDay");
      } else {
        setCalendarView("timeGridWeek");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadCalendarEvents = () => {
    eventService.getEvents().then(async (data: Event[]) => {
      const reservations: any[] = data.map(async (event: Event) => {
        const room: Room = await roomService.getRoomById(event.roomId);

        return {
          title: `${room.name} : ${event.comment}`,
          start: event.startDate,
          end: event.endDate,
          backgroundColor:
            event.type === "confirmed"
              ? "#10b981"
              : event.type === "cancelled"
                ? "#ef4444"
                : "#60a5fa",
        };
      });

      Promise.all(reservations).then((data) => setEvents(data));
    });
  };

  const loadSelections = async () => {
    try {
      const [bList, rList] = await Promise.all([
        buildingService.getBuildings(),
        roomService.getRooms(),
      ]);
      setBuildings(bList || []);
      setRooms(rList || []);
    } catch (err) {
      console.error("Failed to load selections", err);
    }
  };

  useEffect(() => {
    loadCalendarEvents();

    if (authService.isAuthenticated()) {
      authService.getUser().then((user) => {
        if (user && user.role === "admin") {
          setIsAdmin(true);
          loadSelections();
        }
      });
    }
  }, []);

  const openModal = (type: "building" | "room" | "equipment") => {
    setActiveModal(type);
    loadSelections();
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleAddBuildingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildingForm.name.trim() || !buildingForm.address.trim()) {
      showError("Tous les champs sont requis.");
      return;
    }
    try {
      await buildingService.createBuilding({
        name: buildingForm.name,
        address: buildingForm.address,
        nbFloors: Number(buildingForm.nbFloors),
      });
      setBuildingForm({ name: "", address: "", nbFloors: 1 });
      showSuccess("Bâtiment créé avec succès !");
      closeModal();
    } catch {
      showError("Erreur lors de la création du bâtiment.");
    }
  };

  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.name.trim() || !roomForm.buildingId) {
      showError("Le nom de salle et le bâtiment sont requis.");
      return;
    }
    try {
      await roomService.createRoom({
        name: roomForm.name,
        capacity: Number(roomForm.capacity),
        floor: Number(roomForm.floor),
        state: 1,
        location: roomForm.location,
        buildingId: Number(roomForm.buildingId),
      });
      setRoomForm({ name: "", capacity: 10, floor: 1, location: "", buildingId: "" });
      showSuccess("Salle affiliée avec succès !");
      closeModal();
    } catch {
      showError("Erreur lors de l'affiliation de la salle.");
    }
  };

  const handleAddEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentForm.name.trim() || !equipmentForm.roomId) {
      showError("Le nom et la salle affiliée sont requis.");
      return;
    }
    try {
      await equipmentService.createEquipment({
        name: equipmentForm.name,
        type: equipmentForm.type,
        available: 1,
        roomId: Number(equipmentForm.roomId),
      });
      setEquipmentForm({ name: "", type: "informatique", roomId: "" });
      showSuccess("Équipement assigné avec succès !");
      closeModal();
    } catch {
      showError("Erreur lors de l'assignation de l'équipement.");
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(""), 4000);
  };

  return (
    <>
      <Menu />

      <div className="container-fluid py-4 px-2 px-sm-3 px-md-5 position-relative">

        <div className="d-flex flex-column gap-3 mb-4 custom-title-wrapper">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <h2 className="fs-3 fs-md-2 text-dark fw-bold m-0">Calendrier des Réservations</h2>

            {isAdmin && (
              <div className="position-relative w-100 w-sm-auto">
                <button
                  type="button"
                  className="btn btn-dark text-white rounded-pill px-4 py-2.5 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm w-100 w-sm-auto"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ backgroundColor: "#0e172a", fontSize: "0.9rem", fontWeight: 600 }}
                >
                  Actions Administrateur
                </button>
                {dropdownOpen && (
                  <div
                    className="position-absolute end-0 mt-2 shadow border-0 rounded-3 p-2 bg-white text-dark"
                    style={{ zIndex: 1050, minWidth: "220px", width: window.innerWidth < 576 ? "100%" : "auto" }}
                  >
                    <button
                      className="dropdown-item rounded text-start w-100 border-0 bg-transparent py-2 px-3 small d-flex align-items-center gap-2"
                      onClick={() => {
                        setDropdownOpen(false);
                        openModal("building");
                      }}
                    >
                      Ajouter un bâtiment
                    </button>
                    <button
                      className="dropdown-item rounded text-start w-100 border-0 bg-transparent py-2 px-3 small d-flex align-items-center gap-2"
                      onClick={() => {
                        setDropdownOpen(false);
                        openModal("room");
                      }}
                    >
                      Affilier une salle
                    </button>
                    <button
                      className="dropdown-item rounded text-start w-100 border-0 bg-transparent py-2 px-3 small d-flex align-items-center gap-2"
                      onClick={() => {
                        setDropdownOpen(false);
                        openModal("equipment");
                      }}
                    >
                      Ajouter un équipement
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-2 p-sm-3 rounded-4 shadow-sm border border-light-subtle overflow-hidden custom-calendar-card">
          <div className="fc-responsive-container" style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ minWidth: window.innerWidth < 768 ? "850px" : "auto" }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                key={calendarView}
                initialView={calendarView}
                locales={[frLocale]}
                locale="fr"
                headerToolbar={{
                  left: "dayGridMonth,timeGridWeek,timeGridDay",
                  center: "title",
                  right: "prev,today,next",
                }}
                handleWindowResize={true}
                windowResizeDelay={100}
                allDaySlot={false}
                slotMinTime="07:00:00"
                slotMaxTime="20:00:00"
                scrollTime="08:00:00"
                height={"auto"}
                aspectRatio={1.35}
                events={events}
              />
            </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", backdropFilter: "blur(4px)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered px-2">
            <div className="modal-content border-0 rounded-4 shadow-lg p-2 p-sm-3 bg-white">
              <div className="modal-header border-0 pb-1">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  {activeModal === "building" && "Nouveau Bâtiment"}
                  {activeModal === "room" && "Nouvelle Salle Affiliée"}
                  {activeModal === "equipment" && "Nouvel Équipement"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body py-2">
                {activeModal === "building" && (
                  <form onSubmit={handleAddBuildingSubmit} className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Nom du Bâtiment</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Bâtiment Central"
                        value={buildingForm.name}
                        onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Nombre d'Étages</label>
                      <input
                        type="number"
                        min={1}
                        className="form-control rounded-3"
                        value={buildingForm.nbFloors}
                        onChange={(e) => setBuildingForm({ ...buildingForm, nbFloors: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Adresse</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Avenue des Sciences, Toulouse"
                        value={buildingForm.address}
                        onChange={(e) => setBuildingForm({ ...buildingForm, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="text-end mt-2">
                      <button type="submit" className="btn btn-emerald rounded-pill px-4 w-100 w-sm-auto">
                        + Créer le Bâtiment
                      </button>
                    </div>
                  </form>
                )}

                {activeModal === "room" && (
                  <form onSubmit={handleAddRoomSubmit} className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Nom de la Salle</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Salle B1"
                        value={roomForm.name}
                        onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Bâtiment Affilié</label>
                      <select
                        className="form-select rounded-3"
                        value={roomForm.buildingId}
                        onChange={(e) => setRoomForm({ ...roomForm, buildingId: e.target.value })}
                        required
                      >
                        <option value="">-- Choisir le bâtiment --</option>
                        {buildings.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Capacité</label>
                        <input
                          type="number"
                          min={1}
                          className="form-control rounded-3"
                          value={roomForm.capacity}
                          onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Étage</label>
                        <input
                          type="number"
                          className="form-control rounded-3"
                          value={roomForm.floor}
                          onChange={(e) => setRoomForm({ ...roomForm, floor: Number(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Localisation interne</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Aile Gauche"
                        value={roomForm.location}
                        onChange={(e) => setRoomForm({ ...roomForm, location: e.target.value })}
                      />
                    </div>
                    <div className="text-end mt-2">
                      <button type="submit" className="btn btn-emerald rounded-pill px-4 w-100 w-sm-auto">
                        + Affilier la Salle
                      </button>
                    </div>
                  </form>
                )}

                {activeModal === "equipment" && (
                  <form onSubmit={handleAddEquipmentSubmit} className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Nom de l'Équipement</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="e.g. Rétroprojecteur"
                        value={equipmentForm.name}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Type d'Équipement</label>
                      <select
                        className="form-select rounded-3"
                        value={equipmentForm.type}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, type: e.target.value })}
                        required
                      >
                        <option value="informatique">Informatique</option>
                        <option value="fourniture">Fourniture</option>
                        <option value="audio">Audio / Vidéo</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-secondary text-uppercase mb-1">Salle Affiliée</label>
                      <select
                        className="form-select rounded-3"
                        value={equipmentForm.roomId}
                        onChange={(e) => setEquipmentForm({ ...equipmentForm, roomId: e.target.value })}
                        required
                      >
                        <option value="">-- Choisir la salle --</option>
                        {rooms.map((r) => {
                          const bName = buildings.find((b) => b.id === r.buildingId)?.name || "";
                          return (
                            <option key={r.id} value={r.id}>{r.name} ({bName})</option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="text-end mt-2">
                      <button type="submit" className="btn btn-emerald rounded-pill px-4 w-100 w-sm-auto">
                        + Assigner l'Équipement
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {successToast && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-success-subtle animate-toast"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(8px)", zIndex: 9999, minWidth: "280px", maxWidth: "calc(100vw - 32px)" }}
        >
          <CheckCircleIcon sx={{ color: "#4ade80", fontSize: "1.8rem" }} />
          <div>
            <h6 className="m-0 fw-semibold text-success" style={{ color: "#4ade80" }}>Succès</h6>
            <small className="text-white-50">{successToast}</small>
          </div>
        </div>
      )}

      {errorToast && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-danger-subtle animate-toast"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(8px)", zIndex: 9999, minWidth: "280px", maxWidth: "calc(100vw - 32px)" }}
        >
          <ErrorIcon sx={{ color: "#f87171", fontSize: "1.8rem" }} />
          <div>
            <h6 className="m-0 fw-semibold text-danger" style={{ color: "#f87171" }}>Erreur</h6>
            <small className="text-white-50">{errorToast}</small>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .custom-title-wrapper {
            margin-bottom: 10px !important;
          }
          .custom-calendar-card {
            padding-top: 175px !important;
          }
          .fc .fc-header-toolbar {
            position: absolute !important;
            top: 12px !important;
            left: 0 !important;
            right: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            align-items: center !important;
            margin-bottom: 0 !important;
            padding: 0 8px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            pointer-events: none !important;
          }
          .fc .fc-toolbar-chunk {
            display: flex !important;
            width: 100% !important;
            justify-content: center !important;
            pointer-events: auto !important;
          }
          .fc .fc-toolbar-chunk:nth-child(1) .fc-button-group {
            display: flex !important;
            flex-direction: column !important;
            gap: 4px !important;
            width: 100% !important;
          }
          .fc .fc-toolbar-chunk:nth-child(1) .fc-button {
            width: 100% !important;
            border-radius: 6px !important;
            margin: 0 !important;
          }
          .fc .fc-toolbar-chunk:nth-child(2) {
            order: 1 !important;
            margin-top: 2px !important;
            margin-bottom: 2px !important;
          }
          .fc-toolbar-title {
            font-size: 1.25rem !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            text-transform: capitalize !important;
          }
          .fc .fc-toolbar-chunk:nth-child(3) {
            order: 0 !important;
          }
          .fc .fc-toolbar-chunk:nth-child(3) .fc-button-group {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
            gap: 6px !important;
          }
          .fc .fc-toolbar-chunk:nth-child(3) .fc-button-group .fc-button {
            flex: 1 !important;
            border-radius: 6px !important;
            margin: 0 !important;
          }
          .fc .fc-toolbar-chunk:nth-child(3) .fc-button-group .fc-today-button {
            flex: 1.5 !important;
          }
        }
        .fc-responsive-container::-webkit-scrollbar {
          height: 8px;
        }
        .fc-responsive-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .fc-responsive-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .fc-responsive-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}