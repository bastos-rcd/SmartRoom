import { Link, useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export default function Login() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/");
  };
  return (
    <div className="bg-custom-login vh-100 d-flex flex-column  justify-content-center align-items-center">
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
      <div className="d-flex flex-column align-items-center gap-2">
        <h1 className="text-white display-1">SmartRoom</h1>
        <h3 className="text-white">Bienvenu sur SmartRoom</h3>
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
        />
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
        />
        <a
          href=""
          className="text-white align-items-center w-100 fs-5 text-decoration-none"
        >
          Mot de passe oublié ?
        </a>
      </div>
      <button
        type="submit"
        className="bg-custom-login-btn rounded px-5 py-2 fs-4 text-black mt-3"
        onClick={handleLogin}
      >
        Connexion
      </button>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <text className="text-white ">Vous n'avez pas de compte ?</text>
        <Link to="/signin" className="text-white text-decoration-none">
          Inscrivez-vous
        </Link>
      </div>
    </div>
  );
}
