/* 
 * Node.js 
 */

/* global __dirname, blog, _id */

// Set up connection instance between Node.js Server and MongoDB
var express = require('express');

var bodyParser = require('body-parser');

// Create BlogRoll MongoDB Schema
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogroll');

var Schema = mongoose.Schema;

var BlogSchema = new Schema({
   author: String,
   title: String,
   url: String
});

mongoose.model('Blog', BlogSchema);

// Create Test Data in MongoDB Schema
var Blog = mongoose.model('Blog');
/*
var blog = new Blog({
    author: 'Michael',
    title: 'Michael\'s Blog',
    url: 'http://michaelsblog.com'
});
blog.save();
*/

// Set up the Root Directoty in Node.JS Server
var app = express();
app.use(express.static(__dirname + '/public_html'));

// the Body Parser that JSON thatis going to basically set up
// by the parser persion
app.use(bodyParser.json());

// Declation to Get Routes : Connection to MongoDB Schema's item._id
app.get('/api/blogs', function(req, res) {
    Blog.find(function(err, docs) {
        docs.forEach(function(item) {
            console.log('Recieved a GET request for _id: ' + item._id);
        });
        res.send(docs);
    });
});

// Post Route
app.post('/api/blogs', function(req, res) {
    console.log('Recieved a POST request');
    // var key request body
    for (var key in req.body) {
        // log the key
        console.log(key + ': ' + req.body[key]);
    }
    
    var blog = new Blog(req.body);
    // POST request
    blog.save(function(err, doc) {
        // POST response
        res.send(doc);
    });
});

app.delete('/api/blogs/:id',
    function(req, res) {
        console.log('Recieved a DELETE request for _id: ' + req.params.id);
        Blog.remove({_id: req.params.id}, 
    function(err) {res.send({_id: req.params.id});
    });
});

app.put('/api/blogs/:id', function(req, res) {
    console.log('Recieved an UPDATE request for _id: ' + req.params.id);
    Blog.update({_id: req.params.id}, req.body, function(err){
        res.send({_id: req.params.ed});
    });
});

// This is Node.js Server configurations
var port = 3000;

app.listen(port);

console.log('server on ' + port);