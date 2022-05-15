import io from "socket.io-client";
import { MemoryClient } from "../utils";

export class SocketService {
	_instance;
	_rooms = [];
	_messages = [];
	_userId;

	constructor (userId) {
		this._instance = io (`ws://localhost:5000`, {
			auth: {
				"x-access-token": MemoryClient.get ('lp')
			},
			reconnection: true,
			autoConnect: true,
		});
		this._userId = userId;
		this.sendUserId ();
		console.log ('sss : ', this._userId);
		this.setupSocketListeners ();
	}

	setupSocketListeners () {
		this._instance.on ("reconnect", this.onReconnection);
		this._instance.on ("disconnect", this.closeConnection);
		this._instance.on ("get_rooms", this.onRoomsReceived);
		this.createRoom();
	}

	onRoomsReceived (data) {
		console.log ('data xxx : ', data);
	}

	sendUserId () {
		if (this._userId) {
			this._instance.emit ("auth_user", this._userId);
		}
	}

	closeConnection () {
		// this._instance.close ();
	}

	onReconnection () {
		this.sendUserId ();
	}


//	create room
	createRoom (data) {
		const demo = {
			name: "aaaa",
			avatarUrl: "ookkk",
			lastMessage: "aaccc",
		};
		this._instance.emit ("create_room", demo);
	}
}

