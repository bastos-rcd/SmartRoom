import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import { authService } from "../services/auth.service";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Menu from "../components/Menu";
import EditNoteIcon from "@mui/icons-material/EditNote";
import type { Request } from "../types/request";
import RequestCard from "../components/RequestCard";

export default function Request() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [formSaving, setFormSaving] = useState<boolean>(false);
  const [request, setRequest] = useState<Request | null>(null);
  const [activeTab, setActiveTab] = useState<string>("current");

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(""), 4000);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const initData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate("/login");
          return;
        }

        const currentUser = await authService.getUser();

        setUser(currentUser);
        setFirstName(currentUser.firstName);
        setLastName(currentUser.lastName);
      } catch (err) {
        console.error(err);
        showError("Impossible de charger vos données.");
        if (!authService.isAuthenticated()) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [navigate]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !request?.description?.trim() ||
      !request?.type?.trim()
    ) {
      showError("Tous les champs sont requis.");
      return;
    }

    setFormSaving(true);
    try {
      const updateData: Partial<Request> = {
        type: request?.type || "request",
        description: request?.description || "",
      };

      showSuccess("Demande envoyée avec succès!");
    } catch (err) {
      console.error(err);
      showError("Erreur lors de l'envoi de la demande.");
    } finally {
      setFormSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <div
          className="spinner-border text-emerald"
          role="status"
          style={{ width: "3rem", height: "3rem", color: "#10b981" }}
        >
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const data: Request[] = [
    {
      id: 1,
      type: "incident",
      description: "Problème de connexion au Wi-Fi dans la salle de réunion.",
      status: 0,
      creationDate: new Date("2024-06-01T10:30:00"),
      userId: 2,
    },
    {
      id: 2,
      type: "request",
      description:
        "Demande d'ajout d'un projecteur dans la salle de conférence principale.",
      status: 1,
      creationDate: new Date("2024-06-02T14:45:00"),
      userId: 1,
    },
    {
      id: 3,
      type: "incident",
      description:
        "La climatisation ne fonctionne pas correctement dans la salle de formation.",
      status: 1,
      creationDate: new Date("2024-06-03T09:15:00"),
      userId: 2,
    },
  ];

  const filteredRequests = data.filter((item) =>
    activeTab === "current" ? item.status === 1 : item.status === 0,
  );

  return (
    <>
      <Menu />
      <div
        className="container-fluid py-4 px-3 px-md-5"
        style={{ backgroundColor: "#f8fafc" }}
      >
        {isMobile && mobileOpen && (
          <div
            className="menu-mobile-overlay"
            onClick={() => setMobileOpen(false)}
            style={{ zIndex: 1040 }}
          />
        )}
        <div>
          {user?.role !== "admin" ? (
            <div className="container-fluid" style={{ maxWidth: "800px" }}>
              <div className="tab-content animate-fade-in">
                <div className="bg-white rounded-4 shadow-sm border border-light-subtle p-4 p-md-5">
                  <div className="border-bottom pb-3 mb-4">
                    <h2 className="h4 text-dark fw-bold m-0 d-flex align-items-center gap-2">
                      <EditNoteIcon sx={{ color: "#10b981" }} />
                      Faire une demande
                    </h2>
                    <p className="text-secondary small m-0 mt-1">
                      Soumettez une demande à notre équipe pour toute question
                      ou assistance concernant nos services. Nous sommes là pour
                      vous aider et répondre à vos besoins.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSaveInfo}
                    className="d-flex flex-column gap-3"
                  >
                    <div className="row g-3">
                      <div className="col-12 col-md-6 text-start">
                        <label
                          className="form-label small fw-bold text-secondary text-uppercase mb-1"
                          htmlFor="firstName"
                        >
                          Prénom
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          required
                        />
                      </div>

                      <div className="col-12 col-md-6 text-start">
                        <label
                          className="form-label small fw-bold text-secondary text-uppercase mb-1"
                          htmlFor="lastName"
                        >
                          Nom
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="text-start">
                      <label
                        className="form-label small fw-bold text-secondary text-uppercase mb-1"
                        htmlFor="email"
                      >
                        Type de demande
                      </label>
                      <select
                        id="requestType"
                        className="form-select rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
                        aria-label="Type de demande"
                        value={request?.type}
                        onChange={(e) =>
                          setRequest({
                            ...request,
                            type: e.target.value,
                          } as Request)
                        }
                        required
                      >
                        <option value="">
                          Sélectionnez un type de demande
                        </option>
                        <option value="incident">Incident</option>
                        <option value="request">Demande</option>
                      </select>
                    </div>
                    <div className="text-start">
                      <div className="position-relative w-100">
                        <textarea
                          id="comment"
                          className="form-control rounded-3 p-3 bg-light border-light-subtle focus-emerald shadow-none"
                          style={{
                            minHeight: "140px",
                            maxHeight: "240px",
                            resize: "vertical",
                          }}
                          value={request?.description}
                          onChange={(e) =>
                            setRequest({
                              ...request,
                              description: e.target.value,
                            } as Request)
                          }
                          placeholder="Décrivez votre demande ou incident en détail..."
                          required
                        />
                      </div>
                    </div>

                    <div className="text-end mt-4 pt-2 border-top border-light-subtle">
                      <button
                        type="submit"
                        disabled={formSaving}
                        className="btn btn-emerald rounded-pill px-5 py-3 fw-bold shadow-sm w-100 w-sm-auto"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {formSaving ? "Envoi..." : "Envoyer la demande"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h1 className="display-5 text-dark fw-bold mb-2">
                  Mes demandes
                </h1>
              </div>
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
                    Résolues
                  </button>
                </div>
              </div>
              {filteredRequests.length === 0 && (
                <div className="text-center py-5">
                  <h3 className="h5 text-secondary">Aucune demande trouvée.</h3>
                  <p className="text-secondary small mt-2">
                    {activeTab === "current"
                      ? "Les demandes en cours apparaîtront ici."
                      : "Les demandes passées apparaîtront ici."}
                  </p>
                </div>
              )}
              <div className="row g-4 mb-5">
                {filteredRequests.map((request) => (
                  <div
                    className="col-12 col-md-6 col-lg-4 d-flex"
                    key={request.id}
                  >
                    <RequestCard
                      {...request}
                      type={request.type as "incident" | "request"}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {successToast && (
          <div
            className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-success-subtle animate-toast"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(8px)",
              zIndex: 9999,
              minWidth: "280px",
              maxWidth: "calc(100vw - 32px)",
            }}
          >
            <CheckCircleIcon sx={{ color: "#4ade80", fontSize: "1.8rem" }} />
            <div className="text-start">
              <h6
                className="m-0 fw-semibold text-success"
                style={{ color: "#4ade80" }}
              >
                Succès
              </h6>
              <small className="text-white-50">{successToast}</small>
            </div>
          </div>
        )}
        {errorToast && (
          <div
            className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-danger-subtle animate-toast"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(8px)",
              zIndex: 9999,
              minWidth: "280px",
              maxWidth: "calc(100vw - 32px)",
            }}
          >
            <ErrorIcon sx={{ color: "#f87171", fontSize: "1.8rem" }} />
            <div className="text-start">
              <h6
                className="m-0 fw-semibold text-danger"
                style={{ color: "#f87171" }}
              >
                Erreur
              </h6>
              <small className="text-white-50">{errorToast}</small>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
