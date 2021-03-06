const {validationResult} = require('express-validator/check');
const Post = require('../models/post');
const path = require('path');
const fs = require('fs');
const { count } = require('console');

exports.getFeed = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
    .then(count=>{
        totalItems=count
        return  Post.find().skip((currentPage - 1) * perPage).limit(perPage);
    })
    .then(posts => {
        res.status(200).json({
            message: 'Fetched posts successfully',
            posts,
            totalItems
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
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
    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const imageUrl = req.file.path
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

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Post fetched',
            post
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updatePost = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new Error('Validation failed, incorrect data');
        error.statusCode = 422;
        throw error;
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();

    })
    .then(result => {
        res.status(200).json({ message: 'Post Updated', post: result});
    })
    .catch(err =>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}; 

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);
    })
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'Deleted post!'})
    })
}

const clearImage = filePath => {
    filePath = path.join(__dirname,'..',filePath);
    fs.unlink(filePath, err => console.log(err));
}
