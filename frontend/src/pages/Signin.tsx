import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useEffect, useState } from "react";
import { authService } from "../services/auth.service";

export default function Signin() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

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
    <div className="bg-custom-login vh-100 d-flex flex-column  justify-content-center align-items-center">
      <KeyboardBackspaceIcon
        onClick={() => navigate("/login")}
        sx={{
          fontSize: "4rem",
          color: "white",
          position: "absolute",
          top: "30px",
          left: "30px",
          cursor: "pointer",
        }}
      />

      <div className="d-flex flex-column align-items-center gap-4">
        <h1 className="text-white display-1">SmartRoom</h1>
        <h3 className="text-white">Bienvenu sur SmartRoom</h3>

        <div className="w-75">
          <label
            className="text-white align-items-center w-100 fs-5"
            htmlFor="firstName"
          >
            Prénom
          </label>
          <input
            type="text"
            placeholder="John"
            className="bg-custom-login-input rounded w-100 p-2 form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="w-75">
          <label
            className="text-white align-items-center w-100 fs-5"
            htmlFor="lastName"
          >
            Nom
          </label>
          <input
            type="text"
            placeholder="Doe"
            className="bg-custom-login-input rounded w-100 p-2 form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="w-75">
          <label
            className="text-white align-items-center w-100 fs-5"
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            type="email"
            placeholder="john.doe@gmail.com"
            className="bg-custom-login-input rounded w-100 p-2 form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-75">
          <label
            className="text-white align-items-center w-100 fs-5"
            htmlFor="password"
          >
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="Mot de passe"
            className="bg-custom-login-input rounded- w-100 p-2 form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <span className="text-danger bg-transparent w-75 align-items-end">
            Impossible d'inscrire l'utilisateur
          </span>
        )}

        <button
          type="submit"
          className="bg-custom-login-btn rounded px-5 py-2 fs-4 text-black "
          onClick={handleSignin}
        >
          Inscription
        </button>
      </div>
    </div>
  );
}
