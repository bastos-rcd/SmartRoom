export const USER_SERVICE = "USER_SERVICE";
export const RESERVATION_SERVICE = "RESERVATION_SERVICE";
export const REQUEST_SERVICE = "REQUEST_SERVICE";
export const PARAMETER_SERVICE = "PARAMETER_SERVICE";

export const UserMessages = {
  FIND_ALL_USERS: { cmd: "get_all_users" },
  FIND_ONE_USER: { cmd: "get_user_by_id" },
  CREATE_USER: { cmd: "create_user" },
  UPDATE_USER: { cmd: "update_user" },
  DELETE_USER: { cmd: "delete_user" },
};

export const ReservationMessages = {
  FIND_ALL_RESERVATIONS: { cmd: "get_all_reservations" },
  FIND_ONE_RESERVATION: { cmd: "get_reservation_by_id" },
  CREATE_RESERVATION: { cmd: "create_reservation" },
  UPDATE_RESERVATION: { cmd: "update_reservation" },
  DELETE_RESERVATION: { cmd: "delete_reservation" },
};

export const RequestMessages = {
  FIND_ALL_REQUESTS: { cmd: "get_all_requests" },
  FIND_ONE_REQUEST: { cmd: "get_request_by_id" },
  CREATE_REQUEST: { cmd: "create_request" },
  UPDATE_REQUEST: { cmd: "update_request" },
  DELETE_REQUEST: { cmd: "delete_request" },
};

export const ParameterMessages = {
  FIND_ALL_PARAMETERS: { cmd: "get_all_parameters" },
  FIND_ONE_PARAMETER: { cmd: "get_parameter_by_id" },
  CREATE_PARAMETER: { cmd: "create_parameter" },
  UPDATE_PARAMETER: { cmd: "update_parameter" },
  DELETE_PARAMETER: { cmd: "delete_parameter" },
};
