const express = require("express");

const server = express();

//display hello world
server.get('/hello', (req, res) => {
    res.send('Hello World')
})

//server listening to port 8080
server.listen('8080', function () {
    console.log('Listening to post 8080')
})