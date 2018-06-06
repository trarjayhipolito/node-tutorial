const express = require("express");
const bodyParser =  require('body-parser'); 

const server = express();
var connection =  require('./config/db-mysql')

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
//display hello world
server.get('/hello', (req, res) => {
    res.send('Hello World')
})

connection.init((conn) => {
    //we will place our `server.listen` here
    server.listen('8080', function () {
    console.log('Listening to post 8080')
    })

    // dbConnection = conn
    loadModules(server, conn, function (err, resp) {
        if (resp.status === 'success') {
            console.log('---Main Modules Activated----')
        }
    })
})

// function for loading modules
function loadModules (server, dbConnection, callback) {
    var modules = require('./user/api')
    modules.init(server, dbConnection)
    callback(null, { status: 'success' })
}