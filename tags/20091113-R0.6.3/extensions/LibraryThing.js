//LibraryThing.js
//Extension to launch search of audible.co.uk based on meta value of 'title'.

//Constructor arguments:
//arg: ju - instance of juice
//arg: src - url to logo to display in selection panel
//arg: text - text to display in selection panel
//arg: launchType - type of widow to launch new"(default) | "overlay" | "iframe" | "current" - optional
//arg: insert1 - option for launch window - optional
//arg: insert2 - option for launch window - optional

function librarythingSearchJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	id = "librarythingSearchSel";
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;
	initFunc = this.searchlibrarythingSearch;
	selectFunc = this.runlibrarythingSearch;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

librarythingSearchJuice.prototype = new JuiceSelectProcess();
librarythingSearchJuice.prototype._targetUrl = null;

librarythingSearchJuice.prototype.searchlibrarythingSearch = function(){
	if(juice.hasMeta("title")){
		var selString = juice.getMeta("title");
		selString = escape(selString);
		var cmd = "http://www.librarything.com/search_works.php?q="+selString;
		this._targetUrl = cmd;
		this.enable();
	}
}


librarythingSearchJuice.prototype.runlibrarythingSearch = function(){
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
}	
