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
