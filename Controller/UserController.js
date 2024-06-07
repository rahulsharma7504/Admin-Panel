const dotenv = require('dotenv').config();
const User = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

const jwt = require('jsonwebtoken')

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

    const findExistingUser = await User.findOne({ email: email });
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

    const newUser = new User({
      name, email, password: hashPassword, mobile, address, city, DOB, DOM,
      spouseName, occupation, businessName, businessPhone, classification,
      designation, committee,      clubName, businessEmail, businessAddress,
      userPhoto: uploadResults[0] ? uploadResults[0].secure_url : null,
      spousePhoto: uploadResults[1] ? uploadResults[1].secure_url : null,
    });

    const saveUser = await newUser.save();
    res.status(200).json({ userData: saveUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};



    

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    } else if (user.status == 'Inactive') {
      return res.status(400).json({ message: "Invalid User" })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" })
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({
      token, user: {
        _id: user._id,
        name: user.name,
        status: user.status,
        email: user.email,
        lastLogin: user.lastLogin,
        isAdmin: user.isAdmin 
      }
    })
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const updateByStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const user = await User.findOne({ _id: id });
  user.status = status;
  await user.save();
  res.status(200).json({ message: "Status Changed Successfull" })

}


// const logout = async (req, res) => {
//   const email = req.body.email;
//   const user = await User.findOne({ email: email });
//   res.status(200).json({ message: "User logged out successfully" })

// }


const Details = async (req, res) => {
  const id = req.query.id
  console.log(id)
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" })

  }
  res.status(200).json({ user })
}

// Get aLL USERS
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ isAdmin: false });
    res.status(200).json({ allUsers: allUsers })
  } catch (error) {
    console.log(error)
  }
}
//get only one user
const getOneuser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
  }
}

const updateUserById = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const findUser = await User.findById(id);
  if (!findUser) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(findUser)
}



const UpdateUser = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, mobile, address, city, DOB, DOM, spouseName, occupation, businessName, membershipID, businessPhone, classification, clubName, businessEmail, businessAddress } = req.body;

    // Configure Cloudinary only once, outside of the conditional blocks

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });

    // Handle userPhoto upload
    if (req.files && req.files.userPhoto && req.files.userPhoto[0]) {
      try {
        const userPPath = await cloudinary.uploader.upload(req.files.userPhoto[0].path);
        findUser.userPhoto = userPPath.secure_url;
      } catch (uploadError) {
        console.error("Error uploading userPhoto:", uploadError);
      }
    }

    // Handle spousePhoto upload
    if (req.files && req.files.spousePhoto && req.files.spousePhoto[0]) {
      try {
        const spousePPath = await cloudinary.uploader.upload(req.files.spousePhoto[0].path);
        findUser.spousePhoto = spousePPath.secure_url;
      } catch (uploadError) {
        console.error("Error uploading spousePhoto:", uploadError);
      }
    }

    // Update user fields
    findUser.name = name;
    findUser.email = email;
    findUser.mobile = mobile;
    findUser.address = address;
    findUser.city = city;
    findUser.DOB = DOB;
    findUser.DOM = DOM;
    findUser.spouseName = spouseName;
    findUser.occupation = occupation;
    findUser.businessName = businessName;
    findUser.membershipID = membershipID;
    findUser.businessPhone = businessPhone;
    findUser.classification = classification;
    findUser.clubName = clubName;
    findUser.businessEmail = businessEmail;
    findUser.businessAddress = businessAddress;

    const updatedUser = await findUser.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { 
  CreateUser,
  loginUser,
  Details,
  getAllUsers,
  getOneuser,
  updateUserById,
  UpdateUser,
  updateByStatus
}
