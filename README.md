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
 - Winston

## Installation
In your terminal, go to your folder and type:

    

    $ npm init

    
Just enter all the way down, and in your folder, you can see the `package.json` file and click it.
Under the license in `package.json` file, copy the code here and paste it there. Note: Don't forget to put the comma first after the `"licence": "ICS",`.

    "dependencies": {
    	"async": "^2.6.1",
    	"body-parser": "^1.18.3",
    	"express": "^4.16.3",
    	"mysql": "^2.15.0",
    	"swagger-node-express": "^2.0",
    	"swagger-ui-express": "^2.0.1",
    	"winston": "^2.4.2",
    	"winston-daily-rotate-file": "^1.7.2"
    },
    "devDependencies": {
    	"babel-cli": "^6.26.0",
    	"babel-core": "^6.26.3",
    	"babel-preset-env": "^1.7.0",
    	"babel-register": "^6.26.0",
    	"nodemon": "^1.17.5"
    }
    
After pasting, save it, go to your terminal and type:

    $ npm install --save

This will take some time because all the dependencies will be installed in your folder, after installing you can now see the `node-modules` folder where all the dependencies we will use is stored.

Now that the boring installation is done, let's have some fun.

# Let's Get Started

Let’s start out by brainstorming about what we want to build. All we want to build an API that can fetch all the users, fetch a single user, create a user and update a user.

Start out by adding a new file in the root directory of the project. Give it a name of `server.js`.

    // server.js
    const express =  require('express');
    const server =  express();

With this added you’re ready to start adding your first hello world app.

First, go to the `package.json` file and in the `"main":"index.js"`, change the `index.js` to `server.js` so when we run it using **nodemon**, the `server.js` will be the one running.

    //server.js
    //display hello world
    server.get('/hello', (req, res) => {
    	res.send('Hello World')
    })
  
    //server listening to port 8080
    server.listen('8080', function () {
    	console.log('Listening to post 8080')
    })

After adding this code in the `server.js` file, type this in your terminal:

    $ nodemon
    
After that, **nodemon** will run the `server.js` file in the url `localhost:8080`.  Go to [locahost:8080/hello](locahost:8080/hello).

![enter image description here](https://lh3.googleusercontent.com/mFVzOmfz5U24Dwgzdy5EdE5rNYaDHR5cghIzGew4xi8zkTrj6oMYyu0dHnvFpuhL-dqyRxp6xcw)

Voila! You have your hello world app!

## Setting Up Connection




