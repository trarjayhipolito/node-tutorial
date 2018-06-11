exports.PUT_user  =  function (req, res, _dbConnection, next) {
    //call update user
    updateUser(req, res, _dbConnection, next)
}

function  updateUser (req, res, _dbConnection, next) {
    //passes req.body so we can only type body in the future
    let body =  req.body
    id = req.params.userId
    //initialize sqlData array
    let sqlData = []

    //count request body
    //we need to count the body so we will know if there will be a next field to be added in the query.
    let count=0;
    for(let prop in body) {
        if (body.hasOwnProperty(prop)) {
            count++;
        }
    }

    //make update sql query
    let sqlQuery =  ` UPDATE user_tbl
    SET `

    //concat user_fname if not empty to the sql query
    if (body.user_fname) {
        sqlQuery +=  ` user_fname = ?`
        sqlData.push(body.user_fname)
        
        //check if the body object we count is above 1 then we will add a comma
        if(count >  1){
            sqlQuery +=  `,`
            count--;
        }
    }
    //concat user_lname if not empty to the sql query
    if (body.user_lname) {
        sqlQuery +=  ` user_lname = ? `
        sqlData.push(body.user_lname)
        
        //check if the body object we count is above 1 then we will add a comma
        if(count >  1){
            sqlQuery +=  `,`
            count--;
        }
    }

    //concat user_isdel if not empty to the sql query
    //is user_isdel is one, delete.
    if (body.user_isdel || body.user_isdel == 0) {
        sqlQuery +=  ` user_isdel = ? `
        sqlData.push(body.user_isdel)
        
        //check if the body object we count is above 1 then we will add a comma
        if(count >  1){
            sqlQuery +=  `,`
            count--;
        }
    }

    //add WHERE query in which id we will be updating
    sqlData.push(id)
    sqlQuery +=  ` WHERE user_id = ? `

    _dbConnection.query(sqlQuery, sqlData, function (err, result) {
        if (err) {
            let err = {}
            console.log('error: updateUser Err : '  + err)
            err.status  =  '500'
            err.message  =  'Internal Server Error'
            res.send(err)
        } else {
            console.log (sqlQuery)
			sqlQuery = 'SELECT * FROM user_tbl WHERE user_id = ' + id
			_dbConnection.query(sqlQuery, function(err, result){
				let resp = {status: '200', user: result}
                res.send(resp)  
			})
        }
    })
}