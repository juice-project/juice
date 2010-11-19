/*
 * Geolocating extension. 
 * Uses Geolocation of device and runs query against geonames to get name of location.
 * Requires a list of library locations identical to that used by the Google Maps extension. 
 * 
 */

function geoloc(ju,insert, locdata){	
	
	var ToRadian = function(v) { return v * (Math.PI / 180);};
	var DiffRadian = function(v1, v2) {
		return ToRadian(v2) - ToRadian(v1);
	};
	var CalcDistance = function(lat1, lng1, lat2, lng2, radius) {
		return radius * 2 * Math.asin( Math.min(1, Math.sqrt( ( Math.pow(Math.sin((DiffRadian(lat1, lat2)) / 2.0), 2.0) + Math.cos(ToRadian(lat1)) * Math.cos(ToRadian(lat2)) * Math.pow(Math.sin((DiffRadian(lng1, lng2)) / 2.0), 2.0) ) ) ) );
	};
	
	if(navigator.geolocation){		
		navigator.geolocation.getCurrentPosition(function(position){
			 var lat = position.coords.latitude;
			 var lon = position.coords.longitude;
			 var loc='http://ws.geonames.org/findNearbyPlaceNameJSON?lat='+lat+'&lng='+lon+'&callback=?';
				jQuery.getJSON(loc, function(data){
					var closest='';
					var dist=100000;
					$.each(locdata, function(i, item){
						var near=CalcDistance(item.point.lt, item.point.lg, lat, lon, 3956.0);
						if(near<dist){
							closest=item.title;
							dist=near;
						}
					});
					
					if(closest!=''){
			        	jQuery(insert).append('<p>Nearest Library to you in '+data.geonames[0].name+' is '+closest+'</p>');
			        }
				});
		});		
	}
	
}



