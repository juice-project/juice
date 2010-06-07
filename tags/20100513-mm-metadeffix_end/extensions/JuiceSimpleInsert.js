//JuiceSimpleInsert.js
//Insert an element in to a page

//Constructor arguments:
//arg: ju - instance of juice
//arg: insert - JuiceInsert for page
//arg: func - function to call after insert has been shown

function simpleInsertJuice(ju,insert,func){
	var id = "simpleInsertSel";
	var initFunc = this.startsimpleInsert;
	this.func = func;
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
	if(this.func){
		this.func();
	}
	
}

