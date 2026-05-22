import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { authService } from "../services/auth.service";
import { eventService } from "../services/event.service";
import { roomService } from "../services/room.service";
import { buildingService } from "../services/building.service";

import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BusinessIcon from "@mui/icons-material/Business";

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    utilizationRate: 0,
    popularRoomName: "N/A",
    popularRoomCount: 0,
    morningCount: 0,
    afternoonCount: 0,
  });

  const [roomStats, setRoomStats] = useState<
    { roomName: string; count: number }[]
  >([]);
  const [buildingStats, setBuildingStats] = useState<
    { bName: string; count: number }[]
  >([]);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      try {
        if (!authService.isAuthenticated()) {
          navigate("/login");
          return;
        }

        const currentUser = await authService.getUser();
        if (currentUser.role !== "admin") {
          navigate("/");
          return;
        }

        const [eList, rList, bList] = await Promise.all([
          eventService.getEvents(),
          roomService.getRooms(),
          buildingService.getBuildings(),
        ]);

        const totalEvents = eList || [];
        const totalRooms = rList || [];
        const totalBuildings = bList || [];

        // 1. Status Splits
        const confirmed = totalEvents.filter(
          (e) => e.status === "confirmed",
        ).length;
        const cancelled = totalEvents.filter(
          (e) => e.status === "cancelled",
        ).length;

        const roomCounts: Record<number, number> = {};
        totalEvents.forEach((e) => {
          if (e.status !== "cancelled") {
            roomCounts[e.roomId] = (roomCounts[e.roomId] || 0) + 1;
          }
        });

        let popularId = -1;
        let maxBookings = 0;
        Object.entries(roomCounts).forEach(([rId, count]) => {
          if (count > maxBookings) {
            maxBookings = count;
            popularId = Number(rId);
          }
        });

        const popularRoom = totalRooms.find((r) => r.id === popularId);
        const popularRoomName = popularRoom ? popularRoom.name : "Aucune";

        let morningCount = 0;
        let afternoonCount = 0;
        totalEvents.forEach((e) => {
          if (e.startDate) {
            const startHour = new Date(
              e.startDate.toString().replace(" ", "T"),
            ).getHours();
            if (startHour < 12) {
              morningCount++;
            } else {
              afternoonCount++;
            }
          }
        });

        const uniquelyBookedRooms = Object.keys(roomCounts).length;
        const utilizationRate =
          totalRooms.length > 0
            ? Math.round((uniquelyBookedRooms / totalRooms.length) * 100)
            : 0;

        setStats({
          total: totalEvents.length,
          confirmed,
          cancelled,
          utilizationRate,
          popularRoomName,
          popularRoomCount: maxBookings,
          morningCount,
          afternoonCount,
        });

        const roomBreakdown = totalRooms
          .map((r) => ({
            roomName: r.name,
            count: roomCounts[r.id] || 0,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setRoomStats(roomBreakdown);

        const buildingCounts: Record<number, number> = {};
        totalEvents.forEach((e) => {
          const roomObj = totalRooms.find((r) => r.id === e.roomId);
          if (roomObj && e.status !== "cancelled") {
            buildingCounts[roomObj.buildingId] =
              (buildingCounts[roomObj.buildingId] || 0) + 1;
          }
        });

        const buildingBreakdown = totalBuildings.map((b) => ({
          bName: b.name,
          count: buildingCounts[b.id] || 0,
        }));

        setBuildingStats(buildingBreakdown);
      } catch (err) {
        console.error("Failed to compile reservation analytics", err);
        if (!authService.isAuthenticated()) {
          navigate("/login");
        } else {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [navigate]);

  // Compute helper percentages
  const confirmedPct =
    stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;
  const cancelledPct =
    stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0;

  const morningPct =
    stats.total > 0 ? Math.round((stats.morningCount / stats.total) * 100) : 0;
  const afternoonPct =
    stats.total > 0
      ? Math.round((stats.afternoonCount / stats.total) * 100)
      : 0;

  return (
    <>
      <Menu />

      <div className="container-fluid py-4 px-3 px-md-5">
        <div className="mb-4 text-center text-md-start">
          <h1 className="display-6 text-dark fw-bold mb-1">
            Analyses & Statistiques
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Calcul des données...</span>
            </div>
            <p className="text-muted mt-3 small">
              Compilation des statistiques de réservation...
            </p>
          </div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary d-flex align-items-center justify-content-center">
                      <CalendarMonthIcon sx={{ fontSize: "2rem" }} />
                    </div>
                    <div>
                      <span className="small text-secondary fw-bold text-uppercase d-block mb-1">
                        Réservations
                      </span>
                      <h3 className="fw-bold text-dark mb-0">{stats.total}</h3>
                      <small className="text-success fw-semibold">
                        {stats.confirmed} confirmées
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success d-flex align-items-center justify-content-center">
                      <BarChartIcon sx={{ fontSize: "2rem" }} />
                    </div>
                    <div>
                      <span className="small text-secondary fw-bold text-uppercase d-block mb-1">
                        Taux d'occupation
                      </span>
                      <h3 className="fw-bold text-dark mb-0">
                        {stats.utilizationRate}%
                      </h3>
                      <small className="text-secondary fw-semibold">
                        salles réservées au moins une fois
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning d-flex align-items-center justify-content-center">
                      <MeetingRoomIcon sx={{ fontSize: "2rem" }} />
                    </div>
                    <div>
                      <span className="small text-secondary fw-bold text-uppercase d-block mb-1">
                        Espace Favori
                      </span>
                      <h4
                        className="fw-bold text-dark mb-0 text-truncate"
                        style={{ maxWidth: "160px" }}
                      >
                        {stats.popularRoomName}
                      </h4>
                      <small className="text-secondary fw-semibold">
                        {stats.popularRoomCount} réservations validées
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info d-flex align-items-center justify-content-center">
                      <AccessTimeIcon sx={{ fontSize: "2rem" }} />
                    </div>
                    <div>
                      <span className="small text-secondary fw-bold text-uppercase d-block mb-1">
                        Période d'Affluence
                      </span>
                      <h3 className="fw-bold text-dark mb-0">
                        {stats.afternoonCount >= stats.morningCount
                          ? "Après-midi"
                          : "Matin"}
                      </h3>
                      <small className="text-secondary fw-semibold">
                        Busiest: {Math.max(morningPct, afternoonPct)}% des
                        créneaux
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mt-2">
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                  <h5 className="fw-bold text-dark mb-3">
                    Répartition des Réservations
                  </h5>

                  <div className="mb-4">
                    <label className="small text-secondary fw-bold text-uppercase mb-2 d-block">
                      États des bookings
                    </label>
                    <div
                      className="progress rounded-pill shadow-inner"
                      style={{ height: "30px" }}
                    >
                      {stats.confirmed > 0 && (
                        <div
                          className="progress-bar bg-success fw-bold text-white d-flex align-items-center justify-content-center fs-7"
                          style={{ width: `${confirmedPct}%` }}
                          title={`Confirmé: ${stats.confirmed}`}
                        >
                          {confirmedPct}%
                        </div>
                      )}
                      {stats.cancelled > 0 && (
                        <div
                          className="progress-bar bg-danger fw-bold text-white d-flex align-items-center justify-content-center fs-7"
                          style={{ width: `${cancelledPct}%` }}
                          title={`Annulé: ${stats.cancelled}`}
                        >
                          {cancelledPct}%
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-around mt-3 flex-wrap gap-2 text-center">
                      <div className="small">
                        <span
                          className="badge bg-success rounded-circle me-1"
                          style={{
                            width: "10px",
                            height: "10px",
                            display: "inline-block",
                          }}
                        ></span>
                        <strong className="text-dark">Confirmées :</strong>{" "}
                        {stats.confirmed} ({confirmedPct}%)
                      </div>
                      <div className="small">
                        <span
                          className="badge bg-danger rounded-circle me-1"
                          style={{
                            width: "10px",
                            height: "10px",
                            display: "inline-block",
                          }}
                        ></span>
                        <strong className="text-dark">Annulées :</strong>{" "}
                        {stats.cancelled} ({cancelledPct}%)
                      </div>
                    </div>
                  </div>

                  <hr className="text-black-50 my-4" />

                  <div>
                    <h5 className="fw-bold text-dark mb-3">
                      Plage Horaire la Plus Sollicitée
                    </h5>
                    <div className="d-flex flex-column gap-3">
                      <div>
                        <div className="d-flex justify-content-between mb-1 small">
                          <span className="fw-semibold text-secondary">
                            Matin (7h - 12h)
                          </span>
                          <span className="fw-bold text-dark">
                            {stats.morningCount} réservations ({morningPct}%)
                          </span>
                        </div>
                        <div
                          className="progress rounded-pill"
                          style={{ height: "10px" }}
                        >
                          <div
                            className="progress-bar bg-primary"
                            style={{ width: `${morningPct}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between mb-1 small">
                          <span className="fw-semibold text-secondary">
                            Après-midi (12h - 20h)
                          </span>
                          <span className="fw-bold text-dark">
                            {stats.afternoonCount} réservations ({afternoonPct}
                            %)
                          </span>
                        </div>
                        <div
                          className="progress rounded-pill"
                          style={{ height: "10px" }}
                        >
                          <div
                            className="progress-bar bg-info"
                            style={{ width: `${afternoonPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                  <h5 className="fw-bold text-dark mb-1">
                    Top 5 des Salles les Plus Réservées
                  </h5>
                  <p className="small text-secondary mb-4">
                    Volume total d'heures et de réservations validées
                  </p>

                  {roomStats.length === 0 ? (
                    <div className="text-center py-5 border border-dashed rounded-4 my-auto">
                      <p className="text-muted mb-0 small">
                        Aucune réservation active pour le moment.
                      </p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3 my-auto">
                      {roomStats.map((r, idx) => {
                        const maxCount = Math.max(
                          ...roomStats.map((item) => item.count),
                          1,
                        );
                        const progressPct = Math.round(
                          (r.count / maxCount) * 100,
                        );

                        return (
                          <div
                            key={r.roomName}
                            className="d-flex align-items-center gap-3"
                          >
                            <div
                              className="rounded-circle bg-slate text-white d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: "32px",
                                height: "32px",
                                flexShrink: 0,
                                fontSize: "0.85rem",
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between mb-1 small">
                                <span className="fw-bold text-dark">
                                  {r.roomName}
                                </span>
                                <span className="fw-semibold text-secondary">
                                  {r.count} réservations
                                </span>
                              </div>
                              <div
                                className="progress rounded-pill"
                                style={{ height: "12px" }}
                              >
                                <div
                                  className="progress-bar"
                                  style={{
                                    width: `${progressPct}%`,
                                    background:
                                      "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                  <h5 className="fw-bold text-dark mb-1">
                    Réservations par Bâtiment
                  </h5>
                  <p className="small text-secondary mb-4">
                    Densité d'occupation par infrastructure de l'entreprise
                  </p>

                  <div className="row g-3">
                    {buildingStats.map((b) => {
                      const totalBookings = stats.total - stats.cancelled;
                      const buildingPct =
                        totalBookings > 0
                          ? Math.round((b.count / totalBookings) * 100)
                          : 0;

                      return (
                        <div key={b.bName} className="col-12 col-md-6 col-lg-4">
                          <div className="border border-light-subtle rounded-3 p-3 bg-light bg-opacity-25 h-100">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <BusinessIcon
                                  sx={{ color: "#10b981", fontSize: "1.5rem" }}
                                />
                                <h6 className="fw-bold text-dark mb-0">
                                  {b.bName}
                                </h6>
                              </div>
                              <span className="badge bg-slate rounded-pill text-white fw-bold">
                                {b.count} bookings
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                              <div className="flex-grow-1">
                                <div
                                  className="progress rounded-pill"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: `${buildingPct}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="small fw-bold text-secondary">
                                {buildingPct}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
