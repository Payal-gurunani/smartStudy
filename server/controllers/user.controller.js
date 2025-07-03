import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/genratetoken.js";

const Register = asyncHandler(async(req,res)=>{
const {username , email, password} = req.body;
if([username ,email ,password ].some((field)=>field?.trim() ==="")){
    throw new ApiError(400,"All fields are required")
}
const existuser = await User.findOne({
  $or: [{ email }]
});

if(existuser){
    throw new ApiError(409 , "User with this mail address is already exist")
}


if(!password || password.trim() ===""){
    throw new ApiError(400,"Password required")
}

const user = await User.create({
    username,email,password
})

const createduser = await User.findById(user._id).select('-password');
if(!createduser){
     throw new ApiError(500,"User not created")
}


 return res
    .status(201)
    .json(
        new ApiResponse(201,createduser,"Registraion successfull")
)
})

const loginUser = asyncHandler(async (req,res)=>{
const {email , password} = req.body;
if (!email || !password) {
    throw new ApiError(400, "Email and Password is required")
  }

  const user = await User.findOne({email});
  if(!user) throw new ApiError(400,"User not found")
const passwordMatch = await user.matchPassword(password);
  if(!passwordMatch){
    throw new ApiError(401,"Invalid password")
  }

  const userLogin  = await User.findById(user._id).select("-password")
 
 const tokenOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", // prevents CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};
   const token =  generateToken(user);
  if(!token){
    throw new ApiError(500,"Token generation failed")
  }
  
  return res
  .status(200)
   .cookie("token", token, tokenOptions)
  .json(
    new ApiResponse(200,{
        token,
        user:userLogin,
    },"Successfully login")
  )

})

const logoutUser = asyncHandler(async (req, res) => {
res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
});
return res.status(200).json(new ApiResponse(200, {}, "Logged out"));
});

// controllers/userController.js
const checkLogin = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  res.status(200).json({
    success: true,
    message: "Authenticated",
    data: { user: req.user }, // or just a minimal set like name/email
  });
});


const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, user, "User profile fetched successfully")
  );
});

export {Register,loginUser,logoutUser,getProfile,checkLogin}