import redis from "redis";
import apiInvoker from './apiInvoker';
let that;
class processController  {
    constructor(locations_cods=[]) {
        this.locations_cods = [];
        this.nroIteracion = 0;
		this.usuariosConnectados = 0;
        this.timeInterval = process.env.RPLTEST_TIMER_MILISECONDS ||  10000;
		this.appCallback = ()=>{};
		this.processResultData = {weatherResponse:[],apiErrors:[]};
		that = this;
    }
	startProcess(locs, rootCallback) {
		this.locations_cods = locs;
		this.appCallback = rootCallback;
		this.invokeAPI();
	}
	invokeAPI() {
		that.nroIteracion++;
		console.log('INI iteracion #('+that.nroIteracion+')');

		
		let mock = false;/*Setear en true para evitar llamadas a la api y asi tener respuesta para depurar el front*/

		console.log(' ');
		console.log('usuariosConnectados: ('+that.usuariosConnectados+')');
		if(that.usuariosConnectados>0){
			console.log(' ');
			console.log('Si hay usuarios conectados:Ejecutar logica de API...');
			apiInvoker.getWeather(that.locations_cods, that.setNextCall, mock);
		}else{
			console.log(' ');
			console.log('No hay usuarios conectados: no invocar api para ahorrar request Skydark...');
			console.log(' ');
			that.setNextCall(that.processResultData.weatherResponse, that.processResultData.apiErrors);
		}
		/*setTimeout(that.invokeAPI, that.timeInterval);
		console.log('FIN ----  processInvoker ('+that.nroIteracion+')');
		console.log(' ');*/
	}
	setNextCall(weatherResponse, apiErrors) {
		that.processResultData = {weatherResponse:weatherResponse,apiErrors:apiErrors};
		that.appCallback();
		console.log('FIN de interacion #('+that.nroIteracion+')');
		console.log(' ');
		console.log('Proxima iteracion #('+(that.nroIteracion+1)+') en '+(that.timeInterval/1000)+' segs.');
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

}
export default  processController;
//export default new processController();
