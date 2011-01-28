//GBSEmbed.js
//Extension to embed a Google Book Search Viewer in to the page based on meta value of 'isbns'.  
//This extension does a pre-search of Google Book Search, and only is enabled if Google has a full or 
//partial preview available.

//Constructor arguments:
//arg: ju - instance of juice
//arg: insert - JuiceInsert for page
//arg: targetDiv - id of element within insert to contain viewer

function GBSEmbedJuice(ju,insert,targetDiv){
	id = "GBSSel";
	this.targetDiv = targetDiv;
	initFunc = this.searchGBS;
	selectFunc = this.runGBS;
	if(arguments.length){
		juice.loadGoogleApi("books", "0");
		GBSEmbedJuice.superclass.init.call(this,id,initFunc,selectFunc,insert,ju);
		GBSEmbedJuice.superclass.startup.call(this);
	}

}

GBSEmbedJuice.prototype = new JuiceProcess();
GBSEmbedJuice.prototype.constructor = GBSEmbedJuice;
GBSEmbedJuice.superclass = JuiceProcess.prototype;


GBSEmbedJuice.prototype.searchGBS = function(){
	if(juice.hasMeta("isbns")){
		this.isbns = juice.getMeta("isbns");
		var selString = "";
		var index = 0;
		for(;index < this.isbns.length;index++){
			if(index>0){
				selString += ",";
			}
			selString += "ISBN:"+this.isbns[index];		
		}
	
		var cmd = "http://books.google.com/books?bibkeys=" + escape(selString) + "&jscmd=viewapi&callback=";
		cmd += this.jsonCallBackPrefix("loadGBS");
		juice.runscript("GBSJuiceScript",cmd);
	}
}

GBSEmbedJuice.prototype.loadGBS = function(booksInfo){
	gbsJuicepointer = null;
	var embedable = false;
	var isbn = "";
	for (i in booksInfo) {
		    var book = booksInfo[i];
			if(book.embeddable){
				isbn = book.bib_key;
				embedable = true;
				break;
			}
	}
	
	if(embedable){
		var This = this;
	    juice.onAllLoaded(function(){This.loadViewer(isbn);});
	}
}

GBSEmbedJuice.prototype.loadViewer = function(isbn) {
	this.showInsert();
	try{
		this.viewer = new google.books.DefaultViewer(document.getElementById(this.targetDiv));
	}catch	(e){
		juice.debugOutln("caught1 - "+e.name+" - "+e.message);
	}
	this.loadBook(isbn);
}

GBSEmbedJuice.prototype.loadBook = function(isbn){
	var sel = this._isbn;
	var This = this;
	try{
		this.viewer.load(isbn, function() { This.noLoad(); }, null);
	}catch(e){
		juice.debugOutln("caught2 - "+e.name+" - "+e.message);
	}
}	

GBSEmbedJuice.prototype.noLoad = function(){
		juice.debugOut("No MATCH");		
}	

