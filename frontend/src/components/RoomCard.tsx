import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { eventService } from "../services/event.service";
import { authService } from "../services/auth.service";
import type { Event } from "../types/event";

type RoomProps = {
  id: number;
  name: string;
  capacity: number;
  floor: number;
  location: string;
  equipment: string[];
  bottomVisible?: boolean;
  startDate?: string;
  endDate?: string;
  events: Event[];
  onReservationSuccess?: () => void;
};

export default function RoomCard(props: RoomProps) {
  const [extended, setExtended] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const handleReserve = async () => {
    if (endDate <= startDate) {
      alert("La date de fin doit être postérieure à la date de début.");
      return;
    }

    const hasConflict = props.events.some((event: Event) => {
      if (event.roomId !== props.id || event.status === "cancelled") {
        return false;
      }

      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      return eventStart < new Date(endDate) && eventEnd > new Date(startDate);
    });

    if (hasConflict) {
      alert("Cette salle est déjà réservée sur ce créneau horaire !");
      return;
    }

    try {
      const user = await authService.getUser();

      await eventService.createEvent({
        id: 0,
        startDate: startDate,
        endDate: endDate,
        status: "confirmed",
        comment: comment,
        roomId: props.id,
        userId: user.id || 0,
      });

      setComment("");
      setExtended(false);

      if (props.onReservationSuccess) {
        props.onReservationSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
    }
  };

  return (
    <div className="card w-100 shadow-sm border">
      <div className="card-header bg-custom-login text-white py-3 px-4">
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
            Réservé du {new Date(props.startDate).toLocaleString("fr-FR")} au{" "}
            {new Date(props.endDate).toLocaleString("fr-FR")}
          </p>
        </div>
      )}

      {props.bottomVisible && (
        <div className="card-footer py-2 text-end">
          <div
            className="d-flex justify-content-end align-items-center"
            onClick={() => setExtended(!extended)}
            style={{ cursor: "pointer" }}
          >
            {extended ? (
              <KeyboardArrowUpIcon className="text-secondary" />
            ) : (
              <KeyboardArrowDownIcon className="text-secondary" />
            )}
          </div>

          {extended && (
            <div className="card-body px-0 text-start border-top mt-2">
              <div className="d-flex flex-column gap-3">
                <div className="w-100">
                  <label htmlFor={`comment-${props.id}`} className="form-label">
                    Commentaire
                  </label>
                  <input
                    type="text"
                    className="form-control bg-custom-login-input"
                    id={`comment-${props.id}`}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label
                    htmlFor={`start-date-${props.id}`}
                    className="form-label"
                  >
                    Date de début
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control bg-custom-login-input"
                    id={`start-date-${props.id}`}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label
                    htmlFor={`end-date-${props.id}`}
                    className="form-label"
                  >
                    Date de fin
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control bg-custom-login-input"
                    id={`end-date-${props.id}`}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn bg-custom-login-btn text-black w-100 mt-2 fw-bold"
                  onClick={handleReserve}
                >
                  Réserver cette salle
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
