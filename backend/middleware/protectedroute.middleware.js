import express from "express";
import User from "../models/user.models.js";
import jwt from 'jsonwebtoken'

export const protectedroute= async (req,res,next)=>{
     try{
             const accesstoken=req.cookies.access_token;
			 if(!accesstoken){
				return res.status(401).json({message:"no access token found please login first"});
			 }
			 const decoded=jwt.verify(accesstoken,process.env.ACCESS_TOKEN_SECRET);
			 const user= await User.findById(decoded.id).select("-password");
			 if(!user){
				return res.status(404).json({message:"user not found ,sign up first "});
			 }
			 req.user=user;
			 next();

	 }catch(error){
           console.log("error in the protected route controller ");
		   res.status(500).json({message:"intrnal server error "});
	 }
}

export const adminroute=async (req,res,next)=>{
  try{
      if(req.user && req.user.role==="admin"){
		next()
	  }else{
		res.status(403).json({message:"access denied -  admin only "})
	  }
  }catch(error){
         res.status(500).json({message:"intrnal server error "});
  }
}

export const providerroute=async(req,res,next)=>{
     try{
         if(req.user && req.user.role==="provider" || req.user && req.user.role === "admin"){
			next()
		 }else{
			res.status(403).json({message: "access denied - provider and admin  only"})
		 }
	 }catch{
             res.status(500).json({message:"intrnal server error "});
	 }
}