function openlibraryJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	id = "openlibrarySel";
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;
	initFunc = this.searchopenlibrary;
	selectFunc = this.runopenlibrary;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

openlibraryJuice.prototype = new JuiceSelectProcess();
openlibraryJuice.prototype._targetUrl = null;

openlibraryJuice.prototype.searchopenlibrary = function(){
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = "";
		var index = 0;
		for(;index < isbns.length;index++){
			if(index>0){
				selString += " OR ";
			}
			selString += isbns[index];		
		}
	
		var cmd = "http://openlibrary.org/search?wisbn=" + escape(selString);
		this._targetUrl = cmd;
		this.enable();
	}
}


openlibraryJuice.prototype.runopenlibrary = function(){
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
}	
