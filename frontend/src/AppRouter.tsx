import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Rooms from "./pages/Rooms";
import Reservation from "./pages/Reservation";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/reservations" element={<Reservation />} />
    </Routes>
  );
}
