function deliciousJuice(ju,src,text,defPanel){
	id = "deliciousSel";
	
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
	juice.launchWin(this._targetUrl);
}	
