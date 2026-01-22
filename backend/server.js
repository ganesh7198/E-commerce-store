import express from 'express';
import dotenv from 'dotenv';
import authroute from './routes/auth.route.js';
import productroute from './routes/product.route.js'
import cartroute from './routes/cart.route.js'
import couponsroute from './routes/coupons.route.js'
import paymentroute from './routes/payment.route.js'
import connectDB from './utils/db.js';
import createadmin from './utils/createadmin.js';
import cookieParser from 'cookie-parser';



const app=express();
dotenv.config();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth',authroute)
app.use('/api/v1/products',productroute)
app.use('/api/v1/cart',cartroute)
app.use('/api/v1/coupons',couponsroute)
app.use('/api/v1/payment',paymentroute)


const port=process.env.PORT || 5000 ;
app.listen(port, async(req,res)=>{
	await connectDB();
	await createadmin();
 console.log(`app at listening at http://localhost:${port}`);
})