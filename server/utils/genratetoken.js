import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()
export const generateToken = (user) =>{
   const t =  jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "2h" }
);
    return t;
    
    
}