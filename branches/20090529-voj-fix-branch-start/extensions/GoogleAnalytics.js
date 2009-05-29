//GoogleAnalytics.js
//Extension to simply add the code for Google Analytics to a page.

//Constructor arguments:
//arg: ju - instance of juice
//arg: code - Google Analytics code

function gasJuice(ju,code){
	id = "gasSel";
	this.analyticsCode = code;
	initFunc = this.startgas;
	if(arguments.length){
		gasJuice.superclass.init.call(this,id,initFunc,null,null,ju);
		gasJuice.superclass.startup.call(this);
	}

}

gasJuice.prototype = new JuiceProcess();
gasJuice.prototype.constructor = gasJuice;
gasJuice.superclass = JuiceProcess.prototype;

gasJuice.prototype.startgas = function(){
	This = this;
	var doit = function(){This.rungas();};
	var target = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.") + "google-analytics.com/ga.js";
	juice.loadJs(target,doit);
}

gasJuice.prototype.rungas = function(){
	var insert = 'try{' +
	'var pageTracker = _gat._getTracker("' + this.analyticsCode + '");' +
	'pageTracker._trackPageview();' +
	'} catch(err) {}';
	
	var script = document.createElement("script"); 
	script.setAttribute('type','text/javascript'); 
	script.text = insert; 
	$jq("body").append(script);

}