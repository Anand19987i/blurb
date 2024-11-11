import express from "express";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js";
import { setAuthToken } from "../config/tokenUtils.js";
import { OAuth2Client } from 'google-auth-library';
import { Post } from "../models/post.model.js";

const client = new OAuth2Client(process.env.CLIENT_ID); 

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const file = req.file;


    if (!file) {
      return res.status(400).json({
        message: "File is required",
        success: false,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
      avatar: cloudResponse.secure_url,
    });

    setAuthToken(newUser, res);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
          return res.status(500).json({
              message: "User doesn't exist",
              success: false
          });
      }
      if (password === user.password) {
          setAuthToken(user, res); 
      } else {
          return res.status(401).json({
              message: "Invalid credentials",
              success: false
          });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message: "Error while logging in",
          success: false
      });
  }
};


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const cloudinaryResult = await cloudinary.uploader.upload(picture, {
        folder: 'user_avatars',
        public_id: `avatar_${email}`,
        overwrite: true,
      });

      // Create new user in the database
      user = await User.create({
        name,
        email,
        password: 'google-login',
        confirmPassword: 'google-login',
        avatar: cloudinaryResult.secure_url,
      });
    }

    setAuthToken(user, res);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: 'Invalid Google token' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const {name, email } = req.body;
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const userId = req.id;
    let user = await User.findById(userId);
    setAuthToken(user, res);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false
      })
    }

    if (name) user.name = name;
    if (email) user.email = email;
    
    if (cloudResponse) {
      user.avatar = cloudResponse.secure_url;
    }
    await user.save();
    user = {
      id : user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }
    return res.status(200).json({
      message: "Profile update successfully",
      success: true,
    })
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server error",
      success: false
    });
  }
}

export const search  = async (req, res) => {
  const {query} = req.query;
  try {
    const users = await User.find({
      name: {$regex: query, $options: 'i'}
    }).select('name avatar');
    res.json(users);
  } catch (error) {
    res.status(500).json({message: "Error searching for users"});
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ userId: userId }); // Get posts by user
    res.json({ user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};