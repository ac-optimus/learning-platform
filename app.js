const express = require("express");
const httpStatus = require("http-status");
const routes = require("./routes");
const cors = require("cors");


const app = express();
app.use(cors());
app.get("/", (req, res, next) => {
  res.status(httpStatus.OK).send({"message":"Platform is ready to serve."})
});
app.use(express.json());
app.use("/v1", routes);
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).send({"message":"Not found"});
});


module.exports = app;