'use strict'
var logger = require('winston')

// var DbConnectionError = require('../config/DbConnectionError')
var GET_user = require('./GET_user')
var GET_all_user = require('./GET_all_user')
var POST_user = require('./POST_user')
var PUT_user = require('./PUT_user')

module.exports.init = function init (server, dbConnection) {
    
    //Fetch user
    //----------------
    // //get request by user id
    server.get('/api/user/:userId', function (req, res) {
        GET_user.GET_user(req, res, dbConnection)
        console.log('info: done with GET_user.GET_user')
    })  
    //get request all user
    server.get('/api/user', function (req, res) {
        GET_all_user.GET_all_user(req, res, dbConnection)
        console.log('info: done with GET_all_user.GET_all_user')
    })
    //----------------


    //Create user
    //----------------
    server.post('/api/user', function (req, res) {
        POST_user.POST_user(req, res, dbConnection)
        console.log('info', 'done with POST_user.POST_user')
    })
    //---------------

    //Update user
    //---------------
    server.put('/api/user/:userId', function (req, res, next) {
        PUT_user.PUT_user(req, res, dbConnection, next)
        console.log('info', 'done with PUT_user.PUT_user')
    })
    //---------------
}