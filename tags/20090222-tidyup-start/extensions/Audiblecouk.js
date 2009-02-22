var audiblecoukJuicepointer = null;
var audiblecoukArielTargetUrl = null;

function audiblecoukLoad(args){
	audiblecoukJuicepointer.loadaudiblecouk(args);
}

function audiblecoukJuice(ju,src,text,defPanel){
	id = "audiblecoukSel";
	
	initFunc = this.searchaudiblecouk;
	selectFunc = this.runaudiblecouk;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

audiblecoukJuice.prototype = new JuiceSelectProcess();
audiblecoukJuice.prototype._targetBook = null;
audiblecoukJuice.prototype._targetUrl = null;

audiblecoukJuice.prototype.searchaudiblecouk = function(){
	if(juice.hasMeta("title") && juice.hasMeta("author")){
		var selString = juice.getMeta("title") + " " + juice.getMeta("author");
		selString = escape(selString);
		var cmd = "http://www.audible.co.uk/aduk/site/audibleSearch/searchResults.jsp?BV_UseBVCookie=Yes&Ntk=S_Keywords_Uk&Ntt="+selString+"&Ntx=mode%2bmatchallpartial&D="+selString+"&N=0&Dx=mode%2bmatchallpartial";
		this._targetUrl = cmd;
		audiblecoukArielTargetUrl = cmd;
		this.enable();
	}
}


audiblecoukJuice.prototype.runaudiblecouk = function(){
	juice.launchWin(audiblecoukArielTargetUrl);
}	
