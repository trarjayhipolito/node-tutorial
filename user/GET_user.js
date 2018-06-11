exports.GET_user = function(req, res, _dbConnection){
    //initialize database connection
    dbConnection = _dbConnection;

    //initialize response
    var resp;

    //fetch userId in parameter
    var params  = {
        userId: req.params.userId
    };

    //Call get user fn
    getUser(params, function(err, user){
        //check the server
        if (err){
            let err = {}
            err.status = '500'
            err.message = 'Internal Server Error'
            res.send(err)
        }

        //check if there's fetched data
        if (user !== null){
            resp = {status: "200", user: user};
        } else {
            resp = {status: "204", message: "No Data Available!"};
        }

        //send response
        res.send(resp);

    });
};

//getUser fn
//-------------
function getUser(params, callback) {
    //declare userId
    var userId = params.userId;

    //sql command
    var sql = 'SELECT * FROM user_tbl WHERE user_isdel = 0 AND user_id = ?';

     //executing sql
     dbConnection.query(sql, userId, function(err, recordset){
        //check error on fetching
        if (err) {
            console.log('error: getUser Error : ' + err);
            callback(err, null);
        }

        //initalize userResponse
        var userRes = null;
        
        //check if there's record
        if (recordset.length !== 0){
            //save record
            userRes = {
                user_id: recordset[0].user_id,
                user_fname: recordset[0].user_fname,
                user_lname: recordset[0].user_lname,
                user_isdel: recordset[0].user_isdel
            };
        }
        
        //return User record
        callback(null,userRes);
    });
    

}

