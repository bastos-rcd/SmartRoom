import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { authService } from "../services/auth.service";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

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
    <div className="bg-custom-login vh-100 d-flex flex-column justify-content-center align-items-center">
      <KeyboardBackspaceIcon
        onClick={() => navigate("/")}
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
            Mot de passe ou e-mail incorrect
          </span>
        )}

        <button
          type="submit"
          className="bg-custom-login-btn rounded px-5 py-2 fs-4 text-black "
          onClick={handleLogin}
        >
          Connexion
        </button>

        <div className="d-flex justify-content-end gap-2">
          <span className="text-white ">Vous n'avez pas de compte ?</span>
          <Link to="/signin" className="text-white text-decoration-none">
            Inscrivez-vous
          </Link>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <span className="text-white ">Mot de passe oublié ?</span>
          <Link to="/" className="text-white text-decoration-none">
            Réinitialisez-le
          </Link>
        </div>
      </div>
    </div>
  );
}
