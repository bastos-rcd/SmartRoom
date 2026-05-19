import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type Room = {
  name: string;
  capacity: number;
  floor: number;
  location: string;
  equipment: string[];
  bottomVisible?: boolean;
  startDate?: string;
  endDate?: string;
};

export default function RoomCard(props: Room) {
  const [extended, setExtended] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(props.startDate || "");
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(props.endDate || "");
  const [endTime, setEndTime] = useState<string>("");

  const handleReserve = () => {
    const startDatetime = `${startDate}T${startTime}`;
    const endDatetime = `${endDate}T${endTime}`;
    setExtended(!extended);
  };

  return (
    <div className="card w-100 shadow-sm border">
      <div className="card-header bg-custom-login text-white py-3 px-4 ">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title fs-3 mb-0">{props.name}</h5>
          <span className="fs-5">
            {props.location} • Étage {props.floor}
          </span>
        </div>
      </div>
      <div className="card-body px-4 py-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <p className="card-text fs-4 mb-0">
            <strong className="fw-bold">Capacité :</strong> {props.capacity}
          </p>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <p className="fw-bold fs-4 mb-0">Équipements :</p>
            {props.equipment.map((equipment) => (
              <span
                key={equipment}
                className="fs-6 badge rounded-pill text-bg-secondary px-2 py-1.5"
              >
                {equipment}
              </span>
            ))}
          </div>
        </div>
      </div>
      {props.startDate && props.endDate && (
        <div className="card-footer py-2 text-start">
          <p className="card-text fs-5 mb-0 fw-bold">
            Réservé du {new Date(props.startDate || "").toLocaleString("fr-FR")}{" "}
            au {new Date(props.endDate || "").toLocaleString("fr-FR")}
          </p>
        </div>
      )}
      {props.bottomVisible && (
        <div className="card-footer py-2 text-end">
          {extended ? (
            <KeyboardArrowUpIcon
              onClick={() => setExtended(!extended)}
              className="text-secondary"
            />
          ) : (
            <KeyboardArrowDownIcon
              onClick={() => setExtended(!extended)}
              className="text-secondary"
            />
          )}
          <>
            {extended && (
              <div className="card-body px-4">
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
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleReserve}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
}
