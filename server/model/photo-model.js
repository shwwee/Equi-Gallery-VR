'use strict';

const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  username: {type: String, required: true},
  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0},
  imageURI: {type: String, required: true, unique: true},
  objectKey: {type: String, required: true, unique: true},
  created: {type: Date, default: Date.now},
});

module.exports = mongoose.model('photo', photoSchema);
