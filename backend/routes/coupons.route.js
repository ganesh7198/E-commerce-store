import express from "express";
import { protectedroute } from "../middleware/protectedroute.middleware.js";
import { getcoupon, validcoupon } from "../controllers/coupon.controller.js";


const router=express.Router()

router.get("/",protectedroute,getcoupon)
router.get("/valid",protectedroute,validcoupon)

export default router