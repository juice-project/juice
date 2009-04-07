//Replaace all 'xxx' with extention name
//Add in Extension specific code
//Save in file extension-name.js

function xxxJuice(ju,insert,targetDiv){
	id = "xxxSel";
	this.targetDiv = targetDiv;
	initFunc = this.startxxx;
	if(arguments.length){
		xxxJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
		xxxJuice.superclass.startup.call(this);
	}

}

xxxJuice.prototype = new JuiceProcess();
xxxJuice.prototype.constructor = xxxJuice;
xxxJuice.superclass = JuiceProcess.prototype;

xxxJuice.prototype.startxxx = function(){
	//Add functionality to create command for extension
	//eg. Search data source
	//    If data available insert data in to the targetDiv and show it
	//    eg:
/*	this.showInsert();
	var htm = "<div> my display</div>"
	$jq("#"+this.targetDiv).append(htm));
*/

}

