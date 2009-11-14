//Replaace all 'xxx' with extention name
//Add in Extension specific code
//Save in file extension-name.js

function xxxJuice(ju,src,text,defPanel,launchType,insert1,insert2){
	id = "xxxSel";	
	this.launchType = launchType;
	this.insert1 = insert1;
	this.insert2 = insert2;
	initFunc = this.searchxxx;
	selectFunc = this.runxxx;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

xxxJuice.prototype = new JuiceSelectProcess();
xxxJuice.prototype._targetUrl = null;

xxxJuice.prototype.searchxxx = function(){
/*	//Add functionality to create command for extension eg:
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = isbns[0];
		var cmd = "http://test.com/actio?isbn=" + escape(selString);
		this._targetUrl = cmd;
		this.enable();
	}
*/
}

xxxJuice.prototype.runxxx = function(){
/*	//Add funtionality to launch extension eg:
	juice.launchWin(this._targetUrl,this.launchType,this.insert1,this.insert2);
*/
}	
