var GoogleMapJuice_count = 0;
function GoogleMapJuice(ju,insert,targetDiv,opts){
	this.id = "GoogleMap"+GoogleMapJuice_count++;
	this.opts = opts;
	this.targetDiv = targetDiv;
	initFunc = this.startMap;
	if(arguments.length){
		juice.loadGoogleApi("maps", "2");
		GoogleMapJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
		GoogleMapJuice.superclass.startup.call(this);
	}

}

GoogleMapJuice.prototype = new JuiceProcess();
GoogleMapJuice.prototype.constructor = GoogleMapJuice;
GoogleMapJuice.superclass = JuiceProcess.prototype;

GoogleMapJuice.prototype.startMap = function(){
	this.buildContainer();
	var This = this;
    juice.onAllLoaded(function(){This.displayMap();});
}

GoogleMapJuice.prototype.buildContainer = function(){
	var width = "300px";
	var height = "300px";
	var cont = '<div id="' + this.id + '" ' +
		'style="display: block; background-color: transparent; ' +
		'padding: 0; border: 0; margin-left: auto; margin-right: auto; ' +
		'width: ' +  this.opts.width + '; ' +
		'height: ' +  this.opts.height + '"/>';
	this.showInsert();
	var insert = new JuiceInsert(cont,"#"+this.targetDiv,"append");
	insert.show();
}

GoogleMapJuice.prototype.displayMap = function(){
	if(GBrowserIsCompatible()){
	    this.map = new google.maps.Map2(document.getElementById(this.id));
	    this.map.setCenter(new google.maps.LatLng(0, 0),10 );
	    this.map.setUIToDefault();
		this.bounds = new GLatLngBounds();
		this.displayPoints();
	}
}

GoogleMapJuice.prototype.displayPoints = function(){
	var points = this.opts.points;
	var sel = null;
	if(this.opts.select){
		sel = this.opts.select;
	}

	if(points){
		for(var i = 0; i < points.length; i++){
			if(sel == null || jQuery.inArray(points[i].id,sel) != -1){
				this.displayPoint(points[i]);
			}
		}
     	this.map.setZoom(this.map.getBoundsZoomLevel(this.bounds));
      	this.map.setCenter(this.bounds.getCenter());
	}
}

GoogleMapJuice.prototype.displayPoint = function(p){
	var This = this;
	var point = new GLatLng(p.point.lt,p.point.lg);
    var marker = new GMarker(point,{title:p.title});
    GEvent.addListener(marker,"click", function() {
        var myHtml = '<div class="juiceMapInfoTitle">' + p.title + '</div><div class="juiceMapInfoBody">' + p.body + '</div>';
        This.map.openInfoWindowHtml(point, myHtml);
      });
    this.map.addOverlay(marker);
	this.bounds.extend(point);
}


