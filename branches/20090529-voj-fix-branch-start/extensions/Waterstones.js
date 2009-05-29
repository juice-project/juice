//Waterstones.js
//Extension to launch search of waterstones.com based on meta value of 'ISBN'.
//Note: copac search only accepts a single ISBNS

//Constructor arguments:
//arg: ju - instance of juice
//arg: src - url to logo to display in selection panel
//arg: text - text to display in selection panel
//arg: launchType - type of widow to launch new"(default) | "overlay" | "iframe" | "current" - optional
//arg: insert1 - option for launch window - optional
//arg: insert2 - option for launch window - optional

function waterstonesJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	var id = "waterstonesSel";
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;
	var startFunc = this.searchwaterstones;
	var selectFunc = this.runwaterstones;
	if(arguments.length){
		this.init(id,src,text,startFunc,selectFunc,null,ju,defPanel);
	}
}

waterstonesJuice.prototype = new JuiceSelectProcess();
waterstonesJuice.prototype._targetUrl = null;

waterstonesJuice.prototype.searchwaterstones = function(){
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = isbns[0];
		selString = escape(selString);
		var cmd = "http://www.waterstones.com/waterstonesweb/simpleSearch.do?simpleSearchString="+selString;
		this._targetUrl = cmd;
		this.enable();
	}
}


waterstonesJuice.prototype.runwaterstones = function(){
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
}	
