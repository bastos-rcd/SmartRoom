import { useState } from "react";
import Menu from "../components/Menu";
import RoomCard from "../components/RoomCard";

export default function Rooms() {
  const data = [
    {
      name: "Salle 1",
      capacity: 10,
      floor: 1,
      location: "Batiment A",
      equipment: ["Video-projecteur", "Tableau blanc", "Audio"],
    },
    {
      name: "Salle 2",
      capacity: 20,
      floor: 2,
      location: "Batiment B",
      equipment: ["Video-projecteur", "Tableau blanc", "Audio"],
    },
    {
      name: "Salle 3",
      capacity: 30,
      floor: 3,
      location: "Batiment C",
      equipment: ["Video-projecteur", "Tableau blanc", "Audio"],
    },
    {
      name: "Salle 4",
      capacity: 40,
      floor: 4,
      location: "Batiment D",
      equipment: ["Video-projecteur", "Tableau blanc", "Audio"],
    },
    {
      name: "Salle 5",
      capacity: 50,
      floor: 5,
      location: "Batiment E",
      equipment: ["Video-projecteur", "Tableau blanc", "Audio"],
    },
    {
      name: "Salle 6",
      capacity: 60,
      floor: 6,
      location: "Batiment F",
      equipment: ["Video-projecteur", "Tableau blanc", "Audio"],
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleReserveClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Menu />
      <div>
        <div className="border-bottom border-secondary-subtle p-3 m-2 position-relative d-flex justify-content-center align-items-center">
          <h1 className="fs-1 m-0">Salles</h1>
          <button
            className="btn bg-custom-login-btn fs-3 position-absolute end-0 me-3"
            onClick={handleReserveClick}
          >
            Réserver
          </button>
        </div>
        <div className="row g-4 col-11 col-md-11 mx-auto mt-4">
          {data.map((room) => (
            <div className="col-12 col-md-6 col-lg-4" key={room.name}>
              <RoomCard {...room} bottomVisible={true} />
            </div>
          ))}
        </div>
        {showModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div
              className="modal fade show"
              id="exampleModal"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
              style={{ display: "block" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header d-flex justify-content-center">
                    <h1 className="modal-title fs-5">Réserver une salle</h1>
                  </div>
                  <div className="modal-body">
                    <div className="d-flex flex-column gap-2 align-items-center justify-content-between flex-wrap gap-3">
                      <div className="w-100">
                        <label
                          htmlFor="start-date"
                          className="form-label d-block text-start"
                        >
                          Date de début
                        </label>
                        <input
                          type="date"
                          className="form-control bg-custom-login-input"
                          id="start-date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder="Date"
                        />
                        <input
                          type="time"
                          className="form-control bg-custom-login-input"
                          placeholder="Heure"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="w-100">
                        <label
                          htmlFor="end-date"
                          className="form-label d-block text-start"
                        >
                          Date de fin
                        </label>
                        <input
                          type="date"
                          className="form-control bg-custom-login-input"
                          id="end-date"
                          placeholder="Date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        <input
                          type="time"
                          className="form-control bg-custom-login-input"
                          placeholder="Heure"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer d-flex justify-content-center">
                    <button
                      className="btn bg-custom-login-btn fs-4 text-black px-5 py-2"
                      onClick={handleCloseModal}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
