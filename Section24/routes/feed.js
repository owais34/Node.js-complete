const express = require('express');
const feedController = require('../controller/feed');
const {body} = require('express-validator')

const router = express.Router();

router.get('/posts', feedController.getFeed)

router.post('/post', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], 
feedController.postPost);

module.exports = router;
