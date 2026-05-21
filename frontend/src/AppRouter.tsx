import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Rooms from "./pages/Rooms";
import Reservation from "./pages/Reservation";
import MyAdmin from "./pages/MyAdmin";
import Analytics from "./pages/Analytics";
import UserSettings from "./pages/UserSettings";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/reservations" element={<Reservation />} />
      <Route path="/admin" element={<MyAdmin />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/userSettings" element={<UserSettings />} />
    </Routes>
  );
}

