const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const { connect } = mongoose;

const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const useErrorHandlers = require("./middleware/error-handlers");

const routerIndex = require('./routes/index');

connect('mongodb://localhost:27017/exam', { useNewUrlParser: true, useUnifiedTopology: true });

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    store: new FileStore(),
    key: 'user_sid',
    secret: 'anything here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 6000000,
    },
  }),
);

app.use((req, res, next) => {
  app.locals.Auth = !!req.session.user;
  if (req.session.user) {
    app.locals.userName = req.session.user.username;
  }
  next();
});

// view engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use('/', routerIndex);


useErrorHandlers(app);

module.exports = app;