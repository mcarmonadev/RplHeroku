'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var that = void 0;

var apiInvoker = function () {
	function apiInvoker() {
		_classCallCheck(this, apiInvoker);

		this.acountKey = '264f037d720e899ec02431f178da7196';
		this.api = 'https://api.darksky.net/forecast/' + this.acountKey + '/';
		that = this;
		this.callbackMain = function () {};
		this.locations = [];
		this.locations_cods = [];
		this.weather_results = [];
		this.api_erros = [];
		this.client = ''; //redis.createClient(6379, 'localhost');		
	}

	_createClass(apiInvoker, [{
		key: 'getWeather',
		value: function getWeather(loc_cods, callback, mock) {
			//console.log('getWeatherssss');
			this.callbackMain = callback;
			this.locations_cods = loc_cods;

			if (!mock) {
				//this.client = redis.createClient(6379, 'localhost');	
				this.client = _redis2.default.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
				this.loadLocationsCoords();
			} else {
				this.returnWeatherResults_Mock();
			}

			//callback();
		}
	}, {
		key: 'loadLocationsCoords',
		value: function loadLocationsCoords() {
			var _this = this;

			console.log('loadLocationsCoords... ');
			console.log(' ');
			this.locations = [];
			//let client = redis.createClient(6379, 'localhost');
			this.locations_cods.map(function (loc) {
				//console.log('Iloc: '+loc);
				_this.client.hmget('app.locations.' + loc, ["name", "lat", "lot"], function (err, objLoc) {
					if (err) throw err;
					_this.locations.push({ locName: objLoc[0], lat: objLoc[1], lon: objLoc[2] });
					if (_this.locations_cods.length == _this.locations.length) {
						//client.end(true);
						//this.callWeatherApi();
						console.log(' ');
						_this.launchApiRequests();
					}
				});
			});

			//console.log('FIN ----  setNextCall ('+that.nroIteracion+')');
		}
	}, {
		key: 'launchApiRequests',
		value: function launchApiRequests() {
			var _this2 = this;

			console.log('launchApiRequests!!!');

			this.weather_results = [];
			//this.client = redis.createClient(6379, 'localhost');
			this.locations.map(function (loc) {
				//console.log(loc);
				try {
					console.log(' ');
					_this2.doApiRequest(loc, ''); //Llamada primer intento
				} catch (e) {
					console.log(e.name + ' - ' + e.message);
					_this2.handleApiError(loc, e.message);
				}
			});
		}
	}, {
		key: 'doApiRequest',
		value: function doApiRequest(loc, origin) {
			var _this3 = this;

			console.log('Doing Api Request: ' + loc.locName + '  ' + origin);
			if (Math.random(0, 1) < 0.1) {
				throw new Error("How unfortunate! The API Request Failed");
			}

			//console.log('doApiRequest Sucess!!');
			//console.log(Math.random(0, 1));
			//console.log(loc);
			//console.log(loc.lat);
			var coords = loc.lat + ',' + loc.lon;
			//weather_results

			_axios2.default.get(that.api + coords)
			//axios.get(that.api+'-33.447487,-70.673676')
			.then(function (response) {
				//console.log('API!!!!!! ');
				var currently = response.data.currently;
				//console.log(currently);
				/*let retorno = Object.assign({loc,time:currently.time, currently:currently.temperature});
    console.log(retorno);*/
				_this3.weather_results.push(Object.assign(loc, { time: new Date(currently.time * 1000), temperature: currently.temperature }));

				if (_this3.locations_cods.length == _this3.weather_results.length) {
					_this3.returnWeatherResults();
				}
				//Object.assign({}, coords);
				//this.props.dispatch(loadCounters(response.data));
			}).catch(function (error) {
				console.log('ERROR CON SERVICIO DE DATOS'); /*console.log(error)*/

				//if(this.locations_cods.length==this.weather_results.length)
				//{
				//this.returnWeatherResults();
				console.log(error.response.data);
				//}
			});
		}
	}, {
		key: 'handleApiError',
		value: function handleApiError(loc, exceptionMessage) {
			//console.log('handleApiError!!!');
			var llave = new Date().getTime();
			//console.log('llave!!!: '+llave);

			/*client.hmset('api.errors', {
   	'llave2': exceptionMessage
   });		*/

			this.client.hset("api.errors", llave, exceptionMessage);
			//client.end(true);

			try {
				this.doApiRequest(loc, 'try again');
			} catch (e) {
				//nombreMes = "desconocido";
				//registrarMisErrores(excepcion.mensaje, excepcion.nombre); 

				//console.log(e.name+' - '+e.message);
				this.handleApiError(loc, e.message);
			}
		}
	}, {
		key: 'launchApiRequest_TryAgain',
		value: function launchApiRequest_TryAgain() {}
	}, {
		key: 'callWeatherApi',
		value: function callWeatherApi() {
			var _this4 = this;

			console.log('callWeatherApi!!!');
			return;
			this.weather_results = [];
			this.locations.map(function (loc) {
				//console.log(loc.lat);
				var coords = loc.lat + ',' + loc.lon;
				//weather_results

				_axios2.default.get(that.api + coords)
				//axios.get(that.api+'-33.447487,-70.673676')
				.then(function (response) {
					//console.log('API!!!!!! ');
					var currently = response.data.currently;
					//console.log(currently);
					/*let retorno = Object.assign({loc,time:currently.time, currently:currently.temperature});
     console.log(retorno);*/
					_this4.weather_results.push(Object.assign(loc, { time: currently.time, temperature: currently.temperature }));

					if (_this4.locations_cods.length == _this4.weather_results.length) {
						_this4.returnWeatherResults();
					}
					//Object.assign({}, coords);
					//this.props.dispatch(loadCounters(response.data));
				}).catch(function (error) {
					return console.log('ERROR CON SERVICIO DE DATOS');
				} /*console.log(error)*/);
			});
		}
	}, {
		key: 'returnWeatherResults',
		value: function returnWeatherResults() {
			console.log(' ');
			//console.log('returnWeatherResults""""" ');
			this.api_erros = [];
			this.client.hgetall("api.errors", function (err, obj) {
				//console.dir(obj);
				//that.client.end(true);
				//that.client.quit();
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						// console.log(key + " -> " + obj[key]);
						//that.api_erros.push({api_erros:obj[key]});
						var objErr = {};
						objErr[key] = obj[key];

						that.api_erros.push(objErr);
					}
				}
				console.log(' ');
				that.client.end(true);
				that.client.quit();
				that.callbackMain(that.locations, that.api_erros);
			});
		}
	}, {
		key: 'returnWeatherResults_Mock',
		value: function returnWeatherResults_Mock() {
			/*
   this.client = redis.createClient(6379, 'localhost');	
   this.returnWeatherResults();		
   return;*/

			console.log('returnWeatherResults_Mock... ');
			var mockLocations = [{ locName: 'Santiago (CL)', lat: '-33.447487', lot: '-70.673676', time: new Date().getTime(), temperature: '87' }, { locName: 'Zurich (AU)', lat: '-31.4337487', lot: '-79.347234', time: new Date().getTime(), temperature: '94' }];
			var llave = new Date().getTime();
			var objError = {};objError[llave] = 'How unfortunate! The API Request Failed';
			var mockErrors = [objError];

			that.callbackMain(mockLocations, mockErrors);
		}
	}]);

	return apiInvoker;
}();
//export default  apiInvoker;


exports.default = new apiInvoker();