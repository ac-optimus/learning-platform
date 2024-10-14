const express = require("express");
const httpStatus = require("http-status");
const routes = require("./routes");
const cors = require("cors");
const swaggerSetup = require('./swagger');
 

const app = express();
app.use(cors());
app.get("/", (req, res, next) => {
  res.status(httpStatus.OK).send({"message":"Platform is ready to serve."})
});
app.use(express.json());
swaggerSetup(app);
app.use("/v1", routes);
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).send({"message":"Not found"});
});


module.exports = app;
