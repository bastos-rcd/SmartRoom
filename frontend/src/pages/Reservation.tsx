import { useEffect, useState } from 'react'
import Menu from '../components/Menu'
import RoomCard from '../components/RoomCard'
import { eventService } from '../services/event.service'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import type { Event } from '../types/event'
import { equipmentService } from '../services/equipment.service'
import { roomService } from '../services/room.service'
import type { Equipment } from '../types/equipment'

export default function Reservation() {
	const navigate = useNavigate()

	const [activeTab, setActiveTab] = useState<string>('current')
	const [data, setData] = useState<any[]>([])

	useEffect(() => {
		if (!authService.isAuthenticated) {
			navigate('/login')
			return
		}

		eventService.getEvents().then((eventsData) => {
			authService.getUser().then((user) => {
				const events = eventsData.filter(
					(event: Event) => event.userId === user.id,
				)
				console.log(events)

				const data = events.map(async (event: Event) => {
					const room = await roomService.getRoomById(event.roomId)
					const equipments = await equipmentService.getEquipments()

					return {
						name: room.name,
						capacity: room.capacity,
						floor: room.floor,
						location: room.location,
						equipment: equipments
							.filter((equipment: Equipment) => equipment.roomId === room.id)
							.map((equipment: Equipment) => equipment.name),
						startDate: event.startDate,
						endDate: event.endDate,
					}
				})

				Promise.all(data).then((result) => {
					setData(result)
				})
			})
		})
	}, [])

	// const data = [
	//   {
	//     name: "Salle 1",
	//     capacity: 10,
	//     floor: 1,
	//     location: "Bâtiment A",
	//     equipment: ["Vidéo-projecteur", "Tableau blanc", "Audio"],
	//     startDate: "2026-05-30 18:00",
	//     endDate: "2026-05-30 19:00",
	//   },
	// ];

	const filteredData = data.filter((room) => {
		const now = new Date()
		const endDate = new Date(room.endDate)
		if (activeTab === 'current') {
			return endDate >= now
		} else {
			return endDate < now
		}
	})

	return (
		<>
			<Menu />

			<div className="container-fluid py-4 px-3 px-md-5">
				{/* Page Header */}
				<div className="text-center mb-4">
					<h1 className="display-5 text-dark fw-bold mb-2">Mes réservations</h1>
				</div>

				{/* Premium Pills Tab Switcher */}
				<div className="d-flex justify-content-center mb-5">
					<div className="nav nav-pills bg-light border border-light-subtle rounded-pill p-1">
						<button
							type="button"
							className={`nav-link rounded-pill px-4 fw-bold ${
								activeTab === 'current'
									? 'bg-dark text-white shadow-sm'
									: 'text-secondary bg-transparent'
							}`}
							onClick={() => setActiveTab('current')}
						>
							En cours
						</button>
						<button
							type="button"
							className={`nav-link rounded-pill px-4 fw-bold ${
								activeTab === 'passed'
									? 'bg-dark text-white shadow-sm'
									: 'text-secondary bg-transparent'
							}`}
							onClick={() => setActiveTab('passed')}
						>
							Passées
						</button>
					</div>
				</div>

				{/* Reservations Grid List */}
				<div className="row justify-content-center">
					<div className="col-12 col-xl-11">
						{filteredData.length === 0 ? (
							<div className="text-center py-5 bg-white border rounded-4 shadow-sm col-12 col-md-8 mx-auto">
								<p className="fs-5 text-secondary mb-0">
									Aucune réservation{' '}
									{activeTab === 'current' ? 'en cours' : 'passée'} pour le
									moment.
								</p>
							</div>
						) : (
							<div className="row g-4 justify-content-center">
								{filteredData.map((room) => (
									<div
										className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch"
										key={room.name}
									>
										<RoomCard {...room} />
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
