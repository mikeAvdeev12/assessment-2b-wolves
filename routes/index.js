const express = require('express');
const bcrypt = require('bcrypt');
const { sessionChecker } = require('../middleware/auth');

const saltRounds = 10;
const routes = express.Router();
const User = require('../models/user');
const Party = require('../models/party');


routes
  .route('/')
  .get(async (req, res) => {
    const partyShow = await Party.find();
    res.render('index', {
      title: 'Сrazy new Year partY ',
      event: 'neW partY',
      partyShow
    });
  });

routes
  .route('/signup')
  .get(sessionChecker, (req, res) => {
    res.render('signup');
  })
  .post(async (req, res) => {
    // console.log(req.body);
    const { username, password, email } = req.body;
    const oldUser = await User.findOne({ $or: [{ username }, { email }] });
    if (oldUser) { res.json({ status: false }); } else {
      const user = new User({
        username,
        password: await bcrypt.hash(password, saltRounds),
        email,
      });
      await user.save();
      req.session.user = user;
      res.json({ status: true });
    }
  });

routes
  .route('/signin')
  .get(sessionChecker, (req, res) => {
    res.render('signin');
  })
  .post(async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    const newUser = await User.findOne({ email });
    // console.log(newUser);
    if (newUser && (await bcrypt.compare(password, newUser.password))) {
      req.session.user = newUser;
      res.json({ status: true });
    } else res.json({ status: false });
  });

routes
  .route('/events')
  .get((req, res) => {
    res.render('party');
  })
  .post(async (req, res, next) => {
    // console.log(req.body);
    const name = req.body.name;
    const location = req.body.location;
    const starts = req.body.starts;
    const host = req.session.user.username
    // console.log(req.body);

    const party = new Party({ name, location, starts, host });
    console.log(party);
    try {
      await party.save();
      return res.redirect(`/events/${party.id}`);
    }
    catch (err) {
      return res.render('party', { errors: [err] });
    }
  });

routes
  .route('/events/:id')
  .get(async (req, res) => {
    const partyShow = await Party.findById(req.params.id)
    res.render('details', { partyShow });
  })
  .delete( async (req, res, next) => {
    await Party.deleteOne({ _id: req.params.id });
    res.json({res: true});
  });

routes
  .route("/update/:id")
  .get(async (req, res) => {
    // const user = req.session.user;
    const party = await Party.findById(req.params.id);
    res.render("edit", { party });
  })
  .post(async (req, res) => {
    const party = await Party.findById(req.params.id);
    const { name, location, starts } = req.body;
    party.name = name;
    party.location = location;
    party.starts = starts;
    await party.save();
    res.redirect("/");
  });

routes
  .route('/logout')
  .get(async (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      try {
        await req.session.destroy();
        res.clearCookie('user_sid');
        res.redirect('/');
      } catch (error) {
        next(error);
      }
    } else {
      res.redirect('/login');
    }
  });


module.exports = routes;