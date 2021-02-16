const express = require("express");
const Users = require("../../models/users");
const { adminOnly, basic } = require("../../utils/auth.js");
const usersRouter = express.Router();

usersRouter.get("/", basic, adminOnly, async (req, res, next) => {
  try {
    const users = await Users.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new Users(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

usersRouter
  .route("/me")
  .get(basic, async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  })
  .put(basic, async (req, res, next) => {
    try {
      //   req.user = { ...req.user, ...req.body };

      const updates = Object.keys(req.body);
      console.log("Updates ", updates);

      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  })
  .delete(basic, async (req, res, next) => {
    try {
      await req.user.deleteOne();
      res.status(204).send("Deleted");
    } catch (error) {
      next(error);
    }
  });

module.exports = usersRouter;
