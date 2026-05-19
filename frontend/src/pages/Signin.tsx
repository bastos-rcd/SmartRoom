import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
export default function Signin() {
  const navigate = useNavigate();
  const handleSignin = () => {
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
        <label className="text-white align-items-center w-100" htmlFor="nom">
          Nom
        </label>
        <input
          type="text"
          placeholder="Nom"
          className="bg-custom-login-input rounded w-100 p-2 form-control"
        />
        <label className="text-white align-items-center w-100" htmlFor="prenom">
          Prénom
        </label>
        <input
          type="text"
          placeholder="Prénom"
          className="bg-custom-login-input rounded w-100 p-2 form-control"
        />
        <label className="text-white align-items-center w-100" htmlFor="email">
          E-mail
        </label>
        <input
          type="email"
          placeholder="john.doe@gmail.com"
          className="bg-custom-login-input rounded w-100 p-2 form-control"
        />
        <label
          className="text-white align-items-center w-100"
          htmlFor="password"
        >
          Mot de passe
        </label>
        <input
          type="password"
          placeholder="Mot de passe"
          className="bg-custom-login-input rounded- w-100 p-2 form-control"
        />{" "}
        <button
          onClick={handleSignin}
          type="submit"
          className="bg-custom-login-btn rounded px-5 py-2 mt-3 fs-4 text-black"
        >
          Inscrivez-vous
        </button>
      </div>
    </div>
  );
}
