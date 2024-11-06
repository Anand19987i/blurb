import express from "express";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../config/datauri.js"
import { setAuthToken } from "../config/tokenUtils.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password does not matched",
                success: false,
            })
        }
        const newUser = await User.create({
            name,
            email,
            password,
            confirmPassword,
            avatar: cloudResponse.secure_url
        })
        setAuthToken(newUser, res);
        return res.status(201).json({
            message: "User created",
            success: true,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        })
    }
}

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