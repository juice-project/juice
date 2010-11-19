//Amzcouk.js
//Extension to launch search of Amazon.co.uk based on meta value of 'isbns'

//Constructor arguments:
//arg: ju - instance of juice
//arg: src - url to logo to display in selection panel
//arg: text - text to display in selection panel
//arg: launchType - type of widow to launch new"(default) | "overlay" | "iframe" | "current" - optional
//arg: insert1 - option for launch window - optional
//arg: insert2 - option for launch window - optional

function amzcoukJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	id = "amzcoukSel";
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;	
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
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
}	
