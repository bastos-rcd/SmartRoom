import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = () => {
    navigate("/login");
  };

  const [account, setAccount] = useState(true);
  const [admin, setAdmin] = useState(true);
  return (
    <nav className="navbar navbar-dark bg-custom-login fixed-lat z-1000">
      <div className="container-fluid">
        <button
          className="navbar-toggler border-0 shadow-none d-flex align-items-center justify-content-center"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <img src="/logo-mobile.png" alt="Logo" height="60px" />
        </button>
        {!account ? (
          <button
            type="submit"
            className="bg-custom-login-btn rounded px-5 py-2 fs-4 text-black ms-auto me-4"
            onClick={handleLogin}
          >
            Connexion
          </button>
        ) : (
          <div>
            <text className="fs-4 text-white ms-auto me-4">Nom - Prénom</text>
          </div>
        )}
        <div
          className="offcanvas offcanvas-start text-white vh-100"
          style={{ backgroundColor: "#1a233a", width: "350px" }}
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header d-flex justify-content-center">
            <img src="/logo-desktop.png" alt="Logo" height={"150px"} />
          </div>
          <div className="offcanvas-body d-flex flex-column align-items-center justify-content-between">
            <ul className="navbar-nav text-center py-4 w-100 gap-3">
              {!account ? (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      aria-current="page"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/")}
                    >
                      Tableau de bord
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/rooms")}
                    >
                      Salles
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      aria-current="page"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/")}
                    >
                      Tableau de bord
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/rooms")}
                    >
                      Salles
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/reservations")}
                    >
                      Mes réservations
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link fs-4"
                      data-bs-dismiss="offcanvas"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/account")}
                    >
                      Mon compte
                    </a>
                  </li>
                  {admin && (
                    <>
                      <li className="nav-item">
                        <a
                          className="nav-link fs-4"
                          data-bs-dismiss="offcanvas"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/users")}
                        >
                          Gérer les utilisateurs
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link fs-4"
                          style={{ cursor: "pointer" }}
                          data-bs-dismiss="offcanvas"
                          onClick={() => navigate("/manage-rooms")}
                        >
                          Gérer les salles
                        </a>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
            <div className="d-flex justify-content-center">
              {account ? (
                <button
                  type="submit"
                  className="bg-custom-login-btn rounded px-5 py-2 mt-3 fs-4 text-black"
                  onClick={handleLogout}
                  data-bs-dismiss="offcanvas"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-custom-login-btn rounded px-5 py-2 mt-3 fs-4 text-black"
                  onClick={handleLogin}
                  data-bs-dismiss="offcanvas"
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
