import io from 'socket.io-client';

class SocketService {
  _instance;
  _rooms = [];
  _messages = [];

  constructor() {
    this._instance = io(`ws://localhost:5000`);

    this._instance.on('get_rooms');
  }

  receiverMessageListener(message) {
    this._messages.push(message);
  }

  receiverRoomListener(rooms) {
    this._rooms.push(rooms);
  }

  deleteMessageListener(id) {
    this._messages = this._messages.filter((m) => m.id !== id);
  }

  deleteRoomListener(id) {
    this._rooms = this._messages.filter((m) => m.id !== id);
  }

  getRooms() {
    return this._rooms;
  }

  getRoomById(id) {
    return this._rooms.find((r) => r.id === id) || null;
  }

  getMessagesByRoomId(roomId) {
    return this._messages.filter((m) => m.roomId === roomId);
  }

  closeConnection() {
    this._instance.close();
  }
}

export const socketService = new SocketService();
