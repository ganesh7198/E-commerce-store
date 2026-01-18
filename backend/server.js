import express from 'express';
import dotenv from 'dotenv';
import authroute from './routes/auth.route.js';
import connectDB from './utils/db.js';
import createadmin from './utils/createadmin.js';
import cookieParser from 'cookie-parser';



const app=express();
dotenv.config();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth',authroute)


const port=process.env.PORT || 5000 ;
app.listen(port, async(req,res)=>{
	await connectDB();
	await createadmin();
 console.log(`app at listening at http://localhost:${port}`);
})