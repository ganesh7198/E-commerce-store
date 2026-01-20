import express from "express";
import { addtocartcontroller, getallcartproducts, removefromcart, updateproductqunatity } from "../controllers/cart.controller.js";
import { protectedroute } from "../middleware/protectedroute.middleware.js";

const router=express.Router();

router.post('/addtocart',protectedroute,addtocartcontroller)
router.get('/cart',protectedroute,getallcartproducts)
router.delete('/remove',protectedroute,removefromcart)
router.patch('/cartupdate',protectedroute,updateproductqunatity)

export default router