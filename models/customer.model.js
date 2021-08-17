const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  phonenum: {type: String,required: true,unique: true,trim: true,minlength: 11},
  password: { type: String, required: true },
  name: { type: String, required: true },
  section: { type: String, required: true },
  address: { type: String, required: true },
  credit: { type: Number, required: true},
}, {
  timestamps: true,
});

const Customer = mongoose.model('Customer', userSchema);

module.exports = Customer;