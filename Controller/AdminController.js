const dotenv = require('dotenv').config();
const UserModel = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

const jwt = require('jsonwebtoken');


const CreateUser = async (req, res) => {
  try {
    const {
      name, email, password, mobile, address, city, DOB, DOM, spouseName,
      classification, designation, committee, businessPhone, clubName,
      occupation, businessName, businessEmail, businessAddress
    } = req.body;

    let userPhotoPath, spousePhotoPath;

    if (req.files && req.files.userPhoto) {
      userPhotoPath = req.files.userPhoto[0].path;
    }

    if (req.files && req.files.spousePhoto) {
      spousePhotoPath = req.files.spousePhoto[0].path;
    }

    const findExistingUser = await UserModel.findOne({ email: email });
    if (findExistingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });

    const uploadPromises = [];
    if (userPhotoPath) uploadPromises.push(cloudinary.uploader.upload(userPhotoPath));
    if (spousePhotoPath) uploadPromises.push(cloudinary.uploader.upload(spousePhotoPath));

    const uploadResults = await Promise.all(uploadPromises);

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ 
      name, email, password: hashPassword, mobile, address, city, DOB, DOM,
      spouseName, occupation, businessName, businessPhone, classification,
      designation, committee, clubName, businessEmail, businessAddress,
      userPhoto: uploadResults[0] ? uploadResults[0].secure_url : null,
      spousePhoto: uploadResults[1] ? uploadResults[1].secure_url : null,
    }); 

    const saveUser = await newUser.save();
    res.status(200).json({ userData: saveUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }  
}
 



  module.exports={
    CreateUser,
  }