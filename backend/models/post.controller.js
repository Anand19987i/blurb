import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'   
    }],
    comments: [{
        types: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;