import dbInitializer from './lib/dbInitializer';
import processController from './lib/processController';
import express from 'express';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import http from 'http';

let processControl = new processController();
let ioSocketHook =()=>{console.log('TERMINAMOS');};
let initCallback = (locations_cods)=>{
	processControl.startProcess(
			locations_cods, //aray with locations codes, once dbInitializer has persisted them 
			()=>{//CallBack to pass data when iterario is finished
				ioSocketHook();
			}
		);
};


let appServer  =  express();
let HTTP_PORT = process.env.PORT || 8000;

const httpServer = http.createServer(appServer);

appServer.use(bodyParser.urlencoded({ extended: false }));
appServer.use(bodyParser.json());


appServer.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept");
    next();
});


appServer.get("/api/measurements", (req, res, next) => {
    console.log('/api/measurements DATA:')
    console.log(processControl.processResultData)
    res.json(processControl.processResultData)
});

appServer.get("/api/localities", function(req, res) {
  res.json(processControl.locations_cods)
});
appServer.use(express.static('static'));


const io = socketIo.listen(httpServer); 

io.on("connection", socket => {
  console.log("New client connected");

	ioSocketHook =()=>{
			console.log('TERMINAMOS CON SOCKET');			
    		socket.emit("WeatherAPI", processControl.processResultData); 
		};

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

dbInitializer.initialite(initCallback);// -EMPIEZA EL FULJO DE LA APPLICACION SERVIDOR, AQUI
