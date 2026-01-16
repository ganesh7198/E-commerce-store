import jwt from "jsonwebtoken";

const generateAndSetCookie = async (userid, res) => {
  // Generate JWT token
  const token = jwt.sign(
    { id: userid },             // payload
    process.env.JWT_SECRET,     // secret
    { expiresIn: "1d" }        // token expires in 1 day
  );

  // Set cookie
  res.cookie("jwt-ecommerce-token", token, {
    httpOnly: true,                           // cannot be accessed by JS
    secure: process.env.NODE_ENV === "production", // only over HTTPS
    sameSite: "strict",                        // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,              // 1 day in milliseconds
  });


};

export default generateAndSetCookie;
