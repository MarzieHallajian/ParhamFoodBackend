const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String,required: true,unique: true,trim: true,minlength: 3},
  password: { type: String, required: true },
  name: { type: String, required: true },
  section: { type: String, required: true },
  address: { type: String, required: true },
  service_sections: [{ type: String, required: true }],
  working_hours: { type: Date, required: true },
  delay: { type: Number, required: true},
  fee: { type: Number, required: true},
}, {
  timestamps: true,
});

const Manager = mongoose.model('Manager', userSchema);

module.exports = Manager;