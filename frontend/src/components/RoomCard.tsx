type Room = {
  name: string;
  capacity: number;
  floor: number;
  state: number;
  location: string;
  buildingId: number;
};

export default function RoomCard(props: Room) {
  return (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{props.name}</h5>
        <p className="card-text">{props.capacity}</p>
        <p className="card-text">{props.floor}</p>
        <p className="card-text">{props.state}</p>
        <p className="card-text">{props.location}</p>
        <p className="card-text">{props.buildingId}</p>
      </div>
    </div>
  );
}
