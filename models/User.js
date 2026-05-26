const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Define the User Schema
 * It supports both local and third-party methods
 */
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.githubId;
    }
  },
  githubId: {
    type: String,
    required: function() {
      return !this.password;
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
