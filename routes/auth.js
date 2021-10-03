const express = require('express');
const router = express.Router();
const User = require('../database_models/UserSchema');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET='personaldiary';
const fetchuser= require("../middleware/fetchuser.js");




//ROUTE :1  creating a user POST /api/auth/createuser
router.post('/createuser', [
    //checking for error
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    //if some validtion error occurs then this if will run
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //if no validation error occurs then user will created
    try {
        // here it is checking for duplicacy
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "a user with this email already exist" });
        }
        const salt = await bcrypt.genSaltSync(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: securePassword,
            email: req.body.email,
        });
        const data={
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        res.send("user created\n"+authtoken);


    } catch (err) {
        console.log(err);
        res.status(500).send("some error occured");
    }
})





//ROUTE :2 Log in and authenticating a user POST /api/auth/login
router.post('/login', [
    //checking for error
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password can not be blank').exists()
],async (req, res)=>{
    //if some validtion error occurs then this if will run
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //if input details are not wrong
    try {
        //extracting the log in details
        const {email, password}= req.body;
        //checking if that user exist
        let user = await User.findOne({email: email});
        if(!user){
            res.status(400).json({error:"Wrong credentials"});
        }
        //comapring the passwords
        const comparePassword = await bcrypt.compare(password, user.password);
        //if password does not match
        if(!comparePassword){
            res.status(400).json({error:"Wrong credentials"});
        }
        // if matches then send the payload, i.e., the users data and provide a signed token
        const data={
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        //provide the token to user
        res.json({authtoken});
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error occured");
    }
})



//ROUTE :3 Get the details of logged user: POST /api/auth/getuser

router.post('/getuser', fetchuser, async(req, res)=>{
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error occured");
    }
})

module.exports = router;