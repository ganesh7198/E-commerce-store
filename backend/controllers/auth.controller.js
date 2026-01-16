import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.models.js'


import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signupcontroller = async (req, res) => {
  try {
    const { username, email, password, role } = req.body; 

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

    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password should be at least 8 characters" });
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


export const logincontroller=(req,res)=>{
   try{
	const {email,password}=req.body;
	if(!email || !password){
		return res.status(400).json({success: false, message:"intrnal server error"})
	}

   }catch(error){
       console.log('erro0r  in the login controller ', error.message)
	   res.status(500).json({sucess: false, message:"internal server error "});
   }
}