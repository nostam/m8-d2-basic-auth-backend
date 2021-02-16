const router = require("express").Router();

router.use("/users", require("./services/users"));

module.exports = router;
