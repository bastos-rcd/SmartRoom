import { useEffect, useState } from "react";
import { userService } from "../services/user.service";
import type { Request } from "../types/request";
import type { User } from "../types/user";
import { formatDate } from "@fullcalendar/core/index.js";

export default function RequestCard(props: Request) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getUserById(props.userId).then(setUser);
  }, []);

  return (
    <div className="card h-100 w-100 border border-light-subtle rounded-4 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="card-header custom-bg text-white p-3 border-0">
        <h4 className="card-title h5 fw-bold mb-1">
          Demande de : {user?.firstName} {user?.lastName}
        </h4>
        <div className="text-white-50 small fw-medium"></div>
      </div>

      {/* Card Body */}
      <div className="card-body p-4 d-flex flex-column gap-3">
        {/* Dynamic Period Badge */}
        {props.creationDate && (
          <div className="bg-light border border-light-subtle rounded-3 p-3">
            <div
              className="text-uppercase text-secondary fw-bold small mb-1"
              style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
            >
              Demande enregistrée le
            </div>
            <div className="fw-bold text-dark fs-5 flex-wrap">
              {formatDate(props.creationDate)}
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="d-flex flex-column gap-2">
          <div className="small text-secondary">
            <strong className="text-dark">Demande :</strong> {props.type}
          </div>

          <div className="small text-secondary mt-1">
            <strong className="d-block mb-2 text-dark">Description :</strong>
            <div className="d-flex flex-wrap gap-2">{props.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
