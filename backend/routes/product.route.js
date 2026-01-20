import express from "express";
import { toggleFeaturedProduct, deleteproduct, getallproduct, getfeaturedproduct, getproductsbycategory, recommmandationproduct,createproduct } from "../controllers/product.controller.js";
import { adminroute, protectedroute, providerroute } from "../middleware/protectedroute.middleware.js";

const router=express.Router();


router.get('/',protectedroute,adminroute,getallproduct)
router.get('/featured',getfeaturedproduct)
router.patch('/:id',protectedroute,adminroute,toggleFeaturedProduct)
router.get('/category/:category',getproductsbycategory)
router.post('/createproduct',protectedroute,providerroute,createproduct)
router.delete('/delete/:id',protectedroute,providerroute,deleteproduct)
router.get('/recommendations',recommmandationproduct)



export default router;