import { Post } from "../models/post.model.js";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js";
import { setAuthToken } from "../config/tokenUtils.js";
import { User } from "../models/user.model.js";

export const createPost = async (req, res) => {
    try {
        const { content, userId } = req.body;
        const file = req.file;
        if (!content || !userId) {
            return res.status(400).json({
                message: "Content and user ID are required.",
                success: false,
            });
        }
        let imageUrl = null;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                imageUrl = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error("Error uploading image to Cloudinary:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload image",
                    success: false,
                });
            }
        }
        
        const newPost = await Post.create({
            userId,
            content,
            imageUrl,
        });

        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            post: newPost,
        });

    } catch (error) {
        console.error("Error in createPost:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name avatar')
            .populate('comments.user', 'name avatar').sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({
                message: "No posts found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Posts fetched successfully.",
            success: true,
            posts,  
        });
    } catch (error) {
        console.error("Error in getAllPost:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// In post.controller.js
export const toggleLike = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body; 

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (post.likes.includes(userId)) {

            post.likes.pull(userId);
            await post.save();
            return res.status(200).json({ message: 'Post unliked successfully', post });
        } else {

            post.likes.push(userId);
            await post.save();
            return res.status(200).json({
                message: post.likes.includes(userId) ? 'Post unliked successfully' : 'Post liked successfully',
                success: true,
                post
            });

        }
    } catch (error) {
        console.error('Error toggling like/unlike:', error);
        res.status(500).send('Server error');
    }
};

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, text } = req.body; 

        if (!text || !userId) {
            return res.status(400).json({ message: 'Both userId and comment text are required' });
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ user: userId, text });
        await post.save();

        res.status(200).json({ message: 'Comment added successfully', comments: post.comments });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getCommentsForPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId })
            .populate('userId', 'name avatar')
            .sort({ createdAt: -1 });  

        return res.status(200).json({
            message: "Comments fetched successfully",
            success: true,
            comments,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// In post.controller.js
export const getUserPosts = async (req, res) => {
    const { userId } = req.params;
    try {
        const userPosts = await Post.find({ userId })
            .populate('userId', 'name avatar') 
            .populate({
                path: 'comments.user',  
                select: 'name avatar'   
            })
            .select('content imageUrl likes comments createdAt') 
            .sort({ createdAt: -1 });


        if (userPosts.length === 0) {
            return res.status(404).json({
                message: "No posts found for this user.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "User posts fetched successfully.",
            success: true,
            posts: userPosts,
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
