//Replaace all 'Carousel3D' with extention name
//Add in Extension specific code
//Save in file extension-name.js

//Constructor arguments:
//arg: ju - instance of juice
//arg: insert - JuiceInsert for page
//arg: targetDiv - id of html element to contain output
//arg: opts - controling options

		//Inspiration and some code from Andrew Sellick - http://www.andrewsellick.com/75/simple-3d-carousel-using-mootools  

function Carousel3DJuice(ju,insert,targetDiv,opts){
	this.id = "Carousel3DSel";
	this.targetDiv = targetDiv;
	var defOpts = {
		height : "260px",
		width : "300px",
		radiusX : 220,
		radiusY : 40,
		speed : 0.3,
		showLabel : true,
		showLink : true,
		max : 10,
		feedUrl: null,
		items : []
	};
	this.opts = juice.updateArray(defOpts,opts);
	var initFunc = this.start;
	this.count = 0; 
	this.baseSpeed = 0.05; 
	this.radiusX = this.opts.radiusX; 
	this.radiusY = this.opts.radiusY; 
	this.centerX = 300; 
	this.centerY = 190;
	this.speed = this.opts.speed;
	this.imageDivs = '';
	this.numElements = 0;
	this.carousel = '';
	
	if(arguments.length){
		if(this.opts.feedUrl){
			juice.loadGoogleApi("feeds", "1");
		}
		Carousel3DJuice.superclass.init.call(this,this.id,initFunc,null,insert,ju);
		Carousel3DJuice.superclass.startup.call(this);
	}

}

Carousel3DJuice.prototype = new JuiceProcess();
Carousel3DJuice.prototype.constructor = Carousel3DJuice;
Carousel3DJuice.superclass = JuiceProcess.prototype;

Carousel3DJuice.prototype.start = function(){
	var This = this;
	juice.ready(function(){This.initCarousel3D();});
}

Carousel3DJuice.prototype.initCarousel3D = function(){
	if(this.opts.feedUrl){
		//get data from feed then call startCarousel3D()
		this.getItemsFromFeed(this.opts.feedUrl);
	}else{
		this.startCarousel3D();
	}
}

Carousel3DJuice.prototype.startCarousel3D = function(){
	var This = this;
	this.setupDivs();
	this.setupCarousel();
	setInterval(function(){This.startCarousel();},40);

}

Carousel3DJuice.prototype.setupDivs = function(){

	var cont = $jq('<div id="' + this.id + '" ' + 'class="juice_carousel" ' +
		'style="display: block; background-color: transparent; ' +
		'padding: 0; border: 0; margin-left: auto; margin-right: auto; ' +
		'width: ' +  this.opts.width + '; ' +
		'height: ' +  this.opts.height + '"/>');
		
	
	var items = this.opts.items;
	for(var i = 0; i < items.length  && i < this.opts.max ; i++){
		var div = '<div class="juice_carousel_item" ' ;
		if(this.opts.showLabel){
			div += 'title="' + items[i].label +'"';
		}
		div += '>';
		if(this.opts.showLink){
			div += '<a href="' + items[i].link + '">';
		}
		div += '<img id="img' + i + '" src="' + items[i].src +'"/>' ;
		if(this.opts.showLink){
			div += '</a>';
		}
		div += '</div>';
		cont.append(div);
	}
	this.showInsert();
	
	var insert = new JuiceInsert(cont,"#"+this.targetDiv,"append");
	insert.show();
	
}

Carousel3DJuice.prototype.setupCarousel = function(){

		var This = this;
		this.carousel = $jq("#" + this.id);
		this.carousel.bind("mousemove",function(e){This.onMouseMove(e);});
		this.imageDivs = $jq(".juice_carousel_item");
		this.numElements = Math.min(this.imageDivs.length,this.opts.max);
		
	
		this.centerX = Math.round(this.carousel.offset().left + (this.carousel.width()/2) - (this.radiusX / 3.142));
//		this.centerY = Math.round(this.carousel.offset().top + (this.carousel.height()/2) - (this.radiusY / 2));
		this.centerY = Math.round(this.carousel.offset().top + (this.carousel.height()/2) - (this.radiusY));
}

Carousel3DJuice.prototype.startCarousel = function(){

	
	for(var i=0; i < this.numElements; i++){

	var item = $jq(this.imageDivs[ i ]);
	
		var angle = i * ( Math.PI * 2 ) / this.numElements;
		item.css("position","absolute"); 
		
		var posX = ( Math.sin( this.count * ( this.baseSpeed * this.speed ) + angle )* this.radiusX + this.centerX );
		var posY = ( Math.cos( this.count * ( this.baseSpeed * this.speed ) + angle )* this.radiusY + this.centerY );

		posX -= item.width() / 2;
		posY -= item.height() / 2;
		
		item.css("left",posX+"px"); 
		item.css("top",posY+"px"); 
		
		var imageDivWidth = posY/3;
		var imageDivZIndex = Math.round(imageDivWidth)+100;
		
		item.width(imageDivWidth);
		item.css("zIndex",imageDivZIndex); 
		
		angle += this.speed;
	
	}
	
	this.count++;
}

Carousel3DJuice.prototype.onMouseMove = function(evt){
	var tempX = evt.pageX;
	this.speed = (tempX - this.centerX) / 2500;
}

Carousel3DJuice.prototype.getItemsFromFeed = function(url){
	var This = this;
	var feed = new google.feeds.Feed(url);
	feed.setResultFormat(google.feeds.Feed.MIXED_FORMAT);
	feed.setNumEntries(10);
	feed.load(function(result) {
		var items = [];
	  if (!result.error) {
	    for (var i = 0; i < result.feed.entries.length; i++) {
	      var entry = result.feed.entries[i];

			var item = {
				src : This.getImageLink(google.feeds.getElementsByTagNameNS(entry.xmlNode, "http://www.w3.org/2005/Atom", "link")),
				label : entry.title,
				link : entry.link
			};
			items.push(item);
		}
	  }else{
		juice.debugOutln("ERROR: "+result.error);
	  }
	This.opts.items = items;
	This.startCarousel3D();
	});	
}

Carousel3DJuice.prototype.getImageLink = function(elems){
	for(var i = 0 ; i < elems.length; i++){
		ele = elems[i];
		if(ele.getAttribute('rel') == 'image'){
			return ele.getAttribute('href');
		}
	}
	return "";
	
}