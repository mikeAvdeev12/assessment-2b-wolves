const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const Partyschema = new Schema({
  name: String,
  location: String,
  starts: Date,
    host: String,
});


module.exports = model('party', Partyschema);
