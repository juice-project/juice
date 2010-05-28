//Replaace all 'UCDMaps' with extention name
//Add in Extension specific code
//Save in file extension-name.js

function UCDMapsJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	id = "UCDMapsSel";	
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;
	initFunc = this.searchUCDMaps;
	selectFunc = this.runUCDMaps;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

UCDMapsJuice.prototype = new JuiceSelectProcess();
UCDMapsJuice.prototype._targetUrl = [];

UCDMapsJuice.prototype.searchUCDMaps = function(){
	if(juice.hasMeta("shelfmark")){
		for(var i=0;i < this.insertCount();i++){
			var cmd = "http://libinventory.ucd.ie/catalogue/findit.php?dewey=006100&location=" + escape(juice.getMeta("location",i)) + "&shelf=" + escape(juice.getMeta("shelfmark",i));				
			this._targetUrl[i] = cmd;
			this.enable(i);
		}
	}
}

UCDMapsJuice.prototype.runUCDMaps = function(pos){
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
}	
