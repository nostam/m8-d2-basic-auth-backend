const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const server = express();
const servicesRoutes = require("./allRoutes");
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
  badRequestHandler,
} = require("./errorHandler");
const port = process.env.PORT || 3001;

const whiteList =
  process.env.NODE_ENV === "production"
    ? [process.env.FE_URL_PROD]
    : [process.env.FE_URL_DEV];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS ISSUES"));
    }
  },
};

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} ${new Date()}`);
  next();
};

server.use(cors());
server.use(express.json());
server.use(loggerMiddleware);

// Endpoints

server.use("/", servicesRoutes);

server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(catchAllHandler);

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    server.listen(port, () => {
      console.log("Running on port", port);
    })
  )
  .catch((err) => console.log(err));
