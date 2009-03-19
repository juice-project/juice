function GBSEmbedJuice(ju,insert,targetDiv){
	id = "GBSSel";
	this.targetDiv = targetDiv;
	initFunc = this.searchGBS;
	selectFunc = this.runGBS;
	if(arguments.length){
		GBSEmbedJuice.superclass.init.call(this,id,initFunc,selectFunc,insert,ju);
		GBSEmbedJuice.superclass.startup.call(this);
	}

}

GBSEmbedJuice.prototype = new JuiceProcess();
GBSEmbedJuice.prototype.constructor = GBSEmbedJuice;
GBSEmbedJuice.superclass = JuiceProcess.prototype;


GBSEmbedJuice.prototype.searchGBS = function(){
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = "";
		var index = 0;
		for(;index < isbns.length;index++){
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

GBSEmbedJuice.prototype.loadGBS = function(booksInfo){
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
		this._isbn = targetBook;
		this._targetUrl = targetUrl;
		this.loadViewer();
	}
}

GBSEmbedJuice.prototype.loadViewer = function() {
	this.showInsert();
	try{
		this.viewer = new google.books.DefaultViewer(document.getElementById(this.targetDiv));
	}catch	(e){
		juice.debugOutln("caught1 - "+e.name+" - "+e.message);
	}
	this.loadBook();
}

GBSEmbedJuice.prototype.loadBook = function(){
	var sel = this._isbn;
	var This = this;
	try{
		this.viewer.load(this._isbn, function() { This.noLoad(); }, null);
	}catch(e){
		juice.debugOutln("caught2 - "+e.name+" - "+e.message);
	}
}	

GBSEmbedJuice.prototype.noLoad = function(){
	if(this.isbnCount < this.isbns.length){
		this._isbn = this.isbns[this.isbnCount++];
		this.loadBook();
	}else{
		juice.debugOut("No MATCH");		
	}
}	

