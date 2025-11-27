import express from "express";
import cors from "cors";

import users from "./routes/users.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SmartRoom API is running !" });
});

app.use("/users", users);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});