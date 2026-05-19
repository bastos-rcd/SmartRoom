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
      location: "Batiment A",
      equipment: ["Video-projecteur", "Tableau blanc", "Audio"],
      startDate: "2026-05-30 18:00",
      endDate: "2026-05-30 19:00",
    },
    {
      name: "Salle 2",
      capacity: 10,
      floor: 1,
      location: "Batiment A",
      equipment: ["Video-projecteur", "Tableau blanc", "Audio"],
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
      <div>
        <div className="border-bottom border-secondary-subtle p-3 m-2 text-center">
          <h1 className="fs-1 ">Mes réservations</h1>
        </div>
        <div className="nav nav-underline nav-justified p-3 m-2">
          <label
            className={`nav-link text-decoration-none cursor-pointer ${activeTab === "current" ? "active" : ""} fs-4 ${activeTab === "current" ? "text-dark" : "text-secondary"}`}
            role="button"
            id="current"
            onClick={() => setActiveTab("current")}
          >
            En cours
          </label>
          <label
            className={`nav-link text-decoration-none cursor-pointer ${activeTab === "passed" ? "active" : ""} fs-4 ${activeTab === "passed" ? "text-dark" : "text-secondary"}`}
            role="button"
            id="passed"
            onClick={() => setActiveTab("passed")}
          >
            Passées
          </label>
        </div>
        <div className="row g-4 col-11 col-md-11 mx-auto mt-4">
          {filteredData.length === 0 ? (
            <div className="text-center">
              <p className="fs-4">Aucune réservation</p>
            </div>
          ) : (
            filteredData.map((room) => (
              <div className="col-12 col-md-6 col-lg-4" key={room.name}>
                <RoomCard {...room} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
