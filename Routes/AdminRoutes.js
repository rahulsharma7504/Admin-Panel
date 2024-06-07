const express=require('express');
const adminRoute=express();
const multer=require('multer')
const path=require('path');
adminRoute.use(express.urlencoded({extended:true}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });    

const AdminController=require('../Controller/AdminController');

adminRoute.post('/create-user',upload.fields([{ name: 'userPhoto', maxCount: 1 }, { name: 'spousePhoto', maxCount: 1 }]) ,AdminController.CreateUser)

module.exports=adminRoute 