const mongoose = require("mongoose");
const config = require("./config/config");
const app = require("./app");
const expressListRoutes = require('express-list-routes');
const { authenicateAdmin } = require('./middlewares/auth')


mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongoose.url, {
                      useNewUrlParser: true,
                      useUnifiedTopology: true,
                      maxPoolSize: 1,
                      minPoolSize: 10,
                      socketTimeoutMS: 10000,
                      serverSelectionTimeoutMS: 10000,
                      maxIdleTimeMS: 10000})
              .then(() =>{
                console.log("Connected to MongoDB");})
              .catch(() => console.log("cannot connect to mongodb"));


authenicateAdmin();           

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
  expressListRoutes(app);
});