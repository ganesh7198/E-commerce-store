import bcrypt from "bcryptjs";
import User from "../models/user.models.js";

const createadmin = async () => {
	try{
  const adminExists = await User.findOne({ role: "admin" });

  if (adminExists) {
    return;
  }

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    10
  );

  await User.create({
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });
}
catch(error){
    console.log('error in the create file ',error.message);

}

  
};

export default createadmin;
