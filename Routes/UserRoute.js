const express=require('express');
const userRoute=express();
const multer=require('multer')
const path=require('path');
userRoute.use(express.urlencoded({extended:true}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  } 
});
const upload = multer({ storage: storage });    

const userController=require('../Controller/UserController');
 userRoute.get('/check',(req,res)=>{
  res.send(`<h2 width="">Welcome to the Admin Panel</h2>`);
 })
userRoute.post('/register',upload.fields([{ name: 'userPhoto', maxCount: 1 }, { name: 'spousePhoto', maxCount: 1 }]) ,userController.CreateUser)
userRoute.post('/login',userController.loginUser)
userRoute.get('/details',userController.Details)
userRoute.get('/all',userController.getAllUsers)
userRoute.get('/getuser/:id',userController.getOneuser)
userRoute.get('/update-user/:id',userController.updateUserById)
userRoute.put('/status/:id',userController.updateByStatus)
userRoute.put('/update/:id',upload.fields([{ name: 'userPhoto', maxCount: 1 }, { name: 'spousePhoto', maxCount: 1 }]),userController.UpdateUser)

module.exports=userRoute 