import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Menu from '../components/Menu'
import { authService } from '../services/auth.service'
import { roomService } from '../services/room.service'
import { buildingService } from '../services/building.service'
import { equipmentService } from '../services/equipment.service'
import { eventService } from '../services/event.service'

import type { User as UserType } from '../types/user'
import type { Room as RoomType } from '../types/room'
import type { Building as BuildingType } from '../types/building'
import type { Equipment as EquipmentType } from '../types/equipment'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SearchIcon from '@mui/icons-material/Search'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'

export default function Rooms() {
	const navigate = useNavigate()

	const [rooms, setRooms] = useState<RoomType[]>([])
	const [buildings, setBuildings] = useState<BuildingType[]>([])
	const [equipments, setEquipments] = useState<EquipmentType[]>([])
	const [user, setUser] = useState<UserType | null>(null)
	const [loading, setLoading] = useState(true)

	const [searchBuilding, setSearchBuilding] = useState<string>('')
	const [searchDate, setSearchDate] = useState<string>('')

	const [filterBuilding, setFilterBuilding] = useState<string>('')
	const [filterDate, setFilterDate] = useState<string>('')

	const [expandedRoom, setExpandedRoom] = useState<number | null>(null)

	const [successToast, setSuccessToast] = useState<{
		visible: boolean
		roomName: string
	} | null>(null)

	useEffect(() => {
		const initRooms = async () => {
			try {
				if (!authService.isAuthenticated()) {
					navigate('/login')
					return
				}

				const currentUser = await authService.getUser()
				setUser(currentUser)

				const [rList, bList, eList] = await Promise.all([
					roomService.getRooms(),
					buildingService.getBuildings(),
					equipmentService.getEquipments(),
				])

				setRooms(rList || [])
				setBuildings(bList || [])
				setEquipments(eList || [])
			} catch (err) {
				console.error('Failed to load rooms page data', err)
				if (!authService.isAuthenticated()) {
					navigate('/login')
				}
			} finally {
				setLoading(false)
			}
		}

		initRooms()
	}, [navigate])

	const toggleExpand = (roomId: number) => {
		setExpandedRoom((prev) => (prev === roomId ? null : roomId))
	}

	const handleSearch = () => {
		setFilterBuilding(searchBuilding)
		setFilterDate(searchDate)
	}

	const filteredRooms = rooms.filter((room) => {
		const bld = buildings.find((b) => b.id === room.buildingId)
		const bldName = bld ? bld.name : ''
		const matchesBuilding =
			filterBuilding === '' ||
			bldName.toLowerCase() === filterBuilding.toLowerCase()
		return matchesBuilding
	})

	if (loading) {
		return (
			<div
				className="d-flex justify-content-center align-items-center min-vh-100"
				style={{ backgroundColor: '#f8fafc' }}
			>
				<div
					className="spinner-border text-emerald"
					role="status"
					style={{ width: '3rem', height: '3rem', color: '#10b981' }}
				>
					<span className="visually-hidden">Chargement...</span>
				</div>
			</div>
		)
	}

	return (
		<>
			<Menu />

			<div className="container-fluid py-4 px-3 px-md-5">
				<div className="text-center mb-4">
					<h1 className="display-5 text-dark fw-bold mb-2">Salles</h1>
				</div>

				<div className="d-flex justify-content-center mb-4">
					<div
						className="bg-white border shadow-sm d-flex flex-column flex-md-row align-items-stretch align-items-md-center p-3 p-md-2 search-filter-pill"
						style={{ maxWidth: '600px', width: '100%' }}
					>
						<div
							className="flex-grow-1 px-3 py-2 py-md-1 d-flex flex-column text-start"
							style={{ minWidth: '150px' }}
						>
							<label
								className="text-secondary fw-bold small text-uppercase mb-0"
								style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
							>
								Bâtiment
							</label>
							<select
								className="form-select border-0 p-0 bg-transparent text-dark fw-semibold shadow-none"
								aria-label="Select building"
								style={{ fontSize: '0.9rem' }}
								value={searchBuilding}
								onChange={(e) => setSearchBuilding(e.target.value)}
							>
								<option value="">Tous les bâtiments</option>
								{buildings.map((b) => (
									<option key={b.id} value={b.name}>
										{b.name}
									</option>
								))}
							</select>
						</div>

						<div
							className="vr d-none d-md-block mx-2"
							style={{ height: '30px', backgroundColor: '#e2e8f0' }}
						></div>
						<hr className="d-md-none my-2 text-black-50" />

						<div
							className="flex-grow-1 px-3 py-2 py-md-1 d-flex flex-column text-start"
							style={{ minWidth: '150px' }}
						>
							<label
								className="text-secondary fw-bold small text-uppercase mb-0"
								style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
							>
								Date souhaitée
							</label>
							<input
								type="date"
								aria-label="Select date"
								className="form-control border-0 p-0 bg-transparent text-dark fw-semibold shadow-none"
								style={{ fontSize: '0.9rem' }}
								value={searchDate}
								min={new Date().toISOString().split('T')[0]}
								onChange={(e) => setSearchDate(e.target.value)}
							/>
						</div>

						<button
							className="btn btn-success rounded-pill rounded-md-circle p-2 d-flex align-items-center justify-content-center mt-3 mt-md-0 ms-md-2"
							style={{
								minHeight: '44px',
								backgroundColor: '#22c55e',
								borderColor: '#22c55e',
							}}
							onClick={handleSearch}
							title="Lancer la recherche"
						>
							<SearchIcon
								sx={{ fontSize: '1.4rem', color: '#ffffff' }}
								className="me-2 d-md-none"
							/>
							<span className="d-md-none fw-bold text-white">Rechercher</span>
							<SearchIcon
								sx={{ fontSize: '1.4rem', color: '#ffffff' }}
								className="d-none d-md-inline"
							/>
						</button>
					</div>
				</div>

				{(filterBuilding || filterDate) && (
					<div className="d-flex justify-content-center mb-3">
						<span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 rounded-pill fs-6">
							Filtres actifs :{' '}
							{filterBuilding && `Bâtiment : ${filterBuilding}`}{' '}
							{filterBuilding && filterDate && ' | '}{' '}
							{filterDate &&
								`Date : ${new Date(filterDate).toLocaleDateString('fr-FR')}`}
							<button
								className="btn-close ms-2 fs-7"
								type="button"
								aria-label="Close"
								style={{ fontSize: '0.8rem', verticalAlign: 'middle' }}
								onClick={() => {
									setSearchBuilding('')
									setSearchDate('')
									setFilterBuilding('')
									setFilterDate('')
								}}
							></button>
						</span>
					</div>
				)}

				<div className="row justify-content-center">
					<div className="col-12 col-xl-9">
						<div className="d-flex flex-column gap-3">
							{filteredRooms.length === 0 ? (
								<div className="text-center p-5 bg-white border rounded-4 shadow-sm">
									<p className="fs-4 text-secondary mb-0">
										Aucune salle ne correspond à vos critères de recherche
									</p>
								</div>
							) : (
								filteredRooms.map((room) => {
									const isExpanded = expandedRoom === room.id
									const bld = buildings.find((b) => b.id === room.buildingId)
									const roomBuildingName = bld ? bld.name : 'Bâtiment inconnu'

									return (
										<div
											className="card border rounded-4 shadow-sm overflow-hidden bg-white"
											key={room.id}
										>
											<div
												className="card-header bg-white p-3 d-flex align-items-center justify-content-between cursor-pointer border-0"
												onClick={() => toggleExpand(room.id)}
												style={{ cursor: 'pointer' }}
											>
												<div className="text-start">
													<h3 className="h5 fw-bold text-dark mb-1">
														{room.name}
													</h3>
													<span className="text-secondary small fw-medium d-block d-sm-inline">
														{roomBuildingName} • Étage {room.floor}
													</span>
												</div>
												<div className="d-flex align-items-center gap-3">
													<span
														className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-bold"
														style={{ fontSize: '0.85rem' }}
													>
														{room.capacity} pers
													</span>
													<span
														className="text-secondary"
														style={{
															transform: isExpanded
																? 'rotate(180deg)'
																: 'rotate(0deg)',
															transition: 'transform 0.2s ease',
														}}
													>
														<KeyboardArrowDownIcon
															sx={{ fontSize: '1.8rem' }}
														/>
													</span>
												</div>
											</div>

											{isExpanded && (
												<div className="card-body p-4 border-top border-light-subtle">
													<RoomDetailRow
														room={room}
														buildingName={roomBuildingName}
														equipments={equipments.filter(
															(eq) => eq.roomId === room.id,
														)}
														currentUser={user}
														onReserveSuccess={(name) => {
															setSuccessToast({
																visible: true,
																roomName: name,
															})
															setExpandedRoom(null)
															setTimeout(() => setSuccessToast(null), 5000)
														}}
													/>
												</div>
											)}
										</div>
									)
								})
							)}
						</div>
					</div>
				</div>
			</div>

			{successToast?.visible && (
				<div
					className="position-fixed bottom-0 end-0 m-4 p-3 rounded-3 text-white shadow-lg d-flex align-items-center gap-3 border border-success-subtle animate-toast"
					style={{
						backgroundColor: '#0f172a',
						backdropFilter: 'blur(8px)',
						zIndex: 9999,
						minWidth: '320px',
					}}
				>
					<span style={{ fontSize: '1.8rem', color: '#4ade80' }}>
						<EventAvailableIcon sx={{ fontSize: '2rem' }} />
					</span>
					<div>
						<h6
							className="m-0 fw-semibold text-success"
							style={{ color: '#4ade80' }}
						>
							Réservation Confirmée
						</h6>
						<small className="text-white-50">
							La {successToast.roomName} a été réservée avec succès !
						</small>
					</div>
				</div>
			)}
		</>
	)
}

