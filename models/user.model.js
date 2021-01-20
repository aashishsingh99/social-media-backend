const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  friends: [{ type: ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});
const User = mongoose.model('User', userSchema);
module.exports = User;
