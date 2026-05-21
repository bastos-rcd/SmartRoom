import { useState } from "react";
import Menu from "../components/Menu";
import RoomCard from "../components/RoomCard";

export default function Reservation() {
  const [activeTab, setActiveTab] = useState<string>("current");

  const data = [
    {
      name: "Salle 1",
      capacity: 10,
      floor: 1,
      location: "Bâtiment A",
      equipment: ["Vidéo-projecteur", "Tableau blanc", "Audio"],
      startDate: "2026-05-30 18:00",
      endDate: "2026-05-30 19:00",
    },
    {
      name: "Salle 2",
      capacity: 10,
      floor: 1,
      location: "Bâtiment A",
      equipment: ["Vidéo-projecteur", "Tableau blanc", "Audio"],
      startDate: "2026-05-19 10:00",
      endDate: "2026-05-19 11:00",
    },
  ];

  const filteredData = data.filter((room) => {
    const now = new Date();
    const endDate = new Date(room.endDate.replace(" ", "T"));
    if (activeTab === "current") {
      return endDate >= now;
    } else {
      return endDate < now;
    }
  });

  return (
    <>
      <Menu />
      
      <div className="container-fluid py-4 px-3 px-md-5">
        {/* Page Header */}
        <div className="text-center mb-4">
          <h1 className="display-5 text-dark fw-bold mb-2">Mes réservations</h1>
        </div>

        {/* Premium Pills Tab Switcher */}
        <div className="d-flex justify-content-center mb-5">
          <div className="nav nav-pills bg-light border border-light-subtle rounded-pill p-1">
            <button
              type="button"
              className={`nav-link rounded-pill px-4 fw-bold ${
                activeTab === "current"
                  ? "bg-dark text-white shadow-sm"
                  : "text-secondary bg-transparent"
              }`}
              onClick={() => setActiveTab("current")}
            >
              En cours
            </button>
            <button
              type="button"
              className={`nav-link rounded-pill px-4 fw-bold ${
                activeTab === "passed"
                  ? "bg-dark text-white shadow-sm"
                  : "text-secondary bg-transparent"
              }`}
              onClick={() => setActiveTab("passed")}
            >
              Passées
            </button>
          </div>
        </div>

        {/* Reservations Grid List */}
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            {filteredData.length === 0 ? (
              <div className="text-center py-5 bg-white border rounded-4 shadow-sm col-12 col-md-8 mx-auto">
                <p className="fs-5 text-secondary mb-0">
                  Aucune réservation {activeTab === "current" ? "en cours" : "passée"} pour le moment.
                </p>
              </div>
            ) : (
              <div className="row g-4 justify-content-center">
                {filteredData.map((room) => (
                  <div className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch" key={room.name}>
                    <RoomCard {...room} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

