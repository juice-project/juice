function waterstonesJuice(ju,src,text,defPanel){
	var id = "waterstonesSel";
	
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
	juice.launchWin(this._targetUrl,"current");
}	
