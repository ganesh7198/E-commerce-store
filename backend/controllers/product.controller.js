import Product from "../models/product.models";


export const getallproduct=async (req,res)=>{
	try{
	     const page = Math.max(1, Number(req.query.page) || 1);
         const limit = Math.min(100, Number(req.query.limit) || 50);
		const skip = (page - 1) * limit;
          const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
		  if(!products){
			return res.status(404).json({success:false,message:"no products found "})
		  }
		  res.status(200).json({success:true,message:"products",data:products})
	}catch(error){
        console.log('error in the get all products controller ',error.message);
		res.status(500).json({sucess:false,message:"intrnal  server error "});
	}
}