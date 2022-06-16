const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const cors = require("cors");
const PORT = 8088;
const swaggerUI = require("swagger-ui-express");
const swaggerDocs = require("swagger-jsdoc");

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "2022 Presidential Election API",
      version: "0.1.9",
      description: "Copyright by Nguyen Tien Duong",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerDocs(options);

const logger = require("./utils/logger");
const mainRouter = express.Router();
const loggerAuth = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

mainRouter.use("/vote", userRouter);
mainRouter.use("/gov", adminRouter);
app.use("/api/", loggerAuth, mainRouter);
app.use("/docs/", swaggerUI.serve, swaggerUI.setup(specs));

console.log(
  "Server start at " + new Date().toString().substring(0, 31),
  "PORT",
  PORT
);
app.listen(PORT);
