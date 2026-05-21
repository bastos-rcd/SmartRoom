import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import RoomCard from "../components/RoomCard";
import { roomService } from "../services/room.service";
import type { Room } from "../types/room";
import { buildingService } from "../services/building.service";
import { equipmentService } from "../services/equipment.service";
import type { Equipment } from "../types/equipment";
import { authService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { eventService } from "../services/event.service";
import type { Event } from "../types/event";

export default function Rooms() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    eventService.getEvents().then((events: Event[]) => {
      setEvents(events);
    });

    equipmentService.getEquipments().then(async (equipments: Equipment[]) => {
      roomService.getRooms().then(async (data: Room[]) => {
        const rooms: any[] = data.map(async (room: Room) => {
          const building = await buildingService.getBuildingById(
            room.buildingId,
          );

          return {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            floor: room.floor,
            location: building.name,
            equipment: equipments
              .filter((equipment: Equipment) => {
                return equipment.roomId === room.id;
              })
              .map((equipment: Equipment) => {
                return equipment.name;
              }),
          };
        });

        Promise.all(rooms).then((data) => setRooms(data));
      });
    });
  }, []);

  const handleReserveModal = () => {
    setShowModal(true);
  };

  const handleReserve = async () => {
    eventService.createEvent({
      id: 0,
      startDate: startDate,
      endDate: endDate,
      status: "confirmed",
      comment,
      roomId: selectedRoom?.id || 0,
      userId: (await authService.getUser()).id || 0,
    });
    setShowModal(false);
  };

  return (
    <>
      <Menu />

      <div>
        <div className="border-bottom border-secondary-subtle p-3 m-2 position-relative d-flex justify-content-beetween align-items-center">
          <h1 className="fs-1 m-0">Salles</h1>
          <button
            className="btn bg-custom-login-btn fs-3 position-absolute end-0 me-3"
            onClick={handleReserveModal}
          >
            Réserver
          </button>
        </div>

        <div className="row g-4 col-11 col-md-11 mx-auto mt-4">
          {rooms.map((room) => (
            <div className="col-12 col-md-6 col-lg-4" key={room.name}>
              <RoomCard {...room} events={events} bottomVisible={true} />
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
                          htmlFor="comment"
                          className="form-label d-block text-start"
                        >
                          Commentaire
                        </label>
                        <input
                          type="text"
                          className="form-control bg-custom-login-input"
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <div className="w-100">
                        <label
                          htmlFor="start-date"
                          className="form-label d-block text-start"
                        >
                          Date de début
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control bg-custom-login-input"
                          id="start-date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder="Date"
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
                          type="datetime-local"
                          className="form-control bg-custom-login-input"
                          id="end-date"
                          placeholder="Date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>

                      <div className="w-100">
                        <label
                          htmlFor="room"
                          className="form-label d-block text-start"
                        >
                          Salle
                        </label>
                        <select
                          name="room"
                          id="room"
                          className="form-select bg-custom-login-input"
                          value={selectedRoom?.id || ""}
                          onChange={(e) => {
                            setSelectedRoom(
                              rooms.find(
                                (room: any) =>
                                  room.id === Number(e.target.value),
                              ) || null,
                            );
                          }}
                        >
                          <option value="">
                            -- Choisir une salle disponible --
                          </option>
                          {rooms.map((room: any) => {
                            const hasConflict = events.some((event: Event) => {
                              if (
                                event.roomId !== room.id ||
                                event.status == "cancelled"
                              )
                                return false;

                              const eventStart = new Date(event.startDate);
                              const eventEnd = new Date(event.endDate);

                              return (
                                eventStart < new Date(endDate) &&
                                eventEnd > new Date(startDate)
                              );
                            });

                            if (hasConflict) {
                              return null;
                            }

                            return (
                              <option key={room.id} value={room.id}>
                                {room.name} (Étage {room.floor})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer d-flex justify-content-center">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Annuler
                    </button>

                    <button
                      className="btn bg-custom-login-btn"
                      disabled={selectedRoom === null}
                      onClick={handleReserve}
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
