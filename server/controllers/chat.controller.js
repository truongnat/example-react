const express = require("express");
const bcrypt = require("bcrypt");
const { UserRepository } = require("../schema");
require("dotenv").config();
const {
  ServerException,
  BadRequestException,
  NotFoundException,
} = require("../exceptions");
const { AuthMiddleware } = require("../middleware");
const { Controller } = require("../core");
const { UserService, ChatService } = require("../services");

class ChatController extends Controller {
  _path = "/chat";
  _router = express.Router();

  constructor() {
    super();
    this.initializeRoutes();
  }

  async createRoom(req, res, next) {
    try {
      const roomExist = await ChatService.getRoomByKey("name", req.body.name);
      if (roomExist) {
        return next(BadRequestException("Room name existing!"));
      }

      const roomCreated = await ChatService.createNewRoom({
        name: req.body.name,
        author: req.user._id,
        lastMessage: `Welcome to ${req.body.name}`,
      });

      res.json({
        status: 200,
        message: "success",
        data: roomCreated,
      });
    } catch (e) {
      next(new ServerException(e.message));
    }
  }

  async updateRoom(req, res, next) {
    try {
      const { name, avatarUrl } = req.body;
      const roomId = req.params.id;
      const updated = await ChatService.updateRoomInfo(roomId, {
        name,
        avatarUrl,
      });
      return res.json({
        status: 200,
        message: "success",
        data: updated,
      });
    } catch (e) {
      next(new ServerException(e.message));
    }
  }

  async getRoomByUser(req, res, next) {
    try {
      const rooms = await ChatService.getRoomsWithUser(req.user._id);
      return res.json({
        status: 200,
        message: "success",
        data: rooms,
      });
    } catch (e) {
      next(new ServerException(e.message));
    }
  }

  async deleteRoom(req, res, next) {
    try {
      const deleted = await ChatService.deleteRoom(req.params.id);
      return res.json({
        status: 200,
        message: "success",
        data: deleted,
      });
    } catch (e) {
      next(new ServerException(e.message));
    }
  }

  async roomDetail(req, res, next) {
    try {
      const roomExist = await ChatService.getRoomByKey("_id", req.params.id);
      if (!roomExist) {
        return next(new NotFoundException("Room not found"));
      }
      return res.json({
        status: 200,
        message: "success",
        data: roomExist,
      });
    } catch (e) {
      next(new ServerException(e.message));
    }
  }

  initializeRoutes() {
    this._router.all(`${this._path}/*`, AuthMiddleware);
    this._router.post(`${this._path}/create-room`, this.createRoom);
    this._router.get(`${this._path}/rooms`, this.getRoomByUser);
    this._router.put(`${this._path}/update-room/:id`, this.updateRoom);
    this._router.delete(`${this._path}/delete-room/:id`, this.deleteRoom);
    this._router.get(`${this._path}/room/:id`, this.roomDetail);
  }
}

module.exports = ChatController;
