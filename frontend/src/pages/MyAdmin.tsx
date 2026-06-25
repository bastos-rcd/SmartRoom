import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Menu from '../components/Menu'
import { buildingService } from '../services/building.service'
import { roomService } from '../services/room.service'
import { equipmentService } from '../services/equipment.service'

import type { Building } from '../types/building'
import type { Room } from '../types/room'
import type { Equipment } from '../types/equipment'

import BusinessIcon from '@mui/icons-material/Business'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import BuildIcon from '@mui/icons-material/Build'
import { authService } from '../services/auth.service'

export default function ManageRooms() {
	const navigate = useNavigate()

	const [deleteBuilding, setDeleteBuilding] = useState<boolean>(false)
	const [deleteRoom, setDeleteRoom] = useState<boolean>(false)
	const [deleteEquipment, setDeleteEquipment] = useState<boolean>(false)

	const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
		null,
	)
	const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
	const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
		null,
	)

	const [buildings, setBuildings] = useState<Building[]>([])
	const [rooms, setRooms] = useState<Room[]>([])
	const [equipments, setEquipments] = useState<Equipment[]>([])

	const [loading, setLoading] = useState(true)
	const [successMsg, setSuccessMsg] = useState('')
	const [errorMsg, setErrorMsg] = useState('')

	// Tree toggles (using building / room IDs)
	const [expandedBuildings, setExpandedBuildings] = useState<
		Record<number, boolean>
	>({})
	const [expandedRooms, setExpandedRooms] = useState<Record<number, boolean>>(
		{},
	)

	const [buildingForm, setBuildingForm] = useState({
		name: '',
		address: '',
		nbFloors: 1,
	})

	const [roomForm, setRoomForm] = useState({
		name: '',
		capacity: 10,
		floor: 1,
		location: '',
		buildingId: '',
	})

	const [equipmentForm, setEquipmentForm] = useState({
		name: '',
		type: 'informatique',
		roomId: '',
	})

	const fetchData = async () => {
		setLoading(true)
		try {
			const [bList, rList, eList] = await Promise.all([
				buildingService.getBuildings(),
				roomService.getRooms(),
				equipmentService.getEquipments(),
			])
			setBuildings(bList || [])
			setRooms(rList || [])
			setEquipments(eList || [])

			if (bList && bList.length > 0) {
				setExpandedBuildings((prev) => ({ ...prev, [bList[0].id]: true }))
			}
		} catch (err) {
			console.error('Failed to load admin data', err)
			setErrorMsg(
				"Erreur lors de la récupération des données de l'établissement.",
			)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const initAdmin = async () => {
			try {
				if (!authService.isAuthenticated()) {
					navigate('/login')
					return
				}

				const currentUser = await authService.getUser()
				if (currentUser.role !== 'admin') {
					navigate('/')
					return
				}

				await fetchData()
			} catch (err) {
				console.error(err)
				if (!authService.isAuthenticated()) {
					navigate('/login')
				} else {
					navigate('/')
				}
			}
		}

		initAdmin()
	}, [navigate])

	const handleAddBuilding = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!buildingForm.name.trim() || !buildingForm.address.trim()) {
			setErrorMsg('Veuillez remplir tous les champs du bâtiment.')
			return
		}

		try {
			await buildingService.createBuilding({
				name: buildingForm.name,
				address: buildingForm.address,
				nbFloors: Number(buildingForm.nbFloors),
			})
			setBuildingForm({ name: '', address: '', nbFloors: 1 })
			setSuccessMsg('Bâtiment ajouté avec succès !')
			setErrorMsg('')
			fetchData()
		} catch (err) {
			console.error(err)
			setErrorMsg("Impossible d'ajouter le bâtiment.")
		}
	}

	const handleAddRoom = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!roomForm.name.trim() || !roomForm.buildingId) {
			setErrorMsg('Veuillez remplir le nom et choisir un bâtiment.')
			return
		}

		try {
			await roomService.createRoom({
				name: roomForm.name,
				capacity: Number(roomForm.capacity),
				floor: Number(roomForm.floor),
				state: 1,
				location: roomForm.location,
				buildingId: Number(roomForm.buildingId),
			})
			setRoomForm({
				name: '',
				capacity: 10,
				floor: 1,
				location: '',
				buildingId: roomForm.buildingId,
			})
			setSuccessMsg('Salle affiliée avec succès !')
			setErrorMsg('')
			fetchData()
		} catch (err) {
			console.error(err)
			setErrorMsg("Impossible d'affilier la salle.")
		}
	}

	const handleAddEquipment = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!equipmentForm.name.trim() || !equipmentForm.roomId) {
			setErrorMsg(
				"Veuillez renseigner le nom de l'équipement et choisir une salle.",
			)
			return
		}

		try {
			await equipmentService.createEquipment({
				name: equipmentForm.name,
				type: equipmentForm.type,
				available: 1,
				roomId: Number(equipmentForm.roomId),
			})
			setEquipmentForm({
				name: '',
				type: 'informatique',
				roomId: equipmentForm.roomId,
			})
			setSuccessMsg('Équipement assigné avec succès !')
			setErrorMsg('')
			fetchData()
		} catch (err) {
			console.error(err)
			setErrorMsg("Impossible d'assigner l'équipement.")
		}
	}

	const toggleBuilding = (id: number) => {
		setExpandedBuildings((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	const toggleRoom = (id: number) => {
		setExpandedRooms((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	const handleDeleteBuilding = () => {
		setDeleteBuilding(!deleteBuilding)
	}

	const handleDeleteRoom = () => {
		setDeleteRoom(!deleteRoom)
	}

	const handleDeleteEquipment = () => {
		setDeleteEquipment(!deleteEquipment)
	}

	const handleConfirmDeleteBuilding = () => {
		if (!selectedBuilding) return
		buildingService
			.deleteBuilding(selectedBuilding.id)
			.then(() => {
				setDeleteBuilding(false)
				setSelectedBuilding(null)
				window.location.reload()
			})
			.catch((err) => {
				console.log(err)
				setSelectedBuilding(null)
				window.location.reload()
			})
	}

	const handleConfirmDeleteRoom = () => {
		if (!selectedRoom) return
		roomService
			.deleteRoom(selectedRoom.id)
			.then(() => {
				setDeleteRoom(false)
				setSelectedRoom(null)
				window.location.reload()
			})
			.catch((err) => {
				console.log(err)
				setSelectedRoom(null)
				window.location.reload()
			})
	}

	const handleConfirmDeleteEquipment = () => {
		if (!selectedEquipment) return
		equipmentService
			.deleteEquipment(selectedEquipment.id)
			.then(() => {
				setDeleteEquipment(false)
				setSelectedEquipment(null)
				window.location.reload()
			})
			.catch((err) => {
				console.log(err)
				setSelectedEquipment(null)
				window.location.reload()
			})
	}

	useEffect(() => {
		if (successMsg || errorMsg) {
			const timer = setTimeout(() => {
				setSuccessMsg('')
				setErrorMsg('')
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [successMsg, errorMsg])

	return (
		<>
			<Menu />

			<div className="container-fluid py-4 px-3 px-md-5">
				<div className="mb-4 text-center text-md-start">
					<h1 className="display-6 text-dark fw-bold mb-1">My Admin</h1>
					<p className="text-secondary mb-0">
						Structurez et gérez vos bâtiments, salles de réunion et équipements
					</p>
				</div>

				{successMsg && (
					<div
						className="alert alert-success border-0 shadow-sm rounded-3 py-3 mb-4"
						role="alert"
					>
						<strong>Succès :</strong> {successMsg}
					</div>
				)}
				{errorMsg && (
					<div
						className="alert alert-danger border-0 shadow-sm rounded-3 py-3 mb-4"
						role="alert"
					>
						<strong>Erreur :</strong> {errorMsg}
					</div>
				)}

				<div className="row g-4 mt-2">
					<div className="col-12 col-lg-6">
						<div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
							<div className="card-header custom-bg text-white p-3 rounded-top-4 border-0">
								<h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
									<BusinessIcon /> Structure de l'Établissement
								</h5>
							</div>

							<div className="card-body p-4">
								{loading ? (
									<div className="text-center py-5">
										<div className="spinner-border text-success" role="status">
											<span className="visually-hidden">Chargement...</span>
										</div>
										<p className="text-muted mt-3 small mb-0">
											Chargement de la structure en cours...
										</p>
									</div>
								) : buildings.length === 0 ? (
									<div className="text-center py-5 border border-dashed rounded-4">
										<p className="text-muted mb-0">
											Aucun bâtiment configuré pour le moment.
										</p>
										<small className="text-secondary">
											Utilisez le formulaire pour ajouter votre premier bâtiment
											!
										</small>
									</div>
								) : (
									<div className="d-flex flex-column gap-3">
										{buildings.map((b) => {
											const bRooms = rooms.filter((r) => r.buildingId === b.id)
											const isBExpanded = !!expandedBuildings[b.id]

											return (
												<div
													key={b.id}
													className="border border-light-subtle rounded-3 p-3 bg-light bg-opacity-25"
												>
													{/* Building Row Header */}
													<div
														className="d-flex align-items-center justify-content-between user-select-none"
														style={{ cursor: 'pointer' }}
														onClick={() => toggleBuilding(b.id)}
													>
														<div className="d-flex align-items-center gap-2">
															<BusinessIcon
																sx={{ color: '#10b981', fontSize: '1.8rem' }}
															/>
															<div>
																<h6 className="fw-bold text-dark mb-0">
																	{b.name}
																</h6>
																<small className="text-secondary">
																	{b.address} • {b.nbFloors} étages
																</small>
															</div>
														</div>
														<span className="badge bg-slate rounded-pill text-white fw-bold">
															{bRooms.length}{' '}
															{bRooms.length > 1 ? 'salles' : 'salle'}
														</span>
														<DeleteIcon
															className="btn-icon-delete ms-1"
															sx={{
																fontSize: '1.2rem',
																cursor: 'pointer',
															}}
															onClick={() => {
																handleDeleteBuilding()
																setSelectedBuilding(b)
															}}
														/>
													</div>

													{isBExpanded && (
														<div className="ps-3 mt-3 border-start border-2 border-success border-opacity-25 d-flex flex-column gap-2">
															{bRooms.length === 0 ? (
																<p className="text-muted small mb-0 ps-3">
																	Aucune salle dans ce bâtiment.
																</p>
															) : (
																bRooms.map((r) => {
																	const rEquips = equipments.filter(
																		(e) => e.roomId === r.id,
																	)
																	const isRExpanded = !!expandedRooms[r.id]

																	return (
																		<div
																			key={r.id}
																			className="bg-white border rounded-3 p-2.5"
																		>
																			{/* Room Row Header */}
																			<div
																				className="d-flex align-items-center justify-content-between m-2"
																				style={{ cursor: 'pointer' }}
																				onClick={() => toggleRoom(r.id)}
																			>
																				<div className="d-flex align-items-center gap-2">
																					<MeetingRoomIcon
																						sx={{
																							color: '#475569',
																							fontSize: '1.5rem',
																						}}
																					/>
																					<div>
																						<span className="fw-semibold text-dark small">
																							{r.name}
																						</span>
																						<small
																							className="text-secondary d-block"
																							style={{ fontSize: '0.75rem' }}
																						>
																							Capacité : {r.capacity}p •{' '}
																							{`${r.floor === 0 ? 'RDC' : `Étage ${r.floor}`}`}{' '}
																							• {r.location}
																						</small>
																					</div>
																				</div>
																				<div>
																					<span
																						className="badge bg-light text-secondary border rounded-pill m-2"
																						style={{ fontSize: '0.7rem' }}
																					>
																						{rEquips.length} éq.
																					</span>
																					<DeleteIcon
																						className="btn-icon-delete ms-1"
																						sx={{
																							fontSize: '1.2rem',
																							cursor: 'pointer',
																						}}
																						onClick={() => {
																							handleDeleteRoom()
																							setSelectedRoom(r)
																						}}
																					/>
																				</div>
																			</div>

																			{isRExpanded && (
																				<div className="ps-3 mt-2 border-start border-dashed d-flex flex-wrap gap-1.5 pt-1.5">
																					{rEquips.length === 0 ? (
																						<small
																							className="text-muted ps-2"
																							style={{ fontSize: '0.75rem' }}
																						>
																							Aucun équipement.
																						</small>
																					) : (
																						rEquips.map((eq) => (
																							<span
																								key={eq.id}
																								className="badge bg-light text-dark border border-light-subtle rounded-pill px-2.5 py-1.5 d-inline-flex align-items-center gap-1 m-2"
																								style={{ fontSize: '0.72rem' }}
																							>
																								<BuildIcon
																									sx={{
																										fontSize: '0.9rem',
																										color: '#64748b',
																									}}
																									className="me-1"
																								/>
																								{eq.name}
																								<small
																									className="text-muted ms-1"
																									style={{ fontSize: '0.6rem' }}
																								>
																									({eq.type})
																								</small>
																								<DeleteIcon
																									className="btn-icon-delete ms-2"
																									sx={{
																										fontSize: '0.9rem',
																										cursor: 'pointer',
																									}}
																									onClick={() => {
																										handleDeleteEquipment()
																										setSelectedEquipment(eq)
																									}}
																								/>
																							</span>
																						))
																					)}
																				</div>
																			)}
																		</div>
																	)
																})
															)}
														</div>
													)}
												</div>
											)
										})}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="col-12 col-lg-6 d-flex flex-column gap-4">
						<div className="card border-0 shadow-sm rounded-4 bg-white">
							<div className="card-header custom-bg text-white p-3 rounded-top-4 border-0 d-flex align-items-center gap-2">
								<AddIcon />{' '}
								<h5 className="mb-0 fw-bold">Ajouter un Bâtiment</h5>
							</div>
							<div className="card-body p-4">
								<form onSubmit={handleAddBuilding} className="row g-3">
									<div className="col-12 col-md-6">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Nom du Bâtiment
										</label>
										<input
											type="text"
											className="form-control rounded-3"
											placeholder="e.g. Siège Social"
											value={buildingForm.name}
											onChange={(e) =>
												setBuildingForm({
													...buildingForm,
													name: e.target.value,
												})
											}
										/>
									</div>
									<div className="col-12 col-md-6">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Nombre d'Étages
										</label>
										<input
											type="number"
											aria-label="Nombre d'étages"
											min={1}
											className="form-control rounded-3"
											value={buildingForm.nbFloors}
											onChange={(e) =>
												setBuildingForm({
													...buildingForm,
													nbFloors: Number(e.target.value),
												})
											}
										/>
									</div>
									<div className="col-12">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Adresse
										</label>
										<input
											type="text"
											className="form-control rounded-3"
											aria-label="Adresse du bâtiment"
											placeholder="e.g. 12 rue des Innoveurs, Toulouse"
											value={buildingForm.address}
											onChange={(e) =>
												setBuildingForm({
													...buildingForm,
													address: e.target.value,
												})
											}
										/>
									</div>
									<div className="col-12 text-end">
										<button
											type="submit"
											className="btn btn-emerald rounded-pill px-4"
										>
											+ Créer le Bâtiment
										</button>
									</div>
								</form>
							</div>
						</div>

						<div className="card border-0 shadow-sm rounded-4 bg-white">
							<div className="card-header custom-bg text-white p-3 rounded-top-4 border-0 d-flex align-items-center gap-2">
								<AddIcon /> <h5 className="mb-0 fw-bold">Affilier une Salle</h5>
							</div>
							<div className="card-body p-4">
								<form onSubmit={handleAddRoom} className="row g-3">
									<div className="col-12 col-md-6">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Nom de la Salle
										</label>
										<input
											type="text"
											className="form-control rounded-3"
											aria-label="Nom de la salle"
											placeholder="e.g. Salle Conseil"
											value={roomForm.name}
											onChange={(e) =>
												setRoomForm({ ...roomForm, name: e.target.value })
											}
										/>
									</div>
									<div className="col-12 col-md-6">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Bâtiment Affilié
										</label>
										<select
											aria-label="Bâtiment affilié"
											className="form-select rounded-3"
											value={roomForm.buildingId}
											onChange={(e) =>
												setRoomForm({ ...roomForm, buildingId: e.target.value })
											}
										>
											<option value="">-- Choisir un bâtiment --</option>
											{buildings.map((b) => (
												<option key={b.id} value={b.id}>
													{b.name}
												</option>
											))}
										</select>
									</div>
									<div className="col-12 col-md-4">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Capacité (places)
										</label>
										<input
											type="number"
											aria-label="Capacité en nombre de places"
											min={1}
											className="form-control rounded-3"
											value={roomForm.capacity}
											onChange={(e) =>
												setRoomForm({
													...roomForm,
													capacity: Number(e.target.value),
												})
											}
										/>
									</div>
									<div className="col-12 col-md-4">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Étage
										</label>
										<input
											type="number"
											aria-label="Numéro de l'étage"
											className="form-control rounded-3"
											value={roomForm.floor}
											onChange={(e) =>
												setRoomForm({
													...roomForm,
													floor: Number(e.target.value),
												})
											}
											max={
												buildings.find(
													(b) => b.id === Number(roomForm.buildingId),
												)?.nbFloors || 1
											}
											min={0}
										/>
									</div>
									<div className="col-12 col-md-4">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Localisation interne
										</label>
										<input
											type="text"
											aria-label="Localisation interne de la salle"
											className="form-control rounded-3"
											placeholder="e.g. Aile Est"
											value={roomForm.location}
											onChange={(e) =>
												setRoomForm({ ...roomForm, location: e.target.value })
											}
										/>
									</div>
									<div className="col-12 text-end">
										<button
											type="submit"
											className="btn btn-emerald rounded-pill px-4"
										>
											+ Affilier la Salle
										</button>
									</div>
								</form>
							</div>
						</div>

						<div className="card border-0 shadow-sm rounded-4 bg-white">
							<div className="card-header custom-bg text-white p-3 rounded-top-4 border-0 d-flex align-items-center gap-2">
								<AddIcon />{' '}
								<h5 className="mb-0 fw-bold">Assigner un Équipement</h5>
							</div>
							<div className="card-body p-4">
								<form onSubmit={handleAddEquipment} className="row g-3">
									<div className="col-12 col-md-4">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Nom de l'Équipement
										</label>
										<input
											type="text"
											aria-label="Nom de l'équipement"
											className="form-control rounded-3"
											placeholder="e.g. Tableau Blanc"
											value={equipmentForm.name}
											onChange={(e) =>
												setEquipmentForm({
													...equipmentForm,
													name: e.target.value,
												})
											}
										/>
									</div>
									<div className="col-12 col-md-4">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Type
										</label>
										<select
											className="form-select rounded-3"
											aria-label="Type de l'équipement"
											value={equipmentForm.type}
											onChange={(e) =>
												setEquipmentForm({
													...equipmentForm,
													type: e.target.value,
												})
											}
										>
											<option value="informatique">Informatique</option>
											<option value="fourniture">Fourniture</option>
											<option value="audio">Audio / Vidéo</option>
											<option value="autre">Autre</option>
										</select>
									</div>
									<div className="col-12 col-md-4">
										<label className="form-label small fw-bold text-secondary text-uppercase">
											Salle Affiliée
										</label>
										<select
											className="form-select rounded-3"
											aria-label="Salle affiliée"
											value={equipmentForm.roomId}
											onChange={(e) =>
												setEquipmentForm({
													...equipmentForm,
													roomId: e.target.value,
												})
											}
										>
											<option value="">-- Choisir une salle --</option>
											{rooms.map((r) => {
												const bName =
													buildings.find((b) => b.id === r.buildingId)?.name ||
													''
												return (
													<option key={r.id} value={r.id}>
														{r.name} ({bName})
													</option>
												)
											})}
										</select>
									</div>
									<div className="col-12 text-end">
										<button
											type="submit"
											className="btn btn-emerald rounded-pill px-4"
										>
											+ Assigner l'Équipement
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				{deleteBuilding && (
					<>
						<div className="modal-backdrop fade show"></div>
						<div
							className="modal fade show"
							id="exampleModal"
							tabIndex={-1}
							aria-labelledby="exampleModalLabel"
							aria-hidden="true"
							style={{ display: 'block' }}
							onClick={() => setDeleteBuilding(false)}
						>
							<div
								className="modal-dialog modal-dialog-centered"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="modal-content border-0">
									<div className="modal-header d-flex justify-content-center border-0">
										<h1 className="modal-title fs-5">
											Voulez-vous vraiment supprimer ce bâtiment ?
										</h1>
									</div>
									<div className="modal-body">
										<div className="modal-footer d-flex justify-content-center border-0">
											<button
												className="btn btn-secondary rounded-pill fs-4 px-5 py-2"
												onClick={handleDeleteBuilding}
											>
												Fermer
											</button>
											<button
												className="btn btn-emerald rounded-pill fs-4 px-5 py-2"
												onClick={handleConfirmDeleteBuilding}
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
				{deleteRoom && (
					<>
						<div className="modal-backdrop fade show"></div>
						<div
							className="modal fade show"
							id="exampleModal"
							tabIndex={-1}
							aria-labelledby="exampleModalLabel"
							aria-hidden="true"
							style={{ display: 'block' }}
							onClick={() => setDeleteRoom(false)}
						>
							<div
								className="modal-dialog modal-dialog-centered"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="modal-content border-0">
									<div className="modal-header d-flex justify-content-center border-0">
										<h1 className="modal-title fs-5">
											Voulez-vous vraiment supprimer cette salle ?
										</h1>
									</div>
									<div className="modal-body">
										<div className="modal-footer d-flex justify-content-center border-0">
											<button
												className="btn btn-secondary rounded-pill fs-4 px-5 py-2"
												onClick={handleDeleteRoom}
											>
												Fermer
											</button>
											<button
												className="btn btn-emerald rounded-pill fs-4 px-5 py-2"
												onClick={handleConfirmDeleteRoom}
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
				{deleteEquipment && (
					<>
						<div className="modal-backdrop fade show"></div>
						<div
							className="modal fade show"
							id="exampleModal"
							tabIndex={-1}
							aria-labelledby="exampleModalLabel"
							aria-hidden="true"
							style={{ display: 'block' }}
							onClick={() => setDeleteEquipment(false)}
						>
							<div
								className="modal-dialog modal-dialog-centered"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="modal-content border-0">
									<div className="modal-header d-flex justify-content-center border-0">
										<h1 className="modal-title fs-5">
											Voulez-vous vraiment supprimer cette équipement ?
										</h1>
									</div>
									<div className="modal-body">
										<div className="modal-footer d-flex justify-content-center border-0">
											<button
												className="btn btn-secondary rounded-pill fs-4 px-5 py-2"
												onClick={handleDeleteEquipment}
											>
												Fermer
											</button>
											<button
												className="btn btn-emerald rounded-pill fs-4 px-5 py-2"
												onClick={handleConfirmDeleteEquipment}
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
		</>
	)
}
