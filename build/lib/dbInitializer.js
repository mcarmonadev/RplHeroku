'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbInitializer = function () {
	function dbInitializer() {
		_classCallCheck(this, dbInitializer);
	}

	_createClass(dbInitializer, [{
		key: 'initialite',
		value: function initialite(callback) {
			redis: //h:p42b2b8eb23d16abc4e971a3465774150da41568de5641b3c7d11c1c873b80661@ec2-18-215-43-91.compute-1.amazonaws.com:10659
			//let client = redis.createClient(6379, 'localhost');
			var client = _redis2.default.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
			console.log('Setting BD Locations.');
			var locations_cods = ['santiago', 'zurich', 'auckland', 'sydney', 'londres', 'georgia'];
			//let locations_cods = ['santiago','zurich'];//acortar para test, de modo de no superer el limite diario tan rapido
			//let locations_cods = ['santiago'];//acortar para test, de modo de no superer el limite diario tan rapido
			var locations = [];

			client.hmset('app.locations.santiago', {
				'name': 'Santiago (CL)',
				'lat': '-33.447487',
				'lot': '-70.673676'
			});
			client.hmset('app.locations.zurich', {
				'name': 'Zurich (CH)',
				'lat': '47.451542',
				'lot': '8.564572'
			});
			client.hmset('app.locations.auckland', {
				'name': 'Auckland (NZ)',
				'lat': '-36.848461',
				'lot': '174.763336'
			});
			client.hmset('app.locations.sydney', {
				'name': 'Sydney (AU)',
				'lat': '-33.947346',
				'lot': '151.179428'
			});
			client.hmset('app.locations.londres', {
				'name': 'Londres (UK)',
				'lat': '51.509865',
				'lot': '-0.118092'
			});
			client.hmset('app.locations.georgia', {
				'name': 'Georgia (USA) ',
				'lat': '33.247875',
				'lot': '-83.441162'
			});
			locations_cods.map(function (element) {
				//console.log(element);
				client.hmget('app.locations.' + element, ["name", "lat", "lot"], function (err, value) {
					if (err) throw err;
					//console.log('Location: ' + value[0]);
					//console.log('lat: ' + value[1]);
					locations.push({ locName: value[0], lat: value[1], lon: value[2] });
					//console.log(JSON.stringify( value));
					if (locations_cods.length == locations.length) {
						client.end(true);
						console.log(' ');
						callback(locations_cods);
					}
				});
			});
		}
	}]);

	return dbInitializer;
}();

exports.default = new dbInitializer();