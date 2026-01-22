import Coupon from "../models/coupon.models.js"
export const getcoupon=async (req,res)=>{
   try{
        const coupons=await Coupon.findOne({userId : req.user.id,isActive:true});
		res.json(coupons || null)
   }catch(error){
        console.log('error in getcoupne controller ',error.message);
		res.status(500).json({message:"server error",error:error.message});
   }
}

export const validcoupon=async(req,res)=>{
	try{
		const {code}=req.body;
		const coupon=await Coupon.findOne({code:code ,userId:req.user.id,isActive:true});
		if(!coupon){
			return res.status(404).json({message:"coupon not found "})
		}
		if(coupon.expirationDate < new Date()){
			coupon.isActive=false;
			await coupon.save();
			return res.status(400).json({message:"coupone expired"})
		}
		  if (coupon.usedCount >= coupon.maxUses) {
                return res.status(400).json({ message: "Coupon usage limit reached" });
		  }
        	res.json({message:"coupone is valid ",code:coupon.code,discountpercentage:coupon.discountPercentage})

	}catch(error){
		console.log('error in the valid coupon controller',error.message);
		res.status(500).json({message:"server error ", error:error.message});
	}
}