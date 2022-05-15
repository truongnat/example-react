const jwt = require ("jsonwebtoken");
require ("dotenv").config ();
const { UserRepository } = require ("../schema");
const {
	UnauthorizedException,
	NotFoundException,
	ForbiddenException,
} = require ("../exceptions");

async function SocketAuthMiddleware (socket, next) {
	try {
		const tokenClient = socket.handshake.auth['x-access-token'];
		console.log (tokenClient);

		if (!tokenClient) {
			return next (new UnauthorizedException ());
		}
		const validToken = jwt.verify (tokenClient, process.env.SECRET_KEY, { algorithms: ["HS256"] });

		if (!validToken) {
			return next (new UnauthorizedException ());
		}

		console.log ("validToken", validToken);

		const checkingUser = await UserRepository.findOne ({ _id: validToken.id });

		if (!checkingUser) {
			return next (new NotFoundException ("User not found!"));
		}

		if (!checkingUser.active) {
			return next (new ForbiddenException ("User is temporarily locked!"));
		}

		socket.user = {
			_id: checkingUser._id,
			email: checkingUser.email,
			username: checkingUser.username,
			active: checkingUser.active,
			avatarUrl: checkingUser.avatarUrl,
			createdAt: checkingUser.createdAt,
			updatedAt: checkingUser.updatedAt,
		};
		next ();
	} catch (e) {
		next (new UnauthorizedException ());
	}
}

module.exports = SocketAuthMiddleware;
