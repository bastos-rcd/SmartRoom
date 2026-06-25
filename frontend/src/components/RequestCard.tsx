import { useEffect, useState } from 'react'
import { userService } from '../services/user.service'
import type { Request } from '../types/request'
import type { User } from '../types/user'
import { formatDate } from '@fullcalendar/core/index.js'
import DeleteIcon from '@mui/icons-material/Delete'
import DoneIcon from '@mui/icons-material/Done'

type RequestCardProps = Request & {
	onDelete?: () => void
	onValidate?: () => void
	showIcons?: boolean
}

export default function RequestCard(props: RequestCardProps) {
	const [user, setUser] = useState<User | null>(null)
	const [isValidated, setIsValidated] = useState<boolean>(false)
	const [isDeleted, setIsDeleted] = useState<boolean>(false)

	const handleValidate = () => {
		setIsValidated(!isValidated)
	}

	const handleDelete = () => {
		setIsDeleted(!isDeleted)
	}

	const handleConfirmValidate = () => {
		props.onValidate?.()
		setIsValidated(false)
	}

	const handleConfirmDelete = () => {
		props.onDelete?.()
		setIsDeleted(false)
	}

	useEffect(() => {
		userService.getUserById(props.userId).then(setUser)
	}, [])

	return (
		<div className="card h-100 w-100 border border-light-subtle rounded-4 shadow-sm overflow-hidden">
			{/* Card Header */}
			<div className="d-flex justify-content-between align-items-center ard-header custom-bg text-white p-3 border-0">
				<h4 className="card-title h5 fw-bold mb-1">
					Demande de : {user?.firstName} {user?.lastName}
				</h4>
				{props.showIcons && (
					<div className="d-flex gap-3">
						<DoneIcon
							className="btn-icon-validate"
							style={{ cursor: 'pointer' }}
							onClick={handleValidate}
						/>
						<DeleteIcon
							className="btn-icon-delete"
							style={{ cursor: 'pointer' }}
							onClick={handleDelete}
						/>
					</div>
				)}
			</div>

			{/* Card Body */}
			<div className="card-body p-4 d-flex flex-column gap-3">
				{/* Dynamic Period Badge */}
				{props.creationDate && (
					<div className="bg-light border border-light-subtle rounded-3 p-3">
						<div
							className="text-uppercase text-secondary fw-bold small mb-1"
							style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
						>
							Demande enregistrée le
						</div>
						<div className="fw-bold text-dark fs-5 flex-wrap">
							{formatDate(props.creationDate)}
						</div>
					</div>
				)}

				{/* Details Grid */}
				<div className="d-flex flex-column gap-2">
					<div className="small text-secondary">
						<strong className="text-dark">Demande :</strong> {props.type}
					</div>

					<div className="small text-secondary mt-1">
						<strong className="d-block mb-2 text-dark">Description :</strong>
						<div className="d-flex flex-wrap gap-2">{props.description}</div>
					</div>
				</div>
			</div>
			{isValidated && (
				<>
					<div className="modal-backdrop fade show"></div>
					<div
						className="modal fade show"
						id="exampleModal"
						tabIndex={-1}
						aria-labelledby="exampleModalLabel"
						aria-hidden="true"
						style={{ display: 'block' }}
						onClick={() => setIsValidated(false)}
					>
						<div
							className="modal-dialog modal-dialog-centered"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="modal-content border-0">
								<div className="modal-header d-flex justify-content-center border-0">
									<h1 className="modal-title fs-5">
										Voulez-vous valider cette demande ?
									</h1>
								</div>
								<div className="modal-body">
									<div className="modal-footer d-flex justify-content-center border-0">
										<button
											className="btn btn-secondary rounded-pill fs-4 px-5 py-2"
											onClick={handleValidate}
										>
											Fermer
										</button>
										<button
											className="btn btn-emerald rounded-pill fs-4 px-5 py-2"
											onClick={handleConfirmValidate}
										>
											Valider
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
										Voulez-vous vraiment supprimer cette demande ?
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
