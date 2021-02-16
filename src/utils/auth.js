const Users = require("../models/users");
const { APIError } = require("./index");
const atob = require("atob");

const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(new APIError("Please provide a basic authentication", 401));
  } else {
    const [email, password] = atob(
      req.headers.authorization.split(" ")[1]
    ).split(":");
    const user = await Users.findByCredentials(email, password);
    if (!user) {
      next(new APIError("Wrong credentials provided", 401));
    } else {
      req.user = user;
    }
    next();
  }
};

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new APIError("Admin Only!", 403));
  }
};

module.exports = {
  basic: basicAuthMiddleware,
  adminOnly: adminOnlyMiddleware,
};
