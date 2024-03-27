import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server as socketServer } from "socket.io";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

// import SocketEvents from "./app/socket/events.js";
// import userRoutes from "./app/user/userRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new socketServer(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/hi", (_req, res) => res.send("Hello there!"));

server.listen(5000, () => {
  console.log("Backend is up at port 5000");

  // SocketEvents(io, rooms, updateRoom, deleteRoom);
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Established a connection with the database"))
    .catch((err) => console.log("Error connecting to database", err));
});
