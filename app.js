const express = require('express');
const path = require('path');
const session = require('express-session');
const route = require('./controller/route');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('2602fcf2eab74d3d9a64ef51153a0526');
const mongoose = require('mongoose');
const dbURI = 'mongodb://127.0.0.1/AIFBlog2';
const app = express();
let  port = 3200;

mongoose.connect(dbURI).then((result) => app.listen(port, () => {
    console.log(`listening on port ${port}!`)
}))
.catch((err) => {
    console.log(err)
});

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
app.use(session({secret: 'secret', resave: true, saveUninitialized: true}));

app.use('/', route);