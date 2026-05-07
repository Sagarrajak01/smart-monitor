import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

const FINAL_URL = import.meta.env.VITE_SOCKET_URL || SOCKET_URL;

export const socket = io(FINAL_URL, {
  autoConnect: true,
  reconnectionAttempts: 5,
});