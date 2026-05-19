import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

import Menu from "../components/Menu";
import { eventService } from "../services/event.service";
import type { Event } from "../types/event";
import type { Room } from "../types/room";
import { roomService } from "../services/roomService";

export default function Home() {
  const [currentView] = useState(
    window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek",
  );
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    eventService.getEvents().then(async (data: Event[]) => {
      const reservations: any[] = data.map(async (event: Event) => {
        const room: Room = await roomService.getRoomById(event.roomId);

        return {
          title: `${room.name} : ${event.comment}`,
          start: event.startDate,
          end: event.endDate,
          backgroundColor:
            event.type === "confirmed"
              ? "#4ade80"
              : event.type === "cancelled"
                ? "#f87171"
                : "#60a5fa",
        };
      });

      Promise.all(reservations).then((data) => setEvents(data));
    });
  }, []);

  return (
    <>
      <Menu />

      <div className="container mt-4 px-2">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          locales={[frLocale]}
          locale="fr"
          headerToolbar={{
            left:
              window.innerWidth < 768
                ? "timeGridWeek,timeGridDay"
                : "dayGridMonth,timeGridWeek,timeGridDay",
            center: window.innerWidth < 768 ? "" : "title",
            right:
              window.innerWidth < 768 ? "prev,today,next" : "prev,today,next",
          }}
          handleWindowResize={true}
          windowResizeDelay={100}
          height={"85vh"}
          aspectRatio={window.innerWidth < 768 ? 0.7 : 1.35}
          events={events}
        />
      </div>
    </>
  );
}
