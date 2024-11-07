import express from "express";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js"
import { setAuthToken } from "../config/tokenUtils.js";


export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const file = req.file;

    // Validate file existence
    if (!file) {
      return res.status(400).json({
        message: "File is required",
        success: false,
      });
    }

    // Validate password match
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

    // Upload avatar image to Cloudinary
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
      avatar: cloudResponse.secure_url,
    });

    // Set the authentication token for the user
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
        if (password === user.password) {
            return res.status(200).json({
                message : "Logged in successfully",
                success: true
            })
        }
        setAuthToken(user, res);
        return res.status(500).json({
            message: "User doesn't exits",
            success: false
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while login",
            success: false
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    }
}

export const getUserProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false
        });
      }
  
      return res.status(200).json({
        message: "User profile fetched successfully",
        success: true,
        data: user
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false
      });
    }
  };