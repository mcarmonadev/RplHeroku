import redis from "redis";
import axios from 'axios'
let that;
class apiInvoker  {
    constructor() {
        this.acountKey = process.env.DARKSKY_KEY || '264f037d720e899ec02431f178da7196';
        this.api = 'https://api.darksky.net/forecast/'+this.acountKey+'/';
		that = this;
		this.callbackMain = ()=>{};
		this.locations = [];
		this.locations_cods = [];
		this.weather_results = [];		
		this.api_erros = [];	
		this.client = '';//redis.createClient(6379, 'localhost');		
    }

	getWeather (loc_cods, callback, mock) {
		//console.log('getWeatherssss');
		this.callbackMain = callback;
		this.locations_cods = loc_cods;

		if(!mock){
			//this.client = redis.createClient(6379, 'localhost');	
			this.client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');	
			this.loadLocationsCoords();
		}else
		{
			this.returnWeatherResults_Mock();
		}


		//callback();
	}
	loadLocationsCoords() {
		console.log('loadLocationsCoords... ');
		console.log(' ');
		this.locations = [];
		//let client = redis.createClient(6379, 'localhost');
		this.locations_cods.map(loc=>{
		//console.log('Iloc: '+loc);
			this.client.hmget('app.locations.'+loc, ["name", "lat", "lot"], (err, objLoc) => {
				if (err) throw err;
				this.locations.push({locName:objLoc[0],lat:objLoc[1],lon:objLoc[2]});
				if(this.locations_cods.length==this.locations.length)
				{
					//client.end(true);
					//this.callWeatherApi();
					console.log(' ');
					this.launchApiRequests();
				}
			});
		});

		//console.log('FIN ----  setNextCall ('+that.nroIteracion+')');
	}
	launchApiRequests() {
		console.log('launchApiRequests!!!');

		this.weather_results = [];
		//this.client = redis.createClient(6379, 'localhost');
		this.locations.map(loc=>{
		//console.log(loc);
			try {
				console.log(' ');
				this.doApiRequest(loc, '');//Llamada primer intento
			} catch (e) {
					console.log(e.name+' - '+e.message);
					this.handleApiError(loc, e.message);
			}					
		});

	}
	doApiRequest(loc, origin) {
		console.log('Doing Api Request: '+loc.locName+'  '+origin);
		if(Math.random(0, 1)<0.1){throw new Error("How unfortunate! The API Request Failed");}

		//console.log('doApiRequest Sucess!!');
		//console.log(Math.random(0, 1));
		//console.log(loc);
			//console.log(loc.lat);
			let coords = loc.lat+','+loc.lon;
			//weather_results
			
			axios.get(that.api+coords)
			//axios.get(that.api+'-33.447487,-70.673676')
					.then(response => {
						//console.log('API!!!!!! ');
						var currently = response.data.currently;
						//console.log(currently);
						/*let retorno = Object.assign({loc,time:currently.time, currently:currently.temperature});
						console.log(retorno);*/
						this.weather_results.push(
								Object.assign(loc,{time:(new Date(currently.time*1000)), temperature:currently.temperature})
						);


						if(this.locations_cods.length==this.weather_results.length)
						{
							this.returnWeatherResults();
						}
						//Object.assign({}, coords);
						//this.props.dispatch(loadCounters(response.data));
					})
					.catch(
							error => {console.log('ERROR CON SERVICIO DE DATOS')/*console.log(error)*/

											//if(this.locations_cods.length==this.weather_results.length)
											//{
												//this.returnWeatherResults();
												console.log(error.response.data)
											//}
									}
						)

	}
	handleApiError(loc, exceptionMessage) {
		//console.log('handleApiError!!!');
		let llave = (new Date().getTime());
		//console.log('llave!!!: '+llave);

			/*client.hmset('api.errors', {
				'llave2': exceptionMessage
			});		*/

			this.client.hset("api.errors", llave, exceptionMessage);
			//client.end(true);

			try {
				this.doApiRequest(loc,'try again');
			} catch (e) {
			   //nombreMes = "desconocido";
			   //registrarMisErrores(excepcion.mensaje, excepcion.nombre); 

					//console.log(e.name+' - '+e.message);
					this.handleApiError(loc, e.message);
			}	
	}
	launchApiRequest_TryAgain() {
	}
	callWeatherApi() {
		console.log('callWeatherApi!!!');
		return;
		this.weather_results = [];
		this.locations.map(loc=>{
			//console.log(loc.lat);
			let coords = loc.lat+','+loc.lon;
			//weather_results
			
			axios.get(that.api+coords)
			//axios.get(that.api+'-33.447487,-70.673676')
					.then(response => {
						//console.log('API!!!!!! ');
						var currently = response.data.currently;
						//console.log(currently);
						/*let retorno = Object.assign({loc,time:currently.time, currently:currently.temperature});
						console.log(retorno);*/
						this.weather_results.push(
								Object.assign(loc,{time:currently.time, temperature:currently.temperature})
						);

						if(this.locations_cods.length==this.weather_results.length)
						{
							this.returnWeatherResults();
						}
						//Object.assign({}, coords);
						//this.props.dispatch(loadCounters(response.data));
					})
					.catch(error => console.log('ERROR CON SERVICIO DE DATOS')/*console.log(error)*/)
		});
	}
	returnWeatherResults() {
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
				    	let objErr = {};
				    	objErr[key] =  obj[key];

				    	that.api_erros.push(objErr);
				    }
				}		
				console.log(' ')	
				that.client.end(true);
				that.client.quit();
				that.callbackMain(
						that.locations, 
						that.api_erros
					);
			});			
	}
	returnWeatherResults_Mock() {
		/*
		this.client = redis.createClient(6379, 'localhost');	
		this.returnWeatherResults();		
		return;*/

		console.log('returnWeatherResults_Mock... ')	
		let mockLocations = [
							{locName: 'Santiago (CL)',lat: '-33.447487',lot: '-70.673676',time:(new Date().getTime()), temperature:'87'},
							{locName: 'Zurich (AU)',lat: '-31.4337487',lot: '-79.347234',time:(new Date().getTime()), temperature:'94'}
							];
		let llave = (new Date().getTime());
		let objError = {};objError[llave] = 'How unfortunate! The API Request Failed';
		let mockErrors = [objError];
			
				that.callbackMain(
						mockLocations, 
						mockErrors
					);
	}


}
//export default  apiInvoker;
export default new apiInvoker();    
