//Audiblecouk.js
//Extension to launch a window to the del.cio.us bookmaking service passing on on meta values of 'author' and/or 'title'.

//Constructor arguments:
//arg: ju - instance of juice
//arg: src - url to logo to display in selection panel
//arg: text - text to display in selection panel
//arg: launchType - type of widow to launch new"(default) | "overlay" | "iframe" | "current" - optional
//arg: insert1 - option for launch window - optional
//arg: insert2 - option for launch window - optional

function deliciousJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	id = "deliciousSel";
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;	
	initFunc = this.searchdelicious;
	selectFunc = this.rundelicious;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

deliciousJuice.prototype = new JuiceSelectProcess();
deliciousJuice.prototype._targetUrl = null;

deliciousJuice.prototype.searchdelicious = function(){
	if(juice.hasMeta("title") && juice.hasMeta("author")){
		var selString = juice.getMeta("title") + " " + juice.getMeta("author");
		selString = escape(selString);
		var cmd = "http://del.icio.us/post?url=" + location.href +"&title="+selString;
		this._targetUrl = cmd;
		this.enable();
	}
}


deliciousJuice.prototype.rundelicious = function(){
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
}	
