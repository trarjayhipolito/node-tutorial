const async =  require('async')

exports.POST_user = function(req, res, _dbConnection){
    insertUser(req, res, _dbConnection, function (err, result){
        if (err) {
            //check if its a error
            if(err.status  !=  '204'){
                let err = {}
                err.status  =  '500'
                err.message  =  'Internal Server Error'
            }
            res.send(err);
        } else {
            res.send(result);
        }
    });
}

//insertUser fn
//--------------
function  insertUser(req, res, _dbConnection, callback) {
    //initialize database connection
    var dbConnection = _dbConnection;
    
    //initialize response
    var resp;
    
    //if any of the functions pass an error to the callback
    //the next function is not executed and the main callback is 
    //immediately called with the error
    async.waterfall([
	    function (callback) {
		    validateCredential(req.body, function(err, result){
			    //check if the validateCredentials return a callback(err, null)
			    if (err) {
				    callback(err, null);
			    } else {
				    //check if the validateCredentials return a callback(null, result)
				    if (result) {
					    let err = {
						    status: '204',
						    message: result
					    };
					    callback(err, null);
				    } else {
					    callback();
				    }
			    }    
		    });
	    },
	    function (callback) {
		    putUser(dbConnection, req.body, function(err, result){
			    if (err) {
				    callback(err, null);
			    } else {
				    callback(null, result.insertId);
			    }
		    });
	    }
    ],
    //main callback function
    function (err, userId) {
	    if (err) {
		    callback(err, null)
	    } else {
		    resp = {status: "200", userId: userId};
		    callback(null, resp);
	    }
    })
}
//--------------

//putUser fn
//--------------
function  putUser(dbConnection, body, callback) {
    //we will save the user_fname and user_lname that in the request body
    let sqlData = [body.user_fname, body.user_lname];
    
    let sqlQuery =  'INSERT INTO user_tbl (user_fname, user_lname, user_isdel) '  +
    'VALUES (?, ?, 0)';

    dbConnection.query(sqlQuery, sqlData, function(err, result) {
    if (err) {
    logger.log('error', TAG +  'putUser Err : '  + err)
    callback(err, null);
    } else {
    callback(null, result);
    }
    });
}
//--------------

//validateCredential fn
//--------------
function  validateCredential(body, callback){
	if (body.user_fname  ==  ''  ||  body.user_fname  ==  null) {
		result =  'User First Name is empty';
		callback(null, result)
	} else  if (body.user_lname  ==  ''  ||  body.user_lname  ==  null) {
		result =  'User Last Name is empty';
		callback(null, result)
	}else{
		callback()
	}
}
//--------------