const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserRepository } = require("../schema");
const { AuthMiddleware } = require("../middleware");
const { Controller } = require("../core");
const { UserService, AuthService, MailerService } = require("../services");
const {
  generateOTP,
  getSecondBetween2Date,
  randomPassword,
} = require("../utils");
const { REGEX_EMAIL, MAX_TIME_OTP, MIN_LENGTH_PASS } = require("../constants");
const { rateLimit } = require("express-rate-limit");

const {
  ServerException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} = require("../exceptions");

class AuthController extends Controller {
  _path = "/auth";
  _router = express.Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  async registerAccount(req, res, next) {
    const user = req.body.user;
    try {
      const userExisting = await UserRepository.findOne({ email: user.email });
      if (userExisting) {
        return next(new BadRequestException("User already exists"));
      }
      await UserService.createUser(user);
      res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, _id } = req.user;

      const payload = {
        id: _id,
        email,
      };

      const token = await AuthService.generateToken(payload);
      const refreshToken = await AuthService.generateRefreshToken(payload);
      return res.json({
        status: 200,
        message: "success",
        data: {
          access_token: token,
          refresh_token: refreshToken,
          user: payload,
        },
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async whoAmI(req, res, next) {
    try {
      return res.json({
        status: 200,
        message: "success",
        data: req.user,
      });
    } catch (e) {
      next(new ServerException(error.message));
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { _id, email } = req.user;

      const newToken = await AuthService.generateToken({
        id: _id,
        email,
      });

      const newRefreshToken = await AuthService.generateRefreshToken({
        id: _id,
        email,
      });

      return res.json({
        status: 200,
        message: "success",
        data: {
          access_token: newToken,
          refresh_token: newRefreshToken,
        },
      });
    } catch (e) {
      next(new UnauthorizedException());
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email, _id } = req.user;
      await MailerService.sendEmail({
        to: email,
        subject: "Send otp verify forgot password!",
        template: "verifyResetPassword",
        context: {
          email,
          code: req.otp,
        },
      });

      await UserService.updateUser(_id, {
        otp: req.otp,
        active: false,
        updatedAt: new Date(),
      });

      return res.json({
        status: 200,
        message: "success",
      });
    } catch (e) {
      next(new ServerException(e.message));
    }
  }

  async verifyOtpForgotPassword(req, res, next) {
    const { email, _id } = req.user;

    const newPass = randomPassword(8);

    const hashPassword = await bcrypt.hash(newPass, 10);

    await UserService.updateUser(_id, {
      active: true,
      updatedAt: new Date(),
      password: hashPassword,
    });

    await MailerService.sendEmail({
      to: email,
      subject: "Send new password!",
      template: "sendNewPassword",
      context: {
        email,
        password: newPass,
      },
    });

    return res.json({
      status: 200,
      message: "success",
    });
  }

  async validateBeforeVerifyOtpForgot(req, res, next) {
    try {
      const { otp, email } = req.body;
      const userExist = await UserRepository.findOne({ email });
      if (!userExist) {
        return next(new NotFoundException("User not found!"));
      }
      if (userExist.active) {
        return next(new BadRequestException("Api unAvailable!"));
      }

      const seconds = getSecondBetween2Date(userExist.updatedAt, new Date());

      if (otp !== userExist.otp) {
        return next(new BadRequestException("Otp expired!"));
      }

      if (seconds > MAX_TIME_OTP) {
        return next(new BadRequestException("Otp expired!"));
      }
      req.user = userExist;
      next();
    } catch (e) {
      next(new ServerException(e.message));
    }
  }

  async validateBeforeCreateAccount(req, res, next) {
    const user = req.body.user;

    if (!user) {
      return next(new BadRequestException("User is not provider"));
    }
    const { email, password } = user;

    const errors = [];

    if (!email || !password) {
      if (!email) {
        errors.push({
          field: 'email',
          message: 'Email is empty!',
        });
      }

      if (!password) {
        errors.push({
          field: 'password',
          message: 'Password is empty!',
        });
      }
    }

    if (password.length < MIN_LENGTH_PASS) {
      errors.push({
        field: 'password',
        message: 'Password must be greater than or equal to '  + MIN_LENGTH_PASS + ' characters!',
      });
    }

    if (!REGEX_EMAIL.test(email)) {
      errors.push({
        field: 'email',
        message: 'Email invalid!',
      });
    }

    if (errors.length > 0) {
      return next(new NotFoundException('Missing or incorrect information', errors));
    }

    next();
  }

  async validateBeforeLogin(req, res, next) {
    const { email, password } = req.body;
    const user = await UserRepository.findOne({ email });
    if (!user) {
      return next(new NotFoundException("User not found"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new BadRequestException("Password not matching!"));
    }

    if (!user.active) {
      return next(new ForbiddenException("User is temporarily locked!"));
    }

    req.user = user;
    next();
  }

  async validateBeforeRefreshToken(req, res, next) {
    const { oldToken } = req.body;
    const decoded = jwt.decode(oldToken);

    if (!decoded) {
      return next(new BadRequestException("Bad request!"));
    }

    const { id } = decoded;

    const userExist = await UserRepository.findOne({ _id: id });

    if (!userExist) {
      return next(new NotFoundException("User not found"));
    }

    req.user = userExist;

    next();
  }

  async validateBeforeForgotPassword(req, res, next) {
    const { email } = req.body;
    const existUser = await UserRepository.findOne({ email });
    if (!existUser) {
      return next(new NotFoundException("User not found!"));
    }

    req.otp = generateOTP(6);
    req.user = existUser;

    next();
  }

  apiLimiter(max = 100) {
    return rateLimit({
      windowMs: 3 * 60 * 1000, // 3 minutes
      max, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
  }

  initializeRoutes() {
    this._router.post(
      `${this._path}/register`,
      this.validateBeforeCreateAccount,
      this.registerAccount
    );
    this._router.post(
      `${this._path}/login`,
      this.validateBeforeLogin,
      this.login
    );
    this._router.post(
      `${this._path}/refresh-token`,
      this.validateBeforeRefreshToken,
      this.refreshToken
    );
    this._router.get(`${this._path}/me`, AuthMiddleware, this.whoAmI);
    this._router.post(
      `${this._path}/forgot-password`,
      this.apiLimiter(1),
      this.validateBeforeForgotPassword,
      this.forgotPassword
    );
    this._router.post(
      `${this._path}/verify-otp-forgot`,
      this.apiLimiter(5),
      this.validateBeforeVerifyOtpForgot,
      this.verifyOtpForgotPassword
    );
  }
}

module.exports = AuthController;
