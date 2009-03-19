function copacJuice(ju,src,text,defPanel){
	id = "copacSel";
	
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
juice.launchWin(this._targetUrl);
}	
