const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Define the BookmarSchema
 * It includes a user field acting as a reference to the User model, 
 * guaranteeing private ownership of the resources.
 */
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
