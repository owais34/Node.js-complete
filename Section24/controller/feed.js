const {validationResult} = require('express-validator/check');
const Post = require('../models/post');
const User = require('../models/user')
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const io = require('../socket');

exports.getFeed = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    try {
    const perPage = 2;
    let totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
    .populate('creator')
    .skip((currentPage - 1) * perPage).limit(perPage);
    res.status(200).json({
            message: 'Fetched posts successfully',
            posts,
            totalItems
    });
    }
    catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
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
    let creator;
    const post = new Post({
        title,
        content,
        imageUrl: 'images/duckJpeg',
        creator: req.userId
    });
    post.save()
    .then(result => {
        return User.findById(req.userId)
    })
    .then(user => {
        user.posts.push(post);
        await user.save();
        io.getIo().emit('posts', {action:'create', 
        post: {...post.doc, creator: {
            _id: req.userId,
            name: user.name
        }}});
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'post created successfully',
            post: post,
            creator: {
                _id: creator._id,
                name: creator.name
            }
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
        if (post.creator.toString() !== req.userId) {
            const err = new Error('Not authorized');
            err.statusCode = 403;
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
        return User.findById(req.userId)
    })
    .then(user => {
        user.posts.pull(postId);
        return user.save();
    })
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'Deleted post!'});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.getStatus = (req, res, next) => {
    User.findById(req.userId)
    .then(user => {
        if (!user) {
            const error = new Error('Invalid User');
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({status:user.status});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.putStatus = (req, res, next) => {
    User.findById(req.userId)
    .then(user => {
        if (!user) {
            const error = new Error('Invalid User');
            error.statusCode = 404;
            throw error;
        }
        user.status = req.body.status;
        return user.save()
    })
    .then(result => {
        return res.status(200).json({message: 'Status Updated', status: req.body.status});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

const clearImage = filePath => {
    filePath = path.join(__dirname,'..',filePath);
    fs.unlink(filePath, err => console.log(err));
}
