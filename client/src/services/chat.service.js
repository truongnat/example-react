var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { httpClient } from '@/lib/http-client';
class ChatService {
    constructor() {
        this.baseUrl = '/api/chat';
    }
    // Room operations
    getRooms() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const response = yield httpClient.get(`${this.baseUrl}/rooms?page=${page}&limit=${limit}`);
            return response.data.data;
        });
    }
    getRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.get(`${this.baseUrl}/rooms/${roomId}`);
            return response.data.data.room;
        });
    }
    createRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.post(`${this.baseUrl}/rooms`, data);
            return response.data.data.room;
        });
    }
    updateRoom(roomId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.put(`${this.baseUrl}/rooms/${roomId}`, data);
            return response.data.data.room;
        });
    }
    deleteRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield httpClient.delete(`${this.baseUrl}/rooms/${roomId}`);
        });
    }
    joinRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.post(`${this.baseUrl}/rooms/${roomId}/join`);
            return response.data.data.room;
        });
    }
    leaveRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield httpClient.post(`${this.baseUrl}/rooms/${roomId}/leave`);
        });
    }
    // Message operations
    getMessages(roomId_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, page = 1, limit = 50) {
            const response = yield httpClient.get(`${this.baseUrl}/rooms/${roomId}/messages?page=${page}&limit=${limit}`);
            return response.data.data;
        });
    }
    updateMessage(roomId, messageId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield httpClient.put(`${this.baseUrl}/rooms/${roomId}/messages/${messageId}`, data);
            return response.data.data.message;
        });
    }
    deleteMessage(roomId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield httpClient.delete(`${this.baseUrl}/rooms/${roomId}/messages/${messageId}`);
        });
    }
}
export const chatService = new ChatService();
