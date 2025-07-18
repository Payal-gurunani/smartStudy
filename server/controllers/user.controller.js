import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/genratetoken.js";
import { Session } from "../models/Session.model.js";
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  await Session.deleteMany({ userId: user._id });

  const token = generateToken(user);

  await Session.create({ userId: user._id, token });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user },
  });
});



const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await Session.deleteOne({ token });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(new ApiResponse(200, {}, "Logged out"));
});


const checkLogin = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  res.status(200).json({
    success: true,
    message: "Authenticated",
    data: { user: req.user }, 
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