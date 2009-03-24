function GBSJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	id = "GBSSel";
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;	
	initFunc = this.searchGBS;
	selectFunc = this.runGBS;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

GBSJuice.prototype = new JuiceSelectProcess();
GBSJuice.prototype._targetBook = null;
GBSJuice.prototype._targetUrl = null;

GBSJuice.prototype.searchGBS = function(){
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = "";
		for(index = 0;index < isbns.length;index++){
			if(index>0){
				selString += ",";
			}
			selString += "ISBN:"+isbns[index];		
		}
	
		var cmd = "http://books.google.com/books?bibkeys=" + escape(selString) + "&jscmd=viewapi&callback=";
		cmd += this.jsonCallBackPrefix("loadGBS");
		juice.runscript("GBSJuiceScript",cmd);
	}
}

GBSJuice.prototype.loadGBS = function(booksInfo){
	gbsJuicepointer = null;
	var gbsInfo = null;
	var targetBook = null;
	var targetView = "";
	var targetUrl = "";
	for (i in booksInfo) {
		var view = "Information";
		    var book = booksInfo[i];

		if(book.preview == "noview"){
				//continue;		
		}
		if(book.preview == "partial"){
				view = "Preview";		
				targetView = "Preview";		
			targetBook = book.bib_key;
			targetUrl = book.info_url;
		}else if(book.preview == "full"){
				view = "View";		
				targetView = "Full";
			targetBook = book.bib_key;
			targetUrl = book.info_url;
			break;
		}
	}
	
	if(targetBook != null){
		this._targetBook = targetBook;
		this._targetUrl = targetUrl;
		this.enable();
	}
}
	

GBSJuice.prototype.runGBS = function(){
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
}	

