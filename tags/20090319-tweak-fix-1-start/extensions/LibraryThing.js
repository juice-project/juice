function librarythingSearchJuice(ju,src,text,defPanel){
	id = "librarythingSearchSel";
	
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
	juice.launchWin(this._targetUrl);
}	
