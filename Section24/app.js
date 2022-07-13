const bodyParser = require('body-parser');
const path = require('path')
const express = require('express');
const feedRouter = require('./routes/feed');
const mongoose = require('mongoose');
const { user, password } = require('../Section12/util/credentials');
const MONGODB_URI =
`mongodb+srv://${user}:${password}@cluster0.vbn87.mongodb.net/myFirstDatabase`;

const app = express();


app.use(bodyParser.json());
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

