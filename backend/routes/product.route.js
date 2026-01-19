import express from "express";
import { createrproduct, getallproduct, getfeaturedproduct, getproductsbycategory } from "../controllers/product.controller.js";
import { adminroute, protectedroute, providerroute } from "../middleware/protectedroute.middleware.js";

const router=express.Router();


router.get('/',protectedroute,adminroute,getallproduct)
router.get('/featured',getfeaturedproduct)
router.get('/category/:category',getproductsbycategory)
router.post('/createproduct',protectedroute,providerroute,createrproduct)



export default router;