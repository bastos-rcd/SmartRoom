import Menu from "../components/Menu";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

const events = [
  {
    title: "My event",
    start: "2024-11-13",
    end: "2024-11-13",
    allDay: true,
  },
];

export default function Home() {
  return (
    <>
      <Menu />

      <div className="col-10 col-md-10 mx-auto mt-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locales={[frLocale]}
          locale="fr"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={"85vh"}
          events={events}
        />
      </div>
    </>
  );
}
