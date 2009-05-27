//copac.js
//Extension to launch search of copac.ac.uk based on meta value of 'ISBN'.
//Note: copac search only accepts a single ISBNS

//Constructor arguments:
//arg: ju - instance of juice
//arg: src - url to logo to display in selection panel
//arg: text - text to display in selection panel
//arg: launchType - type of widow to launch new"(default) | "overlay" | "iframe" | "current" - optional
//arg: insert1 - option for launch window - optional
//arg: insert2 - option for launch window - optional

function copacJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	id = "copacSel";
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;
	initFunc = this.searchcopac;
	selectFunc = this.runcopac;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

copacJuice.prototype = new JuiceSelectProcess();
copacJuice.prototype._targetUrl = null;

copacJuice.prototype.searchcopac = function(){
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = isbns[0];
		var cmd = "http://copac.ac.uk/wzgw?form=A%2FT&id=&au=&ti=&pub=&sub=&any=&fs=Search&date=&plp=&isn=" + escape(selString);
		this._targetUrl = cmd;
		this.enable();
	}
}


copacJuice.prototype.runcopac = function(){
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
}	
