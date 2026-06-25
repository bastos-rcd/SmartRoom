export const USER_SERVICE = 'USER_SERVICE'
export const UserMessages = {
	FIND_ALL_USERS: { cmd: 'get_all_users' },
	FIND_BY_EMAIL: { cmd: 'get_user_by_email' },
	FIND_ONE_USER: { cmd: 'get_user_by_id' },
	CREATE_USER: { cmd: 'create_user' },
	UPDATE_USER: { cmd: 'update_user' },
	DELETE_USER: { cmd: 'delete_user' },
}

export const BUILDING_SERVICE = 'BUILDING_SERVICE'
export const BuildingMessages = {
	FIND_ALL_BUILDINGS: { cmd: 'get_all_buildings' },
	FIND_ONE_BUILDING: { cmd: 'get_building_by_id' },
	CREATE_BUILDING: { cmd: 'create_building' },
	UPDATE_BUILDING: { cmd: 'update_building' },
	DELETE_BUILDING: { cmd: 'delete_building' },
}

export const ROOM_SERVICE = 'ROOM_SERVICE'
export const RoomMessages = {
	FIND_ALL_ROOMS: { cmd: 'get_all_rooms' },
	FIND_ONE_ROOM: { cmd: 'get_room_by_id' },
	CREATE_ROOM: { cmd: 'create_room' },
	UPDATE_ROOM: { cmd: 'update_room' },
	DELETE_ROOM: { cmd: 'delete_room' },
}

export const EQUIPMENT_SERVICE = 'EQUIPMENT_SERVICE'
export const EquipmentMessages = {
	FIND_ALL_EQUIPMENTS: { cmd: 'get_all_equipments' },
	FIND_ONE_EQUIPMENT: { cmd: 'get_equipment_by_id' },
	CREATE_EQUIPMENT: { cmd: 'create_equipment' },
	UPDATE_EQUIPMENT: { cmd: 'update_equipment' },
	DELETE_EQUIPMENT: { cmd: 'delete_equipment' },
}

export const RESERVATION_SERVICE = 'RESERVATION_SERVICE'
export const ReservationMessages = {
	FIND_ALL_RESERVATIONS: { cmd: 'get_all_reservations' },
	FIND_ONE_RESERVATION: { cmd: 'get_reservation_by_id' },
	CREATE_RESERVATION: { cmd: 'create_reservation' },
	UPDATE_RESERVATION: { cmd: 'update_reservation' },
	DELETE_RESERVATION: { cmd: 'delete_reservation' },
}

export const REQUEST_SERVICE = 'REQUEST_SERVICE'
export const RequestMessages = {
	FIND_ALL_REQUESTS: { cmd: 'get_all_requests' },
	FIND_ONE_REQUEST: { cmd: 'get_request_by_id' },
	CREATE_REQUEST: { cmd: 'create_request' },
	UPDATE_REQUEST: { cmd: 'update_request' },
	DELETE_REQUEST: { cmd: 'delete_request' },
}

export const PARAMETER_SERVICE = 'PARAMETER_SERVICE'
export const ParameterMessages = {
	FIND_ALL_PARAMETERS: { cmd: 'get_all_parameters' },
	FIND_ONE_PARAMETER: { cmd: 'get_parameter_by_id' },
	CREATE_PARAMETER: { cmd: 'create_parameter' },
	UPDATE_PARAMETER: { cmd: 'update_parameter' },
	DELETE_PARAMETER: { cmd: 'delete_parameter' },
}
