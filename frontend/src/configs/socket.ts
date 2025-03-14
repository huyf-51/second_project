import { io } from 'socket.io-client';

export const socketClient = io(import.meta.env.VITE_REACT_SOCKET_SERVER_URL, {
    autoConnect: false,
});