const {validationResult} = require('express-validator/check');
const Post = require('../models/post');

exports.getFeed = (req, res, next) => {
    res.status(200).json({posts:[
        {
            _id:'',
            title: 'fp',
            content: 'imma f u up',
            imageUrl: 'images/duck.jpg',
            creator: {
                name:'Maxmillan'
            },
            date: new Date()
        }
    ]});
}

exports.postPost = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new Error('Validation failed, incorrect data');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title,
        content,
        imageUrl: 'images/duckJpeg',
        creator: {
            name: 'Maxmillan'
        }
    });
    post.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'post created successfully',
            post: result
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    
}

