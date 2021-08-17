const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  cust_phone: {type: String,required: true,unique: true,trim: true,minlength: 11},
  res_name: { type: String, required: true },
  food_name: { type: String, required: true },
  content: { type: String, required: false, maxLength:140},
  reply: { type: String, required: false },
  rate: { type: Number, required: false,max: 5,min: 1},
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', userSchema);

module.exports = Comment;