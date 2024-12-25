const mongoose = require("mongoose");
const config = require("./config/config");
const app = require("./app");
const expressListRoutes = require('express-list-routes');
const { authenicateAdmin } = require('./middlewares/auth')


console.log(config.mongoose.url);
mongoose.connect(config.mongoose.url, {
                      useNewUrlParser: true,
                      useUnifiedTopology: true,
                      maxPoolSize: 10,
                      minPoolSize: 1,
                      socketTimeoutMS: 10000,
                      serverSelectionTimeoutMS: 10000,
                      maxIdleTimeMS: 10000})
              .then(() =>{
                console.log("Connected to MongoDB");})
              .catch((error) => console.log("cannot connect to mongodb", error));


authenicateAdmin();           

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
  expressListRoutes(app);
});