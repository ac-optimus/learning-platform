const mongoose = require("mongoose");
const config = require("./config/config");
const app = require("./app");
const expressListRoutes = require('express-list-routes');
const { authenicateAdmin } = require('./middlewares/auth')


mongoose.connect(config.mongoose.url, {})
              .then(() =>{
                console.log("Connected to MongoDB");})
              .catch(() => console.log("cannot connect to mongodb"));


authenicateAdmin();           

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
  expressListRoutes(app);
});