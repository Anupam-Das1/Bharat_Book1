const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const crypto = require('crypto')
const jwt = require("jsonwebtoken");
const { JWT_SECRET, EMAIL } = require("../config/keys");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const requireLogin = require("../middleware/requireLogin");
const {SENDGRID_API}=require('../config/keys')

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        SENDGRID_API,
    },
  })
);

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exist with that email" });
      }
      bcrypt.hash(password, 12).then((hashedPassward) => {
        const user = new User({
          email,
          password: hashedPassward,
          name,
          pic: pic,
        });
        user
          .save()
          .then((user) => {
              transporter.sendMail({
                to: user.email,
                from: "ad.19u10025@btech.nitdgp.ac.in",
                subject: "Signup Success",
                html: "<h1>Welcome</h1>",
              })
              res.json({ message: "Sent successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email and passward" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or passward" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message:"Succesfully signed in"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token: token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "Invalid email or passward" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/reset-password",(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        } 
        const token=buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({ error: "user dont exist" });
            }
            user.resetToken = token
            user.expireToken = Date.now()+ 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"ad.19u10025@btech.nitdgp.ac.in",
                    subject:"passward reset",
                    html:`
                    <p>passward reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })
        })
    })
})
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router;
