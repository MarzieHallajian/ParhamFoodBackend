const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  total: { type: Number, required: false },
  list: [{ type: String, required: true}],
  cust_phone: { type: String, required: true},
  res_name: { type: String, required: true},
  user_accepted: { type: Boolean, required: false, default: false},
  manager_accepted: { type: Boolean, required: false, default: false},
  pre_delay: { type: Number, required: false, default: 0},
  sent_delay: { type: Number, required: false, default: 0},
  finished: {type: Boolean, required: false, default:false}
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', userSchema);

module.exports = Order;