'use strict';

//npm modules
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express'); // ExperssJS Framework
const morgan = require('morgan'); // Import Morgan Package
const mongoose = require('mongoose'); // HTTP request logger middleware for Node.js
const Promise = require('bluebird');
const path = require('path'); // Import path module
const passport = require('passport'); // Express-compatible authentication middleware for Node.js.
// const social = require('./server/passport/passport')(passport); // Import passport.js End Points/API

//app modules
// const userRouter = require('./server/routes/user-router'); // Import the application end points/API
// const galleryRouter = require('./server/routes/gallery-router')
const errorMiddleware = require('./server/lib/error-middleware.js');
const authRouter = require('./server/route/auth-router.js');
const galleryRouter = require('./server/route/gallery-router.js');
const photoRouter = require('./server/route/photo-router.js');
const userRouter = require('./server/route/user-router.js');

//load env vars
dotenv.load();

//setup mongoose
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) {
    console.log('Not connected to the database: ' + err); // Log to console if unable to connect to database
  } else {
    console.log('Successfully connected to MongoDB'); // Log to console if able to connect to database
  }
});

// module constants
const app = express();
const PORT = process.env.PORT;

//app middleware
app.use(morgan('dev')); // Morgan Middleware
app.use(cors());
let production = process.env.NODE_ENV === 'production';
let morganFormat = production ? 'common' : 'dev';
app.use(morgan(morganFormat));
app.use(express.static(`${__dirname}/public/build`)); // Allow front end to access public folder

//app routes
app.use(photoRouter);
app.use(galleryRouter);
app.use(authRouter);
app.use(errorMiddleware);
app.use(userRouter);

// Start Server
const server = module.exports = app.listen(PORT, () => {
  console.log('Running the server on PORT ' + PORT); // Listen on configured port
});

server.isRunning = true;
