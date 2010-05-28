//extendedbyJuice.js
//Append a 'Extended by The Juice Project' div to the page body

//Constructor arguments:
//arg: ju - instance of juice
//arg: insert - JuiceInsert for page

function extendedbyJuice(ju,overrideDiv){
	var id = "extendedbyJuice";
	var div = '<div id="extendedByJuice" style="position: relative; display: block; clear: both; width: 100%; text-align: center;">' +
	'Extended by <a href="http://juice-project.org">The Juice Project</a></div>';
	if(overrideDiv){
		div = overrideDiv;
	}
	var insert = new JuiceInsert(div,"body","append");
	
	var initFunc = this.extendedInsert;
	if(arguments.length){
		extendedbyJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
		extendedbyJuice.superclass.startup.call(this);
	}

}

extendedbyJuice.prototype = new JuiceProcess();
extendedbyJuice.prototype.constructor = extendedbyJuice;
extendedbyJuice.superclass = JuiceProcess.prototype;

extendedbyJuice.prototype.extendedInsert = function(){
	this.showInsert();	
}

