//GoogleRssFeed.js
//Extension to embed a Google in to the page and display points passed on the map.

//Constructor arguments:
//arg: ju - instance of juice
//arg: insert - JuiceInsert for page
//arg: targetDiv - id of element within insert to contain control<br/>
//arg: feeds - RSS feed(s) URLs to display within control
//arg: googleOptions - options passed to control (http://www.google.com/uds/solutions/dynamicfeed/reference.html)
//arg: css - css file to override Google css

function GoogleRSSFeedJuice(ju,insert,targetDiv,feeds,googleOptions,css){
	id = "GoogleRSSFeed";
	this.targetDiv = targetDiv;
	this.feeds = feeds;
	this.googleOptions = googleOptions;
	this.css = css;
	initFunc = this.startRSSFeed;
	if(arguments.length){
		juice.loadGoogleApi("feeds", "1");
		GoogleRSSFeedJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
		GoogleRSSFeedJuice.superclass.startup.call(this);
	}

}

GoogleRSSFeedJuice.prototype = new JuiceProcess();
GoogleRSSFeedJuice.prototype.constructor = GoogleRSSFeedJuice;
GoogleRSSFeedJuice.superclass = JuiceProcess.prototype;

GoogleRSSFeedJuice.prototype.startRSSFeed = function(){
	var This = this;
    juice.onAllLoaded(function(){This.loadExtras();});
}
GoogleRSSFeedJuice.prototype.loadExtras = function(){
	var This = this;
	juice.loadJs("http://www.google.com/uds/solutions/dynamicfeed/gfdynamicfeedcontrol.js");
	juice.loadCss("http://www.google.com/uds/solutions/dynamicfeed/gfdynamicfeedcontrol.css");
	if(this.css){
		juice.loadCss(this.css);		
	}
    juice.onAllLoaded(function(){This.displayFeed();});
}


GoogleRSSFeedJuice.prototype.displayFeed = function(){
 	this.showInsert();
    var fg = new GFdynamicFeedControl(this.feeds, this.targetDiv, this.googleOptions);
}

