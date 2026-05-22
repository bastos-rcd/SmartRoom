import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { authService } from "../services/auth.service";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      setError(true);
      return;
    }

    authService
      .login(email, password)
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3 position-relative" style={{ backgroundColor: "#0e172a" }}>
      <div className="position-absolute" style={{ top: "24px", left: "24px" }}>
        <button
          type="button"
          className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "48px", height: "48px", transition: "all 0.25s ease" }}
          onClick={() => navigate("/")}
          title="Retour à l'accueil"
        >
          <KeyboardBackspaceIcon sx={{ fontSize: "1.8rem" }} />
        </button>
      </div>

      <div className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 d-flex flex-column gap-2" style={{ maxWidth: "440px", width: "100%", backgroundColor: "rgba(30, 41, 59, 0.75)", backdropFilter: "blur(16px)" }}>
        <div className="text-center mb-3">
          <h1 className="text-white display-4 mb-1 fw-bold">SmartRoom</h1>
          <h5 className="text-white-50 fw-light fs-6">Bienvenue sur votre espace</h5>
        </div>
        <div className="w-100 mb-2 text-start">
          <label
            className="text-white-50 fs-7 mb-1 fw-semibold text-uppercase"
            style={{ letterSpacing: "0.8px" }}
            htmlFor="email"
          >
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="john.doe@gmail.com"
            className="form-control bg-white bg-opacity-10 border-white border-opacity-10 text-white rounded-3 p-3 shadow-none"
            style={{ color: "#ffffff" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-100 mb-2 text-start">
          <label
            className="text-white-50 fs-7 mb-1 fw-semibold text-uppercase"
            style={{ letterSpacing: "0.8px" }}
            htmlFor="password"
          >
            Mot de passe
          </label>
          <div className="position-relative w-100">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="form-control bg-white bg-opacity-10 border-white border-opacity-10 text-white rounded-3 p-3 shadow-none"
              style={{ paddingRight: "40px", color: "#ffffff" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent text-white-50 pe-3 d-flex align-items-center"
              style={{ cursor: "pointer", zIndex: 5 }}
            >
              {showPassword ? (
                <VisibilityOffIcon sx={{ fontSize: "1.3rem" }} />
              ) : (
                <VisibilityIcon sx={{ fontSize: "1.3rem" }} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-danger bg-transparent w-100 text-center py-1 fs-6 fw-semibold">
            Mot de passe ou e-mail incorrect
          </div>
        )}

        <button
          type="submit"
          className="btn btn-success w-100 py-3 mt-3 fs-5 fw-bold text-dark rounded-3"
          style={{ backgroundColor: "#22c55e", borderColor: "#22c55e" }}
          onClick={handleLogin}
        >
          Se connecter
        </button>

        <div className="mt-3 pt-3 border-top border-white border-opacity-10 d-flex flex-column gap-1 text-center">
          <div className="fs-6 text-white-50">
            Vous n'avez pas de compte ?{" "}
            <Link to="/signin" className="text-success text-decoration-none fw-semibold ms-1" style={{ color: "#4ade80" }}>
              Inscrivez-vous
            </Link>
          </div>
          <div>
            <Link to="/" className="text-white-50 text-decoration-none fs-6">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}