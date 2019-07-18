'use strict';

var _dbInitializer = require('./lib/dbInitializer');

var _dbInitializer2 = _interopRequireDefault(_dbInitializer);

var _processController = require('./lib/processController');

var _processController2 = _interopRequireDefault(_processController);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var processControl = new _processController2.default();
var ioSocketHook = function ioSocketHook() {
  console.log('TERMINAMOS');
};
var initCallback = function initCallback(locations_cods) {
  processControl.startProcess(locations_cods, //aray with locations codes, once dbInitializer has persisted them 
  function () {
    //CallBack to pass data when iterario is finished
    ioSocketHook();
  });
};

var appServer = (0, _express2.default)();
var HTTP_PORT = process.env.PORT || 8000;

var httpServer = _http2.default.createServer(appServer);

appServer.use(_bodyParser2.default.urlencoded({ extended: false }));
appServer.use(_bodyParser2.default.json());

appServer.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept");
  next();
});

appServer.get("/api/measurements", function (req, res, next) {
  console.log('/api/measurements DATA:');
  console.log(processControl.processResultData);
  res.json(processControl.processResultData);
});

appServer.get("/api/localities", function (req, res) {
  res.json(processControl.locations_cods);
});
appServer.use(_express2.default.static('static'));

var io = _socket2.default.listen(httpServer);

io.on("connection", function (socket) {
  console.log("New client connected");

  ioSocketHook = function ioSocketHook() {
    console.log('TERMINAMOS CON SOCKET');
    socket.emit("WeatherAPI", processControl.processResultData);
  };

  socket.on("disconnect", function () {
    console.log("Client disconnected");
  });
});

httpServer.listen(HTTP_PORT, function () {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

_dbInitializer2.default.initialite(initCallback); // -EMPIEZA EL FULJO DE LA APPLICACION SERVIDOR, AQUI