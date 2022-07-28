const bodyParser = require('body-parser');
const path = require('path')
const express = require('express');
const feedRouter = require('./routes/feed');
const mongoose = require('mongoose');
const { user, password } = require('../Section12/util/credentials');
const multer = require('multer');

const MONGODB_URI =
`mongodb+srv://${user}:${password}@cluster0.vbn87.mongodb.net/myFirstDatabase`;

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toString()+"_"+file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/jpeg') {
            cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRouter);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({
        message
    });
});

mongoose.connect(MONGODB_URI)
.then(() => {
    app.listen(8080, () => {
        console.log('Server up')
    });
})
.catch(err => {
    
})

