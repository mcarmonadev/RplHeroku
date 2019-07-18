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
				value: function initialite(event) {

						var client = _redis2.default.createClient(6379, 'localhost');
						/*this.setState({
        counterName: event.target.value
      });*/
						console.log('hi');
						/*
      client.on('error', function (err) {
      console.log('Error ' + err);
      });*/

						client.set('color', 'red', _redis2.default.print);
						client.get('color', function (err, value) {
								if (err) throw err;
								console.log('Got: ' + value);
								client.end(true);
						});
				}
		}]);

		return dbInitializer;
}();

//export default daInitializer;
//module.exports = new daInitializer();


exports.default = new dbInitializer();