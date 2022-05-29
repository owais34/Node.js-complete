const express = require('express');
const { check, body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[
    check('email').isEmail().withMessage('Please enter a valid email')
    .custom((value,{req})=>{
        return User.findOne({email:value})
        .then(userdoc=>{
            if(!userdoc)
            return new Promise.reject('Email doesnt exist , Please signup')
        })
    }),
    check('password').isLength({min:5}).isAlphanumeric().withMessage('Please enter password with text and at least 5 chars')
],
 authController.postLogin);

router.post('/signup',[
    check('email').isEmail().withMessage('Please enter a valid email')
    .custom((value,{req})=>{
        return User.findOne({ email: value })
        .then(userDoc => {
            if (userDoc) {
           return new Promise.reject('E-Mail exists already, please pick a different one.')
            }
        }); 
    }),
    body('password',"Please enter password with text and at least 5 chars").isLength({min:5}).isAlphanumeric(),
    body('confirmPassword').custom((value,{ req })=>{
        if(value!==req.body.password)
        throw new Error("Passwords dont match")
        return true;
    })
], 
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
