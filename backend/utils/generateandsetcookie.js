import jwt from "jsonwebtoken";

const generateAndSetCookie = async (userid) => {
  // Generate JWT token
  const accesstoken = jwt.sign(
    { id: userid },             // payload
    process.env.JWT_SECRET,     // secret
    { expiresIn: "1d" }        // token expires in 1 day
  );
  const refreshtoken=jwt.sign(
    {userid}
    ,process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:"15d"}
  )


  return {accesstoken,refreshtoken}
};

export default generateAndSetCookie;
