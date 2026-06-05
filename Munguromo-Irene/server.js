// SECTION 1: Dependencies
const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDb = require('./config/db');

// SECTION 2: Instantiations
const app = express();
const port = 3000;

// SECTION 3: Configurations
connectDb();
// set the templating engine to pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// SECTION 4: Middleware
app.use(express.static(path.join(__dirname, 'public')));
// serves uploaded videos and thumbnails so they display in the browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// to parse URL encoded data
app.use(express.urlencoded({ extended: false }));

// SECTION 5: ROUTES
// for videx
app.use("/", require("./routes/systemsRoutes"));

// Handling non-existent routes
app.use((req, res) => {
  res.status(404).send('Oops! Route not found.');
});

// SECTION 6: Bootstrapping Server
// Last line of code in this file ever because it's responsible for running the server.
app.listen(port, () => console.log(`listening on port ${port}`));