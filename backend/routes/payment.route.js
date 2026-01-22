import express from "express";
import { protectedroute } from "../middleware/protectedroute.middleware.js";
import { createcheakoutsessios } from "../controllers/payment.controller.js";

const router=express.Router();

router.post('/create-cheakout-session',protectedroute,createcheakoutsessios)

export default router;
