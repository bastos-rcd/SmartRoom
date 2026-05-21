import { useState } from "react";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isAdmin: boolean;
};

type UserCardProps = User & {
  onDelete: () => void;
  onBlock: () => void;
};

export default function UserCard(props: UserCardProps) {
  const [isAdmin, setIsAdmin] = useState<boolean>(props.isAdmin);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const handleBlock = () => {
    setIsBlocked(!isBlocked);
  };

  const handleDelete = () => {
    setIsDeleted(!isDeleted);
  };

  const handleConfirmBlock = () => {
    props.onBlock();
    setIsBlocked(false);
  };

  const handleConfirmDelete = () => {
    props.onDelete();
    setIsDeleted(false);
  };

  return (
    <div className="card shadow-sm border bg-custom-login-btn m-2 d-flex flex-row justify-content-between align-items-center">
      <div className="d-flex flex-column gap-2 p-3">
        <h5 className="card-title fs-3 mb-0">
          {props.firstName} {props.lastName}
        </h5>
        <span className="fs-5">{props.email}</span>
        <span className="fs-5">
          Status: <span className="text-capitalize fw-bold">{props.role}</span>
        </span>
      </div>
      <div className="d-flex flex-column align-items-center justify-content-center gap-2 p-3">
        <div className="m-0 d-flex gap-2">
          <BlockIcon
            className="fs-3 btn-icon-block"
            style={{ cursor: "pointer" }}
            onClick={handleBlock}
          />
          <DeleteIcon
            className="fs-3 btn-icon-delete"
            style={{ cursor: "pointer" }}
            onClick={handleDelete}
          />
        </div>
        <div className="form-check form-switch d-flex flex-column align-items-center justify-content-center ps-0 m-0">
          <label
            className="form-check-label fs-3 mb-2"
            htmlFor="checkNativeSwitch"
          >
            Admin
          </label>
          <input
            className="form-check-input custom-switch fs-2 align-self-center m-0"
            type="checkbox"
            role="switch"
            value=""
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
            id="checkNativeSwitch"
          />
        </div>
      </div>
      {isBlocked && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            style={{ display: "block" }}
            onClick={() => setIsBlocked(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0">
                <div className="modal-header d-flex justify-content-center border-0">
                  <h1 className="modal-title fs-5">
                    Voulez-vous vraiment désactiver cet utilisateur ?
                  </h1>
                </div>
                <div className="modal-body">
                  <div className="modal-footer d-flex justify-content-center border-0">
                    <button
                      className="btn bg-custom-login-btn fs-4 text-black px-5 py-2"
                      onClick={handleConfirmBlock}
                    >
                      Désactiver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isDeleted && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            style={{ display: "block" }}
            onClick={() => setIsDeleted(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0">
                <div className="modal-header d-flex justify-content-center border-0">
                  <h1 className="modal-title fs-5">
                    Voulez-vous vraiment supprimer cet utilisateur ?
                  </h1>
                </div>
                <div className="modal-body">
                  <div className="modal-footer d-flex justify-content-center border-0">
                    <button
                      className="btn bg-custom-login-btn fs-4 text-black px-5 py-2"
                      onClick={handleConfirmDelete}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
