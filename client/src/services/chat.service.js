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
            var _a;
            const response = yield httpClient.get(`${this.baseUrl}/rooms?page=${page}&limit=${limit}`);
            return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || { rooms: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        });
    }
    getRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield httpClient.get(`${this.baseUrl}/rooms/${roomId}`);
            return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.room) || {};
        });
    }
    createRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield httpClient.post(`${this.baseUrl}/rooms`, data);
            return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.room) || {};
        });
    }
    updateRoom(roomId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield httpClient.put(`${this.baseUrl}/rooms/${roomId}`, data);
            return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.room) || {};
        });
    }
    deleteRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield httpClient.delete(`${this.baseUrl}/rooms/${roomId}`);
        });
    }
    joinRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield httpClient.post(`${this.baseUrl}/rooms/${roomId}/join`);
            return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.room) || {};
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
            var _a;
            const response = yield httpClient.get(`${this.baseUrl}/rooms/${roomId}/messages?page=${page}&limit=${limit}`);
            return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || { messages: [], total: 0, page: 1, limit: 50, totalPages: 0 };
        });
    }
    updateMessage(roomId, messageId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const response = yield httpClient.put(`${this.baseUrl}/rooms/${roomId}/messages/${messageId}`, data);
            return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || {};
        });
    }
    deleteMessage(roomId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield httpClient.delete(`${this.baseUrl}/rooms/${roomId}/messages/${messageId}`);
        });
    }
}
export const chatService = new ChatService();
