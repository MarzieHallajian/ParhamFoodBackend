const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true},
  price: { type: Number, required: true},
  res_name: { type: String, required: true},
  available: { type: Boolean, required: true},
  pre_delay: { type: Number, required: true},
}, {
  timestamps: true,
});

const Food = mongoose.model('Food', userSchema);

module.exports = Food;