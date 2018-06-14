# Node-Tutorial

In this tutorial, you will learn the basics in building an API from the scratch.
This tutorial uses express and swagger for API documentation

**Note**: Make sure to read the ***comments*** to know what's happening in the coding process.

## Prerequisites
Install:	
 - [MySql Community 5.6](https://dev.mysql.com/downloads/mysql/5.6.html)
 - [MySql Workbench](https://dev.mysql.com/downloads/workbench/?utm_source=tuicool)
 - [Node JS](https://nodejs.org/en/download/)
 - [PostMan](https://www.getpostman.com/apps)
 - Your favorite Code Editor (for me I use [VS Code](https://code.visualstudio.com/download))

## Technologies Used

 - Async
 - Express
 - Body-parser
 - MySql
 - Swagger

## Installation
In your terminal, go to your folder and execute:

	$ npm init
    
Just enter all the way down, and in your folder, you can see the `package.json` file and click it.
Under the license in `package.json` file.

We will need to install `express`, because it provide small, robust tooling for HTTP servers, making it a great solution for single page applications, web sites, hybrids, or public HTTP APIs. Execute:

    $ npm install -express

The dependencies will be installed in your folder, after installing you can now see the `node-modules` folder where all the dependencies we will use is stored.

Now that the boring installation is done, let's have some fun.

## Let's Get Started

Let’s start out by brainstorming about what we want to build. All we want to build an API that can fetch all the users, fetch a single user, create a user and update a user.

Start out by adding a new file in the root directory of the project. Give it a name of `server.js`.

```js
// server.js
const express =  require('express');
const server =  express();
```

With this added you’re ready to start adding your first hello world app.

First, go to the `package.json` file and in the `"main":"index.js"`, change the `index.js` to `server.js` so when we run it using **nodemon**, the `server.js` will be the one running.

```js
//server.js
//display hello world
server.get('/hello', (req, res) => {
	res.send('Hello World')
})

//server listening to port 8081
server.listen('8081', function () {
	console.log('Listening to post 8081')
})
```

After adding this code in the `server.js` file, execute this in your terminal:

    $ nodemon
    
After that, **nodemon** will run the `server.js` file in the url `localhost:8081`.  Go to [locahost:8081/hello](locahost:8081/hello).

![enter image description here](https://lh3.googleusercontent.com/mFVzOmfz5U24Dwgzdy5EdE5rNYaDHR5cghIzGew4xi8zkTrj6oMYyu0dHnvFpuhL-dqyRxp6xcw)

Voila! You have your hello world app!

### Setting Up Connection

Setting up connection may be complicated but bare with me, I will try my best to explain what's happening.

#### *Install MySql Driver*

Once you have MySQL up and running on your computer, you can access it by using Node.js.

To access a MySQL database with Node.js, you need a MySQL driver. This tutorial will use the "mysql" module, downloaded from NPM.

To download and install the "mysql" module, open the Command Terminal and execute the following:

    $ npm install mysql --save

Now you have downloaded and installed a mysql database driver. Node.js can use this module to manipulate the MySQL database.

```
Note: Open your **MySql Workbench** and create a schema named `test`, inside create a table named `user_tbl` with the fields:

 - user_id (INT11 | Auto Increment)
 - user_fname (VARCHAR(45))
 - user_lname (VARCHAR(45))
 - user_isdel (INT11)
```
Create a folder name `config` and inside that, create a file named `db-mysql.js`.

```js
// db-mysql.js 
var mysql = require('mysql');
```

First, we will declare your config to `db-mysql.js`.

```js
// db-mysql.js
database  = {
	user: 'root',
	password: '',
	server: '127.0.0.1',
	database: 'test',
	port: 3306,
	options: {
	encrypt: true
	}
}
```

This is the default config unless you configured your config, feel free to change it.

Secondly we will initialize our database connection, add this code to your `db-mysql.js`.

```js
/**
* Initialize database connection
*/
exports.init  =  function (connect_callback) {
	console.log("Initialising module db-mysql");
	initializeConnection(connect_callback);
};
```

This is the `initializeConnection` function.

```js
// Function call for database connection
function  initializeConnection(connect_callback/*(connection)*/) {
	// displays your config in the terminal
	console.log(database);
	console.log('Connecting to mysql');
	console.log(' host='  +  database.server);
	console.log(' database='  +  database.database);
	console.log(' user='  +  database.user);
	console.log(' options='  +  database.options);
	console.log('');
	console.log("Initialising module connection");

	// creating connection
	var connection =  mysql.createConnection({
		user: database.user,
		password: database.password,
		host: database.server,
		database: config.database.database,
		port: database.port,
		options: database.options
	});
	connection.connect();
	connect_callback(connection);
}
```

Now let's call this db-connection to the `server.js` file that we created.

Add this block of code to the `server.js` file.

```js
// server.js
var connection =  require('./src/config/db-mysql')
```

This will initialize mysql driver to the variable `connection`. Then we will call the `init` function inside the `connection` we just created.

```js
 connection.init((conn) => {
	 //we will place our `server.listen` here
	 server.listen('8081', function () {
	 console.log('Listening to post 8081')
	 })
 })
```

Now try running **nodemon** on your terminal and Voila! You successfully created your connection!

![enter image description here](https://lh3.googleusercontent.com/QnOe9O5oj525FYmFLmTYNJkCZU8JznUB3jQbokmuujhJxw_gysLgDaryYEG2oM3O3segP2I6dJE)


### User GET all request

On your root project folder, create a folder named `user` and inside it create a file named `GET_all_user.js`.

First we will create a GET_all_user function that have a request, res, and a callback function.

```
// GET_all_user.js
exports.GET_all_user  =  function(req, res, _dbConnection){
	//initialize database connection
	dbConnection = _dbConnection;

	//initialize response
	var resp;

	//Call getAllUser fn
	getAllUser(function(err, allUser){
		//check the server
		if (err){
		let err = {}
		err.status  =  '500'
		err.message  =  'Internal Server Error'
		res.send(err)
		}

		//check if there's fetched data
		if (allUser.length  !==  0) {
		resp = {status: "200", allUser: allUser};
		} else {
		resp = {status: "204", message: "No Data Available!"};
		}

		//send response
		res.send(resp);
	});
}
```

Of course we will need a function that will fetch data on the database . Add this code:

```js
/getAllUser fn
//-------------
function  getAllUser(callback) {

	// this sql command calls all the USER in the table user_tbl where the user_isdel
	// field is equal (=) to 0
	var sql =  'SELECT * FROM user_tbl WHERE user_isdel = 0';

	//executing sql
	dbConnection.query(sql, function(err, recordset){

		//check error on fetching
		if (err) {
			console.log(err);
			callback(err, null);
		}

		//initialize user list array
		var allUserList = [];

		//loop for each record in user table
		for (var index in recordset){
			//save each record in object
			var allUser = {
			user_id: recordset[index].user_id,
			user_fname: recordset[index].user_fname,
			user_lname: recordset[index].user_fname,
			};

			//push record in allUserList array
			allUserList.push(allUser);
		}

		//returns User list
		callback(null, allUserList);
	});
}
//------------
```

Second, we will create a file that will be initialize in our main JS file, this will be calling `GET_all_user.js`  and our other request that will be discuss in our next module.

Inside the `user` folder, create a file named `api.js`.

```js
// api.js
var GET_all_user =  require('./GET_all_user')
```

This will call the `GET_all_user` file and save it to the variable with the same name, of course you can change if you wish.

Then, we will create a export function named `init` that passes server and the database.

```js
module.exports.init = function init (server, dbConnection){

}
```

Inside that function, you define routing using methods of the Express `server` object that correspond to HTTP methods; for example, `server.get()` to handle GET requests that we do in the Hello World in the beggining.

    // api.js
    // inside init function
    server.get('/api/user', function (req, res) {
	    //call GET_all_user function in the GET_all_user.js
    	GET_all_user.GET_all_user(req, res, dbConnection)
    	console.log('info: done with GET_all_user.GET_all_user')
    })

Finally, we will call the `api.js` file in the `server.js` to run our Get request.

On your `server.js`, we want to load the module that we create. Add this code inside the `connection.init` function.

```js
//this will call loadModules passing server, connection, and a callback
loadModules(server, conn, function (err, resp) {
	if (resp.status  ===  'success') {
	console.log('---Main Modules Activated----')
	}
})

This is the `loadModule` function

// function for loading modules
function  loadModules (server, dbConnection, callback) {
	var modules =  require('./user/api')

	//this will run the init function in the user/api.js
	modules.init(server, dbConnection)

	callback(null, { status: 'success' })
}
```

Now you can run the application using `nodemon`.

Go to your **Postman** and enter the url [`http://localhost:8081/api/user`](http://localhost:8081/api/user).

![enter image description here](https://lh3.googleusercontent.com/pU4EyyxOQ8pqqdAf-FZMA7ZgN-0LGiIZz3iK3tJM_dHGUl8pVV4SYjjw4zIrrVZgXyytOstHpII)

Presto! You have your GET all user  request now!

Note: You might have your list empty, you can add a sample users in the MySql workspace so the list displayed will be populated.


### User GET Request

First, create a file named `GET_user.js` of course.

This will be the code block for the `GET_user.js`.

```js
exports.GET_user  =  function(req, res, _dbConnection){
//initialize database connection
dbConnection = _dbConnection;

//initialize response
var resp;

//fetch userId in parameter this will fetch an userId parameter in the url
var params = {
	userId: req.params.userId
};

//Call get user fn
getUser(params, function(err, user){
	//if the callback returns an err, the server will display error
	if (err){
		let err = {}
		err.status  =  '500'
		err.message  =  'Internal Server Error'
		res.send(err)
	}

	//check if there's fetched data
	if (user !==  null){
	resp = {status: "200", user: user};
	} else {
	//else if empty
	resp = {status: "204", message: "No Data Available!"};
	}

	//send response
	res.send(resp);
	});
};

//getUser fn
//-------------
function  getUser(params, callback) {
	//declare userId
	var userId =  params.userId;

	//sql command
	//this will search for the user with the id that we pass
	var sql =  'SELECT * FROM user_tbl WHERE user_isdel = 0 AND user_id = '  + userId;

	//executing sql
	dbConnection.query(sql, function(err, recordset){
		//check error on fetching
		if (err) {
			console.log('error: getUser Error : '  + err);
			callback(err, null);
		}

		//initalize userResponse
		var userRes =  null;

		//check if there's record
		if (recordset.length  !==  0){
			//this will save the first recordset to the userRes object
			userRes = {
				user_id: recordset[0].user_id,
				user_fname: recordset[0].user_fname,
				user_lname: recordset[0].user_lname,
				user_isdel: recordset[0].user_isdel
			};
		}

		//return userRes object
		callback(null,userRes);
	});

}
```

Second, we will add the `GET_user.js` in our `api.js`.

```js
var GET_user =  require('./GET_user')
```

And inside the `init` function, add this block of codes there:

```js
server.get('/api/user/:userId', function (req, res) {
	GET_user.GET_user(req, res, dbConnection)
	console.log('info: done with GET_user.GET_user')
})
```
	
Now you can go to your Postman and enter [`http://localhost:8081/api/user/1`](http://localhost:8081/api/user/2)

![enter image description here](https://lh3.googleusercontent.com/wUN63xRtKyZRG7mzOdNcvztEQJJCqxCb_cuZHnxAO37Md2WI-8bgEPQ7OJ7jfk9pyqR1qD3yDZ8)

Note: In my case, I input [`localhost:8081/api/user/2`](localhost:8081/api/user/2) on my Postman.

### User POST request

Now, we will create a user using a post request, we will install a library called `async`. To be specific, we need a functionality called `async.waterfall`, basically it runs an array of functions in series, each passing their results to the next in the array. However, if any of the functions pass an error to the callback, the next function is not executed and the main callback is immediately called with the error.

First, create a file in the user table named `POST_user.js`.  To import async, type:

```js
// POST_user.js
const async =  require('async')
```

Second, we will create a POST_user function that will get a req, res and  database connection

```js
exports.POST_user = function(req, res, _dbConnection){

}
```

We also want to create a function that will get data from the request body,  save it in the database.

```js
/putUser fn
//--------------
function  putUser(dbConnection, body, callback) {
	//we will save the user_fname and user_lname that in the request body
	let sqlData = [body.user_fname, body.user_lname];

	let sqlQuery =  'INSERT INTO user_tbl (user_fname, user_lname, user_isdel) '  +
	'VALUES (?, ?, 0)';

	dbConnection.query(sqlQuery, sqlData, function(err, result) {
	if (err) {
	console.log('error', TAG +  'putUser Err : '  + err)
	callback(err, null);
	} else {
	callback(null, result);
	}
	});
}
//--------------
```

Note: You might need to read about [prepared statements](https://github.com/sidorares/node-mysql2#using-prepared-statements) use in this module.

We also want to validate if the body is empty.

```js
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
```

Now we will create a function that will call `validateCredential` and `putUser` function and place it inside the `async.waterfall([firstFn, secondFn], mainCallbackFn)`.

```js
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
```

Lastly,  we will call the `insertUser`  function inside our `POST_user` . We will also put a callback checking if the callback results to an error.

```js
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
```

Alright, the POST_user is ready! We need to include `POST_user.js` in `api.js` with the request `post` and the path `/api/user`.

```js
//Create user
//----------------
server.post('/api/user', function (req, res) {
	POST_user.POST_user(req, res, dbConnection)
	console.log('info', 'done with POST_user.POST_user')
})
//---------------
```

Before testing, we need to install `body-parser`, it parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.

Place this code above our `server.js` file:

```js
//server.js
const bodyParser =  require('body-parser');  

//this will use as a middleware of our application to fetch json object to our body request
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use(function (req, res, next) {
	// Website you wish to allow to connect when we make our Vue.js UI
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});
```

Open your Postman, switch to POST and enter [`localhost:8081/api/user`](localhost:8081/api/user).

Go to the Header, make sure that the key will be `content-type` and the value is `application/json`.

![enter image description here](https://lh3.googleusercontent.com/o8L41783_Dk-20J0tpd4jNob_RkNHfR7PsYjiJfx9ONSDT2jJDgvoP0ug_I0lesFtM-hE8Y0uXE)

After that, go to the Body tab and input a json object with the key user_fname and user_lname.

![enter image description here](https://lh3.googleusercontent.com/EsBvaSILtbZI49tZt1wm1IkRSPtDYWmOsTFq4HCdIwsFpwEUtHkQroRKR-3pd37GSidQvXvEojs)

Send the request and Ta-da!! It's a success

![enter image description here](https://lh3.googleusercontent.com/5I6-VrvCpFCmGzynjoffheiZiXprSaYko9h4ujQxmAWpUV7iwp8UhQbG96vw4aK2n_SUqiMIfbU)

You can see the `"status": "200"` and the `"user_id":"35"`.

Note: The user id will depend on the number of user you insert so far because it is auto increment. In case of mine, it is 35.

You can check your MySql Workbench to see if it'is added.

![enter image description here](https://lh3.googleusercontent.com/F416ridXLA2jsUeHiYBiAgHTtjT8d4fYujOl1qijae30yhKNxmnCZtvNSDGrIK9U42zhF32PM6k)

## User PUT request

Now we want to update a user in the database by passing the user_fname or user_lname, we can also add a logical delete method here, just pass a object with user_isdel here that have a value of 1. 

First, create a file named `PUT_user.js`.

We need to create a function here that will be exported.

```js
// PUT_user.js
exports.PUT_user  =  function (req, res, _dbConnection, next) {
	//call update user
	updateUser(req, res, _dbConnection, next)
}
```

In the updateUser function, we will check if the request body object has a next input to be expected

```js
function  updateUser (req, res, _dbConnection, next) {
	//passes req.body so we can only type body in the future
	let body =  req.body

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
}
```

Next we will create a sql command.

```js
//inside the updateUser function
//make update sql query
let sqlQuery =  ` UPDATE user_tbl
SET `
```

Then we will add the values to be UPDATED to the sqlQuery if the values are not empty.

```js
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
if (body.user_isdel) {
	sqlQuery +=  ` user_isdel = ? `
	sqlData.push(body.user_isdel)

	//check if the body object we count is above 1 then we will add a comma
	if(count >  1){
		sqlQuery +=  `,`
		count--;
	}
}
```

After that we will add the WHERE command in the sqlQuery so the query will know which user_id will be updated.

```js
//add WHERE query in which id we will be updating
//req.params.userId will be fetching the userId
sqlData.push(req.params.userId)
sqlQuery +=  ` WHERE user_id = ? `
```

Then we will run the command that have a callback checking it there is an error occur while executing the command.

```js
_dbConnection.query(sqlQuery, sqlData, function (err, result) {
	if (err) {
		let err = {}
		console.log('error: updateUser Err : '  + err)
		err.status  =  '500'
		err.message  =  'Internal Server Error'
		res.send(err)
	} else {
		sqlQuery = 'SELECT * FROM user_tbl WHERE user_id = ' + id
		_dbConnection.query(sqlQuery, function(err, result){
			let resp = {status: '200', user: result}
			res.send(resp)  
		})
	}
})
```

Note: We used the prepared statement [prepared statements](https://github.com/sidorares/node-mysql2#using-prepared-statements) again.

Next we will add the `PUT_user.js` in the  `api.js`

```js
var PUT_user =  require('./PUT_user')
```

Inside the init function.

```js
//Update user
//---------------
server.put('/api/user/:userId', function (req, res, next) {
	PUT_user.PUT_user(req, res, dbConnection, next)
	console.log('info', 'done with PUT_user.PUT_user')
})
//---------------
```

Okay! Now we will be testing it using Postman.

Switch the request to PUT and the enter the url `localhost:8081/api/user/:userId`.

As for me I will changed the value of the params `userId` to 35, and set the `user_fname` or `user_lname` in the body.

![enter image description here](https://lh3.googleusercontent.com/Q3uKnYlsrNptcRH1_LGcVayb6yw7swWxel9Wy029AJHyMr-Q7EfXhe9Jikt_cK0T7lCS77J4rm8)

Then press send to see if it is update.

![enter image description here](https://lh3.googleusercontent.com/RTMHeRI-4uwaOlqN4uJIPgg7dsNl0qL1YAV7_QcyQOebzUnaF6bnh0Cy5r1yu6Y16vedgNteR2k)

Congrats! You successfully  update the user!

You can check your **MySql Workbench** if the user_id you inputted is updated.

### Deleting User

You can just simply send a PUT request to the `localhost:8081/api/user/:userId` with the `"user_isdel": 1` in the body and send it.

![enter image description here](https://lh3.googleusercontent.com/IG10zoKQ2kaXe-cwqQ5zAJr0TOSXuv-9slZI9-z5LP13Ep28n6h2XmwL2zfMo_gOD2SQSQZu26o)

You can check your can send a GET request in the `/api/user` and check if the user is still there.

![enter image description here](https://lh3.googleusercontent.com/E-Y_7MDFLmyUSt55VLQt7NZa9j8IagsWU6_Jjk6RxgjYfKecY0_DMnj5YhU7bWLA7o0wmfBJwFU)

Voila! The user with the id of 35 can't be seen anymore.

## Setting Up Swagger UI

First we will install `swagger-ui-express` that will display our API in swagger-ui.

    $ npm install swagger-ui-express swagger-node-express

Once installed, we can now call our `swagger-ui-express` module in the `server.js`.

```js
//server.js
const swaggerUi = require('swagger-ui-express')
```

Then, we will use `swaggerUi`  as a middleware with the path `/api-docs`, call swaggerUi.serve and swaggerUi.setup.

```js
const swagger =  require('./swagger')
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
```

The `swagger` in the `swaggerUi.setup` parameter is a JSON file that we will creating.

```json
"swagger":"2.0",

"info":{
	"title":"Sample Swagger",
	"description":"Documentation and testing of your APIs",
	"version":"1.0"	
}
```
	
`"swagger"` **Required.** Provides metadata about the API. The metadata can be used by the clients if needed.

`"info"` **Required.** Provides metadata about the API. The metadata can be used by the clients if needed.

![enter image description here](https://lh3.googleusercontent.com/tTnTFxvVT9npwwtYjuS7wwVPlsrmv7RwWKP8h_pFTw28Mc5WsWP6gT0mlONLhIwTdydt3sLxKc0)

Note: [JSON objects](https://www.w3schools.com/js/js_json_objects.asp) are surrounded by curly braces {}. Every key/value pair is separated by comma.

```json
"produces":[
	"application/json"
]
```

`"produces"` A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under Mime Types.

```json
"paths":{
	//.. path here
}
```

`"path"` **Required.** The available paths and operations for the API.

```json
"definitions": {
	//.. model here
}
```

`"definition"` An object to hold data types produced and consumed by operations.

Now, under the inside the `definition` key. We will create a schema for `User` with the type of `object` and `properties` of our schema in the database.

```json
"User": {
	"type": "object",
	"properties": {
		"user_id": {
			"type": "integer"
		},
		"user_fname": {
			"type": "string"
		},
		"user_lname": {
			"type": "string"
		},
		"user_isdel": {
			"type": "integer"
		}
	}
}
```

Save it and go to your browser to see the User schema.

![enter image description here](https://lh3.googleusercontent.com/E0Iyjav4jGl6p7hirJtVGXAaEmzJN1sxPB4rrKzS8YWB1RZyX6TfDonJYrjNuffD99Zdu9DFCW8)

After that, inside the `path` key. We will key/value pair with an object as a value of our user endpoint in the `api.js`.

```json
"/api/user/{userId}":{
	"get":{
		"summary":"generate a single user",
		"operationId":"generate a single user",
		"tags":[
			"User"
		],
		"description":"This will generate a single user.",
		"parameters":[
			{
				"in":"path",
				"name":"userId",
				"type":"integer",
				"required":true,
				"description":"We need to input user id"
			}
		],
		"responses":{

		}
	},
	"put":{
		"summary":"update and delete user",
		"operationId":"update and delete a user",
		"tags":[
		"User"
		],
		"description":"This will update a user in the system. If the user_isdel is 1, the user with that id will be deleted.",
		"parameters":[
			{
				"in":"path",
				"name":"userId",
				"type":"integer",
				"required":true,
				"description":"We need to input user id"
			},
			{
			"in":"body",
			"name":"body",
			"required":true,
			"description":"Body",
			"schema": {
				"$ref": "#/definitions/User"
				}
			}
		],
		"responses":{

		}
	}
},

"/api/user":{
	"get":{
		"summary":"generate all users",
		"operationId":"generate all users",
		"tags":[
			"User"
		],
		"description":"This will all the users in the system.",
		"responses":{

		}
	},
	"post":{
		"summary":"create a user",
		"operationId":"create a user",
		"tags":[
		"User"
		],
		"description":"This will create a new user in the system. Only the user_fname and user_lname is required in the field.",
		"parameters":[
			{
			"in":"body",
			"name":"body",
			"required":true,
			"description":"Body",
			"schema": {
				"$ref": "#/definitions/User"
				}
			}
		],
		"responses":{

		}
	}
}
```

Note: As a reference read the [Swagger Path Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathsObject)

![enter image description here](https://lh3.googleusercontent.com/lJZB-c8psxs_NCj5Zp9huiX0D7Vh2i3zY7MS_eH69jPcXuEbyt1JUFl7eS8ZuNv-DHHuD0_xee0)

> All the user endpoint.

![enter image description here](https://lh3.googleusercontent.com/F2_KLIzsC8gAk363tf98ShmN5bLlNBx5vaGF6nXjUJEi9zQ4vNQgpkZmxLsNSjnRUNDLrAYbAAU)

> This is the **GET REQUEST** to `/api/user/:userId`. You can try it out
> see it its working! Just click **Try It out** and fill out the
> required parameter and press **EXECUTE**. A response will pop up in
> the bottom of that section.

![enter image description here](https://lh3.googleusercontent.com/vNWMrYTPYDZy2zmw522YD9mKnu-CE-DrlS4YDwibsegQ_4dQC7rhqW3xgc4iGrpQ9CSnci30kmk)

> This is the **GET REQUEST** to `/api/user`. You can try it out see it
> its working! Just click **Try It out** press **EXECUTE**. A response
> will pop up in the bottom of that section.

![enter image description here](https://lh3.googleusercontent.com/mQESvAWltcncHczJwK-lo4HU5S8x5mgKiPJqJgCrog79a4cZR0q8xVeO6A-5r2fexqsvDsZLDNo)

> This is the **POST REQUEST** to `/api/user/:userId`. You can try it
> out see it its working! Just click **Try It out** and fill out the
> required body and press **EXECUTE**. A response will pop up in the
> bottom of that section.

![enter image description here](https://lh3.googleusercontent.com/OaKQASJJEIGMSu7LqW0o-iNX9PWcXbEeov8ZPV6BPMfgAGB42xGi2XvQX6Bcn8lDecNiUWyzkqY)

> This is the **PUT REQUEST** to `/api/user/:userId`. You can try it out
> see it its working! Just click **Try It out** and fill out the
> required body and press **EXECUTE**. A response will pop up in the
> bottom of that section.

For reference, go to [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)

That's it ! I hope you learn the basics of Express and Swagger using Node JS.
