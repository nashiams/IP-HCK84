const { comparePassword } = require("../helpers/bcrypts");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
class UserController {
  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next();
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { name: "BadRequest", message: "Email or password is required" };
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw {
          name: "Unauthorized",
          message: "Email or password is required",
        };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw {
          name: "Unauthorized",
          message: "Email or password is required",
        };
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next();
    }
  }

  static async google(req, res, next) {
    try {
      const { googleToken } = req.body;
      if (!googleToken)
        throw { name: "BadRequest", message: "Google Token is required" };

      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const [user] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          password: Date.now().toString() + Math.random().toString(),
          role: "Staff",
        },
      });
      // kalo udah -> generate token

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next();
    }
  }
}
module.exports = UserController;
