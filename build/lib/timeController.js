'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _apiInvoker = require('./apiInvoker');

var _apiInvoker2 = _interopRequireDefault(_apiInvoker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var that = void 0;

var timeController = function () {
	function timeController() {
		var locations_cods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		_classCallCheck(this, timeController);

		this.locations_cods = [];
		this.nroIteracion = 0;
		this.timeInterval = 5000;
		this.appCallback = function () {};
		that = this;
	}

	_createClass(timeController, [{
		key: 'startProcess',
		value: function startProcess(locs, rootCallback) {
			this.locations_cods = locs;
			this.appCallback = rootCallback;
			this.invokeAPI();
		}
	}, {
		key: 'invokeAPI',
		value: function invokeAPI() {
			that.nroIteracion++;
			console.log('INI iteracion #(' + that.nroIteracion + ')');

			var mock = true;
			_apiInvoker2.default.getWeather(that.locations_cods, that.setNextCall, mock);
			/*setTimeout(that.invokeAPI, that.timeInterval);
   console.log('FIN ----  processInvoker ('+that.nroIteracion+')');
   console.log(' ');*/
		}
	}, {
		key: 'setNextCall',
		value: function setNextCall(weatherResponse, apiErrors) {
			that.appCallback();
			console.log('FIN de interacion #(' + that.nroIteracion + ')');
			console.log(' ');
			console.log('Proxima iteracion #(' + (that.nroIteracion + 1) + ') en ' + that.timeInterval / 1000 + ' segs.');
			setTimeout(that.invokeAPI, that.timeInterval);
		}
		/*
  getWeather () {
  	axios.get(that.api+'-33.447487,-70.673676')
  	.then(response => {
  		console.log('API!!!!!! ');
  		console.log(response);
  		//this.props.dispatch(loadCounters(response.data));
  	})
  	.catch(error => console.log(error))
  }*/

	}]);

	return timeController;
}();
//export default  apiInvoker;


exports.default = new timeController();