interface RoomDetailRowProps {
	room: RoomType
	buildingName: string
	equipments: EquipmentType[]
	currentUser: UserType | null
	onReserveSuccess: (roomName: string) => void
}

function RoomDetailRow({
	room,
	buildingName,
	equipments,
	currentUser,
	onReserveSuccess,
}: RoomDetailRowProps) {
	const [startDate, setStartDate] = useState(
		new Date().toISOString().split('T')[0],
	)
	const [startTime, setStartTime] = useState('')
	const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
	const [endTime, setEndTime] = useState('')
	const [comment, setComment] = useState('')
	const [reserveError, setReserveError] = useState('')
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!startDate || !startTime || !endDate || !endTime) {
			setReserveError("Veuillez remplir tous les champs de date et d'heure.")
			return
		}

		setSubmitting(true)
		setReserveError('')
		try {
			const startDateTimeStr = `${startDate}T${startTime}:00`
			const endDateTimeStr = `${endDate}T${endTime}:00`

			await eventService.createEvent({
				startDate: startDateTimeStr,
				endDate: endDateTimeStr,
				status: 'confirmed',
				comment: comment.trim(),
				userId: currentUser!.id,
				roomId: room.id,
			})

			onReserveSuccess(room.name)
		} catch (err) {
			console.error(err)
			setReserveError('Erreur lors de la réservation de la salle.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="room-list-details">
			<div className="row g-4">
				<div className="col-12 col-md-5 d-flex flex-column gap-3 border-end-md">
					<div>
						<h5 className="text-dark fw-bold fs-5 mb-2">Caractéristiques</h5>
						<div className="d-flex flex-column gap-2 text-secondary fs-6">
							<div>
								Emplacement:{' '}
								<strong className="text-dark">{buildingName}</strong>
							</div>
							<div>
								Étage:{' '}
								<strong className="text-dark">Niveau {room.floor}</strong>
							</div>
							<div>
								Capacité max:{' '}
								<strong className="text-dark">
									{room.capacity} places assises
								</strong>
							</div>
						</div>
					</div>

					<div>
						<h5 className="text-dark fw-bold fs-5 mb-2">Équipements inclus</h5>
						<div className="d-flex flex-wrap gap-2">
							{equipments.length === 0 ? (
								<span className="text-muted small">
									Aucun équipement disponible.
								</span>
							) : (
								equipments.map((eq) => (
									<span
										key={eq.id}
										className="badge bg-white text-dark border border-secondary-subtle px-3 py-2 rounded-pill shadow-sm"
										style={{ fontSize: '0.85rem', fontWeight: 500 }}
									>
										{eq.name}
									</span>
								))
							)}
						</div>
					</div>
				</div>

				<div className="col-12 col-md-7">
					<h5 className="text-dark fw-bold fs-5 mb-3">
						Réserver cet espace rapidement
					</h5>

					<form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
						<div className="col g-2">
							<div className="col-12 col-sm-6">
								<label className="form-label text-secondary fw-semibold fs-7 mb-1">
									Date & Heure de début
								</label>
								<div className="d-flex gap-2">
									<input
										type="date"
										aria-label="Select start date"
										className="form-control bg-white"
										value={startDate}
										min={new Date().toISOString().split('T')[0]}
										onChange={(e) => {
											setStartDate(e.target.value)
											if (e.target.value > endDate) {
												setEndDate(e.target.value)
											}
										}}
									/>
									<input
										type="time"
										aria-label="Select start time"
										className="form-control bg-white"
										value={startTime}
										onChange={(e) => setStartTime(e.target.value)}
									/>
								</div>
							</div>

							<div className="col-12 col-sm-6">
								<label className="form-label text-secondary fw-semibold fs-7 mb-1">
									Date & Heure de fin
								</label>
								<div className="d-flex gap-2">
									<input
										type="date"
										aria-label="Select end date"
										className="form-control bg-white"
										value={endDate}
										min={startDate}
										onChange={(e) => setEndDate(e.target.value)}
									/>
									<input
										type="time"
										aria-label="Select end time"
										className="form-control bg-white"
										value={endTime}
										onChange={(e) => setEndTime(e.target.value)}
									/>
								</div>
							</div>
						</div>

						<div className="w-100">
							<label className="form-label text-secondary fw-semibold fs-7 mb-1">
								Commentaire / Objet de la réunion (Optionnel)
							</label>
							<input
								type="text"
								placeholder="Ex. Réunion d'équipe hebdomadaire"
								className="form-control bg-white"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
							/>
						</div>

						{reserveError && (
							<div className="text-danger fw-semibold fs-6">{reserveError}</div>
						)}

						<div className="d-flex justify-content-end mt-2">
							<button
								type="submit"
								disabled={submitting}
								className="btn btn-emerald rounded-pill py-2.5 px-4 text-white fw-bold border-0"
							>
								{submitting ? 'Réservation...' : 'Confirmer la réservation'}
							</button>
						</div>
					</form>
				</div>
			</div>

			<style>{`
        @media (min-width: 768px) {
          .border-end-md {
            border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
            padding-right: 1.5rem;
          }
        }
      `}</style>
		</div>
	)
}
