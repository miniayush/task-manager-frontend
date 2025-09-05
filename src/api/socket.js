import { io } from "socket.io-client";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const socket = io(apiUrl);

export default socket;
