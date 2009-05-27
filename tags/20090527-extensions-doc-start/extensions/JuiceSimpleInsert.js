//Replaace all 'simpleInsert' with extention name
//Add in Extension specific code
//Save in file extension-name.js

function simpleInsertJuice(ju,insert,targetDiv){
	id = "simpleInsertSel";
	this.targetDiv = targetDiv;
	initFunc = this.startsimpleInsert;
	if(arguments.length){
		simpleInsertJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
		simpleInsertJuice.superclass.startup.call(this);
	}

}

simpleInsertJuice.prototype = new JuiceProcess();
simpleInsertJuice.prototype.constructor = simpleInsertJuice;
simpleInsertJuice.superclass = JuiceProcess.prototype;

simpleInsertJuice.prototype.startsimpleInsert = function(){
	this.showInsert();
}

