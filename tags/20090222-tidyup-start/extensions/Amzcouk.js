function amzcoukJuice(ju,src,text,defPanel){
	id = "amzcoukSel";
	
	initFunc = this.searchamzcouk;
	selectFunc = this.runamzcouk;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

amzcoukJuice.prototype = new JuiceSelectProcess();
amzcoukJuice.prototype._targetUrl = null;

amzcoukJuice.prototype.searchamzcouk = function(){
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = "";
		var index = 0;
		for(;index < isbns.length;index++){
			if(index>0){
				selString += " ";
				break;
			}
			if(index > 1){
				break;
			}
			selString += isbns[index];		
		}
	
		var cmd = "http://www.amazon.co.uk/s/ref=nb_ss_b?field-keywords=" + escape(selString);
		this._targetUrl = cmd;
		this.enable();
	}
}


amzcoukJuice.prototype.runamzcouk = function(){
	juice.launchWin(this._targetUrl);
}	
