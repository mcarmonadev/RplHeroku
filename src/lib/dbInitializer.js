import redis from "redis";
class dbInitializer  {

	initialite(callback) {
redis://h:p42b2b8eb23d16abc4e971a3465774150da41568de5641b3c7d11c1c873b80661@ec2-18-215-43-91.compute-1.amazonaws.com:10659
		//let client = redis.createClient(6379, 'localhost');
		let client = redis.createClient(process.env.REDIS_URL || 'redis://localhost:6379');
		console.log('Setting BD Locations.')
		let locations_cods = ['santiago','zurich','auckland','sydney','londres','georgia'];
		//let locations_cods = ['santiago','zurich'];//acortar para test, de modo de no superer el limite diario tan rapido
		//let locations_cods = ['santiago'];//acortar para test, de modo de no superer el limite diario tan rapido
		let locations = [];
    
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
		locations_cods.map(element=>{
		  //console.log(element);
			client.hmget('app.locations.'+element, ["name", "lat", "lot"], (err, value) => {
				if (err) throw err;
				//console.log('Location: ' + value[0]);
				//console.log('lat: ' + value[1]);
				locations.push({locName:value[0],lat:value[1],lon:value[2]});
				//console.log(JSON.stringify( value));
				if(locations_cods.length==locations.length)
				{
					client.end(true);
					console.log(' ')
					callback(locations_cods);
				}
			});
		});
	}
}

export default new dbInitializer();
