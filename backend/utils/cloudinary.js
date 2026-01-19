import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config();


cloudinary.config({
	cloud_name:process.env.CLOUD_NAME,
	api_key:process.env.CLOUDINARY_APT_KEY,
	api_secret:process.env.CLOUDINARY_APT_SECREAT
})

export default cloudinary;