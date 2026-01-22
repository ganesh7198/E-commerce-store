export const createcheakoutsessios=(req,res)=>{
     try{
          
	 }catch(error){
       console.log('error tn the create cheak out session',error.message);
	   res.status(500).json({message:"internal server error"});
	 }
}