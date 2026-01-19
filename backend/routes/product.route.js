import express from "express";
import { getallproduct } from "../controllers/product.controller";

const router=express.Router();


router.get('/',getallproduct)



export default router;