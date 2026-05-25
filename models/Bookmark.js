const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookmarkSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);
module.exports = Bookmark;
