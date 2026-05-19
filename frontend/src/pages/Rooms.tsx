import Menu from "../components/Menu";
import RoomCard from "../components/RoomCard";
export default function Rooms() {
  const data = [
    {
      name: "Salle 1",
      capacity: 10,
      floor: 1,
      state: 1,
      location: "Batiment A",
      buildingId: 1,
    },
    {
      name: "Salle 2",
      capacity: 20,
      floor: 2,
      state: 1,
      location: "Batiment B",
      buildingId: 2,
    },
  ];

  return (
    <>
      <Menu />
      <div>
        <h2 className="fs-1 col-11 col-md-11 mx-auto mt-4 ">Salles</h2>
        <div className="col-11 col-md-11 mx-auto mt-4 d-flex justify-content-between flex-wrap">
          {data.map((room) => (
            <RoomCard key={room.name} {...room} />
          ))}
        </div>
      </div>
    </>
  );
}
