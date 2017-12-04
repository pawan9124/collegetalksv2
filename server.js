/********************************************************************************************************************************************************
                          SERVER FOR THE APPLICATION
*********************************************************************************************************************************************************/
//APPLYING ALL THE TECHNIQUE TO CREATE THE SERVER FOR THE API

var express = require('express');//This express is used to create the route and providing the route 
var app= express();//creating the instance of the express
var morgan = require('morgan');// Morgan is used to log the detail to the user 
var bodyParser = require("body-parser");//body parser is used to parse the information and log it to the console
var mongoose = require('mongoose');//It is used to connect to the database
var config = require('./config');//configuration file 
var path = require('path');//path to join the directory
var http = require('http');//for the socket.io app
var server=http.createServer(app);
var io= require('socket.io').listen(server);//This is the socket object to emit and on receive


/********************************************************************************************************************************************************
                         DATABASE CONNECTIVITY
*********************************************************************************************************************************************************/
//CONNECTING TO THE DATABASE
mongoose.connect(config.database);

/********************************************************************************************************************************************************
                         SET THE BODY PARSER FOR PARSING
*********************************************************************************************************************************************************/

//CONFIGURATION OF THE APP USE THE URL AND JSON

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/********************************************************************************************************************************************************
                         App User in pubilc folder access
*********************************************************************************************************************************************************/

app.use('/public',express.static(__dirname+'/public'));
app.use('/node_modules',express.static(__dirname+'/node_modules'));
app.use('/uploads',express.static(__dirname+'/uploads'));

/********************************************************************************************************************************************************
                          SETTING FOR THE CORS ORIGIN
*********************************************************************************************************************************************************/

//CONFIGURATION FOR THE CORS ORGIN

app.use(function(req,res,next){

     res.setHeader('Access-Allow-Origin-ContentType','*');
     res.setHeader('Access-Allow-Origin-Methods','GET,POST');
     res.setHeader('Access-Allow-Origin-Headers','X-Requested-With,content-type,Authorization');
     next();
});

/********************************************************************************************************************************************************
                          USE OF MORGAN FOR THE LOG
*********************************************************************************************************************************************************/

//NOW TO LOG ALL THE REQUEST TO THE CONSOLE
//app.use(morgan('dev'));


/********************************************************************************************************************************************************
                         CALLING THE API ROUTES
*********************************************************************************************************************************************************/

var apiRoutes = require('./app/routes/api')(app,express);

/********************************************************************************************************************************************************
                          USING THAT ROUTER WITH APIROUTER
*********************************************************************************************************************************************************/

//launch the apiRouter to the express app with the start /api
app.use('/api',apiRoutes);



/********************************************************************************************************************************************************
                          USING FOR THE SOCKET.IO CONNECTION
*********************************************************************************************************************************************************/

io.sockets.on('connection', function(socket){
  console.log('A user connected');

  socket.on('disconnect',function(){
  console.log('A user is disconnected');
  });


  socket.on('sendMessage',function(data){
       io.sockets.emit('receiveMessage',data);
  });
});


/********************************************************************************************************************************************************
                         CATCHALL ROUTES
*********************************************************************************************************************************************************/
//This routes is used to send the page or routes that are not handled by apiRoutes
//SEND USERS TO FRONTEND
//has to be registered after API ROUTES

//BASIC ROUTE FOR THE HOME PAGE
app.get('*',function(req,res){
   
   res.sendFile(path.join(__dirname+'/index.html'));
});



/********************************************************************************************************************************************************
                          START AND LISTEN THE PORT 
*********************************************************************************************************************************************************/
//START THE SERVER AND LISTENING PORT
 
server.listen(config.port);
console.log("Visit the link:http://localhost:"+config.port);
