import { Link, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { authService } from "../services/auth.service";

export default function Signin() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignin = () => {
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      setError(true);
      return;
    }

    authService
      .register(firstName, lastName, email, password)
      .then(() => {
        navigate("/login");
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
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3 position-relative"
      style={{ backgroundColor: "#0e172a" }}
    >
      <div className="position-absolute" style={{ top: "24px", left: "24px" }}>
        <button
          type="button"
          className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "48px",
            height: "48px",
            transition: "all 0.25s ease",
          }}
          onClick={() => navigate("/login")}
          title="Retour à la connexion"
        >
          <KeyboardBackspaceIcon sx={{ fontSize: "1.8rem" }} />
        </button>
      </div>

      <div
        className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 d-flex flex-column gap-2"
        style={{
          maxWidth: "440px",
          width: "100%",
          backgroundColor: "rgba(30, 41, 59, 0.75)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="text-center mb-3">
          <h1 className="text-white display-4 mb-1 fw-bold">SmartRoom</h1>
          <h5 className="text-white-50 fw-light fs-6">
            Créer un nouveau compte
          </h5>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-12 col-md-6 text-start">
            <label
              className="text-white-50 fs-7 mb-1 fw-semibold text-uppercase"
              style={{ letterSpacing: "0.8px" }}
              htmlFor="firstName"
            >
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              className="form-control bg-white bg-opacity-10 border-white border-opacity-10 text-white rounded-3 p-3 shadow-none"
              style={{ color: "#ffffff" }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6 text-start">
            <label
              className="text-white-50 fs-7 mb-1 fw-semibold text-uppercase"
              style={{ letterSpacing: "0.8px" }}
              htmlFor="lastName"
            >
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="form-control bg-white bg-opacity-10 border-white border-opacity-10 text-white rounded-3 p-3 shadow-none"
              style={{ color: "#ffffff" }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
            Impossible d'inscrire l'utilisateur
          </div>
        )}

        <button
          type="submit"
          className="btn btn-success w-100 py-3 mt-3 fs-5 fw-bold text-dark rounded-3"
          style={{ backgroundColor: "#22c55e", borderColor: "#22c55e" }}
          onClick={handleSignin}
        >
          S'inscrire
        </button>

        <div className="mt-3 pt-3 border-top border-white border-opacity-10 text-center">
          <div className="fs-6 text-white-50">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-success text-decoration-none fw-semibold ms-1"
              style={{ color: "#4ade80" }}
            >
              Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
