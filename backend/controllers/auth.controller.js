import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.models.js'
import generateAndSetCookie from '../utils/generateandsetcookie.js';
import { redis } from '../utils/redis.js';

const storerefereshtoken = async(userid,refreshtoken)=>{
   await redis.set(`refresh_token:${userid}`,refreshtoken, "EX",7*24*60*60)
}
const setcookie= async (res,accesstoken,refreshtoken)=>{
   res.cookie("jwt-ecommerce-token", accesstoken, {
    httpOnly: true,                           // cannot be accessed by JS
    secure: process.env.NODE_ENV === "production", // only over HTTPS
    sameSite: "strict",                        // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,              // 1 day in milliseconds
  });
}
export const signupcontroller = async (req, res) => {
  try {
    const { username , email, password, role } = req.body; 

    // ---------------- VALIDATION ----------------
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    if (username.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Username should be at least 6 characters" });
    }

 if (password.length < 8 || password.length > 16) {
  return res.status(400).json({
    success: false,
    message: "Password should be between 8 to 16 characters",
  });
}


    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid email" });
    }

    // Check if email already exists
    const existuser = await User.findOne({ email });
    if (existuser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Check if username already exists
    const existusername = await User.findOne({ username });
    if (existusername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Role validation
    const allowedRoles = ["user", "provider"];
    const finalRole = allowedRoles.includes(role) ? role : "user";

    // ---------------- HASH PASSWORD ----------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ---------------- CREATE NEW USER ----------------
    const newuser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: finalRole,
    });
    const {accesstoken,refreshtoken}=await generateAndSetCookie(newuser._id);
    await storerefereshtoken(newuser._id,refreshtoken)
    await setcookie(accesstoken,refreshtoken,res);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: newuser._id,
        username: newuser.username,
        email: newuser.email,
        role: newuser.role,
      },
    });
  } catch (error) {
    console.log("Error in signupcontroller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email",
      });
    }

    // Find user
    const existeduser = await User.findOne({ email });
    if (!existeduser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const validpassword = await bcrypt.compare(
      password,
      existeduser.password
    );

    if (!validpassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Set JWT cookie
    await generateAndSetCookie(existeduser._id, res);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: existeduser._id,
        username: existeduser.username,
        email: existeduser.email,
        role: existeduser.role,
      },
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const logoutcontroller = async (req, res) => {
  try {
    res.clearCookie("jwt-ecommerce-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
