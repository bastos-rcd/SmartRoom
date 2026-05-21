import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import UserCard from "../components/UserCard";
import { userService } from "../services/user.service";
import type { User } from "../types/user";

export default function UserManagement() {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    userService.getAllUsers().then((users) => {
      setData(users);
    });
  }, []);

  return (
    <div>
      <Menu />
      {data.map((user) => (
        <UserCard
          key={user.id}
          {...user}
          onDelete={() => {}}
          onBlock={() => {}}
        />
      ))}
    </div>
  );
}
