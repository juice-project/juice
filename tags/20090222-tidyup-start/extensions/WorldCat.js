function worldcatJuice(ju,src,text,defPanel,iframeInsert){
	id = "worldcatSel";
	this.iframe = iframeInsert;
	initFunc = this.searchworldcat;
	selectFunc = this.runworldcat;
	if(arguments.length){
		worldcatJuice.superclass.init.call(this,id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

worldcatJuice.prototype = new JuiceSelectProcess();
worldcatJuice.prototype.constructor = worldcatJuice;
worldcatJuice.superclass = JuiceSelectProcess.prototype;


worldcatJuice.prototype._targetUrl = null;




worldcatJuice.prototype.searchworldcat = function(){
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = "";
		var index = 0;
		for(;index < isbns.length;index++){
			if(index>0){
				selString += " OR ";
			}
			selString += "isbn:"+isbns[index];		
		}
	
		var cmd = "http://www.worldcat.org/search?q=" + escape(selString);
		this._targetUrl = cmd;
		this.enable();
	}
}


worldcatJuice.prototype.runworldcat = function(){
	var type = "current";
	if(this.iframe){
		type = "iframe";		
	}
	juice.launchWin(this._targetUrl,type,this.iframe);
}	
