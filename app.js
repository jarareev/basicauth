const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const passport = require("passport");
const fs = require('fs')
const path = require('path');
const morgan = require('morgan')

const { jwtStrategy } = require('./src/config/passport');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

const route = require('./src/routes/user');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// Set security HTTP headers
app.use(helmet());

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// Allow Cross-Origin requests
app.use(cors());

morgan.token('id', function getId(req) {
  return req.id
})

app.use(morgan(':remote-addr :date[web] :id :method :url :response-time', { stream: accessLogStream }))

app.get('', (req, res) => {
  res.json({ "greet": "welcome" })
})

app.use('/api', route)

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

module.exports = app;