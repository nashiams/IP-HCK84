const { comparePassword } = require("../helpers/bcrypts");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
class UserController {
  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = signToken({ id: user.id, email: user.email });
      res.status(200).json({ token, userId: user.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async google(req, res, next) {
    try {
    } catch (error) {}
  }
}
module.exports = UserController;
