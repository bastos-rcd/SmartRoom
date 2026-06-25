import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { eventService } from '../services/event.service'
import type { Event } from '../types/event'

type RoomProps = Event & {
	name: string
	capacity: number
	floor: number
	location: string
	equipment: string[]
	startDate?: string
	endDate?: string
}

export default function RoomCard(props: RoomProps) {
	const [isDeleted, setIsDeleted] = useState<boolean>(false)

	const handleDelete = () => {
		setIsDeleted(!isDeleted)
	}

	const handleConfirmDelete = () => {
		eventService
			.deleteEvent(props.id)
			.then(() => {
				setIsDeleted(false)
				window.location.reload()
			})
			.catch((err) => {
				console.log(err)
				window.location.reload()
			})
	}
	const start = props.startDate
		? new Date(props.startDate.replace(' ', 'T'))
		: null
	const end = props.endDate ? new Date(props.endDate.replace(' ', 'T')) : null

	const formatDate = (date: Date) => {
		const formatted = date.toLocaleDateString('fr-FR', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})
		return formatted.charAt(0).toUpperCase() + formatted.slice(1)
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	return (
		<div className="card h-100 border border-light-subtle rounded-4 shadow-sm overflow-hidden reservation-card">
			<div className="d-flex justify-content-between align-items-center ard-header bg-slate text-black p-3 border-0">
				<div>
					<h4 className="card-title h5 fw-bold mb-1">{props.name}</h4>
					<div className="text-black-50 small fw-medium">
						{props.location} • Étage {props.floor}
					</div>
				</div>
				<div>
					{new Date(props.endDate) > new Date() && (
						<DeleteIcon
							className="fs-3 btn-icon-delete"
							style={{ cursor: 'pointer' }}
							onClick={handleDelete}
						/>
					)}
				</div>
			</div>

			<div className="card-body p-4 d-flex flex-column gap-3">
				{start && end && (
					<div className="bg-light border border-light-subtle rounded-3 p-3">
						<div
							className="text-uppercase text-secondary fw-bold small mb-1"
							style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
						>
							Période réservée
						</div>
						<div className="fw-bold text-dark fs-5">{formatDate(start)}</div>
						<div className="text-secondary fw-semibold fs-6 mt-1">
							De {formatTime(start)} à {formatTime(end)}
						</div>
					</div>
				)}

				<div className="d-flex flex-column gap-2">
					<div className="small text-secondary">
						<strong className="text-dark">Capacité :</strong> {props.capacity}{' '}
						places assises
					</div>
				</div>
			</div>
			{isDeleted && (
				<>
					<div className="modal-backdrop fade show"></div>
					<div
						className="modal fade show"
						id="exampleModal"
						tabIndex={-1}
						aria-labelledby="exampleModalLabel"
						aria-hidden="true"
						style={{ display: 'block' }}
						onClick={() => setIsDeleted(false)}
					>
						<div
							className="modal-dialog modal-dialog-centered"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="modal-content border-0">
								<div className="modal-header d-flex justify-content-center border-0">
									<h1 className="modal-title fs-5">
										Voulez-vous vraiment supprimer cette réservation ?
									</h1>
								</div>
								<div className="modal-body">
									<div className="modal-footer d-flex justify-content-center border-0">
										<button
											className="btn btn-secondary rounded-pill fs-4 px-5 py-2"
											onClick={handleDelete}
										>
											Fermer
										</button>

										<button
											className="btn btn-emerald rounded-pill fs-4 px-5 py-2"
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
	)
}
