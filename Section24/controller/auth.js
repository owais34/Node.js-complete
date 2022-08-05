const User = require('../models/user');
const {validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode(422);
        error.data = err.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
    .then(hashedPw => {
        const user = new User({
            email,
            password: hashedPw,
            name
        });
        return user.save()
    })
    .then(result => {
        res.status(201).json({
            message: 'User created',
            user_id: result.user_id
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email})
    .then(user => {
        if (!user) {
            const error = new Error('A user with this email does\'nt exist');
            error.statusCode = 401
            throw error;
        }
        loadedUser = user;
        bcrypt.compare(password, user.password)
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'secceret', {expiresIn: '1h'});
            res.status(200).json({token,userId: loadedUser._id.toString()})

        })

    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}