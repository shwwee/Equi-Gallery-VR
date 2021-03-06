'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('equi-gallery:auth-router');
const basicAuth = require('../lib/basic-auth-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const User = require('../model/user-model.js');

const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST api/signup');

  let password = req.body.password;
  let username = req.body.username;
  let unique = req.body.username.unique;
  delete req.body.password;
  let user = new User(req.body);

  if(!username)
    return next(createError(400, 'username required'));
  if(username.length < 5)
    return next(createError(400, 'username must be more than 5 characters'));

  if(!password)
    return next(createError(400, 'password required'));
  if(password.length < 6)
    return next(createError(400, 'password must be 6 characters'));

  user.generatePasswordHash(password)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => res.send(token))
    .catch(next);
});

authRouter.get('/api/login', basicAuth, function(req, res, next) {
  debug('GET /api/login');

  User.findOne({email: req.auth.email})
  .then(user => user.comparePasswordHash(req.auth.password))
  .catch(err => Promise.reject(createError(401, err.message)))
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});
