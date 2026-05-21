import { useState } from "react";
import Menu from "../components/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

interface Room {
  name: string;
  capacity: number;
  floor: number;
  location: string;
  equipment: string[];
}

export default function Rooms() {
  const allRooms: Room[] = [
    {
      name: "Salle 1",
      capacity: 10,
      floor: 1,
      location: "Batiment A",
      equipment: ["Vidéo-projecteur", "Tableau blanc", "Audio"],
    },
    {
      name: "Salle 2",
      capacity: 20,
      floor: 2,
      location: "Batiment B",
      equipment: [
        "Vidéo-projecteur",
        "Tableau blanc",
        "Audio",
        "Visioconférence",
      ],
    },
    {
      name: "Salle 3",
      capacity: 30,
      floor: 3,
      location: "Batiment C",
      equipment: ["Vidéo-projecteur", "Tableau blanc", "Audio"],
    },
    {
      name: "Salle 4",
      capacity: 40,
      floor: 4,
      location: "Batiment D",
      equipment: [
        "Vidéo-projecteur",
        "Tableau blanc",
        "Audio",
        "Écran tactile",
      ],
    },
    {
      name: "Salle 5",
      capacity: 50,
      floor: 5,
      location: "Batiment E",
      equipment: ["Vidéo-projecteur", "Tableau blanc", "Audio"],
    },
    {
      name: "Salle 6",
      capacity: 60,
      floor: 6,
      location: "Batiment F",
      equipment: ["Vidéo-projecteur", "Tableau blanc", "Audio", "Double écran"],
    },
  ];

  // Airbnb filter pill states
  const [searchBuilding, setSearchBuilding] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");

  // States applied on clicking search button
  const [filterBuilding, setFilterBuilding] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");

  // Room expanded states
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  // Reservation feedback toasts
  const [successToast, setSuccessToast] = useState<{
    visible: boolean;
    roomName: string;
  } | null>(null);

  const toggleExpand = (roomName: string) => {
    setExpandedRoom((prev) => (prev === roomName ? null : roomName));
  };

  const handleSearch = () => {
    setFilterBuilding(searchBuilding);
    setFilterDate(searchDate);
  };

  // Instant or button-triggered room filtering
  const filteredRooms = allRooms.filter((room) => {
    const matchesBuilding =
      filterBuilding === "" ||
      room.location.toLowerCase() === filterBuilding.toLowerCase();
    // Simulate date availability checks if selected
    return matchesBuilding;
  });

  return (
    <>
      <Menu />

      <div className="container-fluid py-4 px-3 px-md-5">
        {/* Page Header */}
        <div className="text-center mb-4">
          <h1 className="display-5 text-dark fw-bold mb-2">Salles</h1>
        </div>

        <div className="d-flex justify-content-center mb-4">
          <div
            className="bg-white border shadow-sm d-flex flex-column flex-md-row align-items-stretch align-items-md-center p-3 p-md-2 search-filter-pill"
            style={{ maxWidth: "600px", width: "100%" }}
          >
            {/* Filter: Building */}
            <div
              className="flex-grow-1 px-3 py-2 py-md-1 d-flex flex-column text-start"
              style={{ minWidth: "150px" }}
            >
              <label
                className="text-secondary fw-bold small text-uppercase mb-0"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Bâtiment
              </label>
              <select
                className="form-select border-0 p-0 bg-transparent text-dark fw-semibold shadow-none"
                aria-label="Bâtiment à rechercher"
                style={{ fontSize: "0.9rem" }}
                value={searchBuilding}
                onChange={(e) => setSearchBuilding(e.target.value)}
              >
                <option value="">Tous les bâtiments</option>
                <option value="Batiment A">Bâtiment A</option>
                <option value="Batiment B">Bâtiment B</option>
                <option value="Batiment C">Bâtiment C</option>
                <option value="Batiment D">Bâtiment D</option>
                <option value="Batiment E">Bâtiment E</option>
                <option value="Batiment F">Bâtiment F</option>
              </select>
            </div>
            <div
              className="vr d-none d-md-block mx-2"
              style={{ height: "30px", backgroundColor: "#e2e8f0" }}
            ></div>
            <hr className="d-md-none my-2 text-black-50" />
            {/* Filter: Date */}
            <div
              className="flex-grow-1 px-3 py-2 py-md-1 d-flex flex-column text-start"
              style={{ minWidth: "150px" }}
            >
              <label
                className="text-secondary fw-bold small text-uppercase mb-0"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Date souhaitée
              </label>
              <input
                type="date"
                className="form-control border-0 p-0 bg-transparent text-dark fw-semibold shadow-none"
                style={{ fontSize: "0.9rem" }}
                aria-label="Date souhaitée"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            {/* Search Button */}
            <button
              className="btn btn-success rounded-pill rounded-md-circle p-2 d-flex align-items-center justify-content-center mt-3 mt-md-0 ms-md-2"
              style={{
                minHeight: "44px",
                backgroundColor: "#22c55e",
                borderColor: "#22c55e",
              }}
              onClick={handleSearch}
              title="Lancer la recherche"
            >
              <SearchIcon
                sx={{ fontSize: "1.4rem", color: "#ffffff" }}
                className="me-2 d-md-none"
              />
              <span className="d-md-none fw-bold text-white">Rechercher</span>
              <SearchIcon
                sx={{ fontSize: "1.4rem", color: "#ffffff" }}
                className="d-none d-md-inline"
              />
            </button>
          </div>
        </div>

        {/* Filters Summary if active */}
        {(filterBuilding || filterDate) && (
          <div className="d-flex justify-content-center mb-3">
            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 rounded-pill fs-6">
              Filtres actifs :{" "}
              {filterBuilding && `Bâtiment : ${filterBuilding}`}{" "}
              {filterBuilding && filterDate && " | "}{" "}
              {filterDate &&
                `Date : ${new Date(filterDate).toLocaleDateString("fr-FR")}`}
              <button
                className="btn-close ms-2 fs-7"
                aria-label="Effacer les filtres"
                style={{ fontSize: "0.8rem", verticalAlign: "middle" }}
                onClick={() => {
                  setSearchBuilding("");
                  setSearchDate("");
                  setFilterBuilding("");
                  setFilterDate("");
                }}
              ></button>
            </span>
          </div>
        )}

        {/* --- Collapsible Room List (Dropdowns) --- */}
        <div className="row justify-content-center">
          <div className="col-12 col-xl-9">
            <div className="d-flex flex-column gap-3">
              {filteredRooms.length === 0 ? (
                <div className="text-center p-5 bg-white border rounded-4 shadow-sm">
                  <p className="fs-4 text-secondary mb-0">
                    Aucune salle ne correspond à vos critères de recherche
                  </p>
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const isExpanded = expandedRoom === room.name;
                  return (
                    <div
                      className="card border rounded-4 shadow-sm overflow-hidden bg-white"
                      key={room.name}
                    >
                      {/* Collapsible Row Header */}
                      <div
                        className="card-header bg-white p-3 d-flex align-items-center justify-content-between cursor-pointer border-0"
                        onClick={() => toggleExpand(room.name)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="text-start">
                          <h3 className="h5 fw-bold text-dark mb-1">
                            {room.name}
                          </h3>
                          <span className="text-secondary small fw-medium d-block d-sm-inline">
                            {room.location} • Étage {room.floor}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span
                            className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-bold"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {room.capacity} pers
                          </span>
                          <span
                            className="text-secondary"
                            style={{
                              transform: isExpanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s ease",
                            }}
                          >
                            <KeyboardArrowDownIcon
                              sx={{ fontSize: "1.8rem" }}
                            />
                          </span>
                        </div>
                      </div>

                      {/* Collapsible Detailed Content Row */}
                      {isExpanded && (
                        <div className="card-body p-4 border-top border-light-subtle">
                          <RoomDetailRow
                            room={room}
                            onReserveSuccess={(name) => {
                              setSuccessToast({
                                visible: true,
                                roomName: name,
                              });
                              setExpandedRoom(null); // collapse row on success
                              setTimeout(() => setSuccessToast(null), 5000);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Premium Booking Confirmation Toast --- */}
      {successToast?.visible && (
        <div
          className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-success-subtle animate-toast"
          style={{
            backgroundColor: "#0f172a",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            minWidth: "320px",
          }}
        >
          <span style={{ fontSize: "1.8rem", color: "#4ade80" }}>
            <EventAvailableIcon sx={{ fontSize: "2rem" }} />
          </span>
          <div>
            <h6
              className="m-0 fw-semibold text-success"
              style={{ color: "#4ade80" }}
            >
              Réservation Confirmée
            </h6>
            <small className="text-white-50">
              La {successToast.roomName} a été réservée avec succès !
            </small>
          </div>
        </div>
      )}
    </>
  );
}

/* --- Internal Helper Component for Expanded Room Row Details --- */
interface RoomDetailRowProps {
  room: Room;
  onReserveSuccess: (roomName: string) => void;
}

function RoomDetailRow({ room, onReserveSuccess }: RoomDetailRowProps) {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [comment, setComment] = useState("");
  const [reserveError, setReserveError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !startTime || !endDate || !endTime) {
      setReserveError(true);
      return;
    }
    setReserveError(false);
    onReserveSuccess(room.name);
  };

  return (
    <div className="room-list-details">
      <div className="row g-4">
        {/* Left Side: Room details */}
        <div className="col-12 col-md-5 d-flex flex-column gap-3 border-end-md">
          <div>
            <h5 className="text-dark fw-bold fs-5 mb-2">Caractéristiques</h5>
            <div className="d-flex flex-column gap-2 text-secondary fs-6">
              <div>
                Emplacement:{" "}
                <strong className="text-dark">{room.location}</strong>
              </div>
              <div>
                Étage:{" "}
                <strong className="text-dark">Niveau {room.floor}</strong>
              </div>
              <div>
                Capacité max:{" "}
                <strong className="text-dark">
                  {room.capacity} places assises
                </strong>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-dark fw-bold fs-5 mb-2">Équipements inclus</h5>
            <div className="d-flex flex-wrap gap-2">
              {room.equipment.map((equipment) => (
                <span
                  key={equipment}
                  className="badge bg-white text-dark border border-secondary-subtle px-3 py-2 rounded-pill shadow-sm"
                  style={{ fontSize: "0.85rem", fontWeight: 500 }}
                >
                  {equipment}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Reserve Form */}
        <div className="col-12 col-md-7">
          <h5 className="text-dark fw-bold fs-5 mb-3">
            Réserver cet espace rapidement
          </h5>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold fs-7 mb-1">
                  Date & Heure de début
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="date"
                    aria-label="Date de début"
                    className="form-control bg-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    type="time"
                    aria-label="Heure de début"
                    className="form-control bg-white"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold fs-7 mb-1">
                  Date & Heure de fin
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="date"
                    aria-label="Date de fin"
                    className="form-control bg-white"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <input
                    type="time"
                    aria-label="Heure de fin"
                    className="form-control bg-white"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="w-100">
              <label className="form-label text-secondary fw-semibold fs-7 mb-1">
                Commentaire / Objet de la réunion (Optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex. Réunion d'équipe hebdomadaire"
                className="form-control bg-white"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {reserveError && (
              <div className="text-danger fw-semibold fs-6">
                Veuillez remplir tous les champs de date et d'heure.
              </div>
            )}

            <div className="d-flex justify-content-end mt-2">
              <button
                type="submit"
                className="btn btn-emerald rounded-pill py-2.5 px-4 text-white fw-bold border-0"
              >
                Confirmer la réservation
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Small responsive helper border CSS */}
      <style>{`
        @media (min-width: 768px) {
          .border-end-md {
            border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
            padding-right: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
