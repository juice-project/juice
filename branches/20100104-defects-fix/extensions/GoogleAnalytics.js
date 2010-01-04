//GoogleAnalytics.js
//Extension to simply add the code for Google Analytics to a page.

//Constructor arguments:
//arg: ju - instance of juice
//arg: code - Google Analytics code(s) - comma separated list

function gasJuice(ju,code){
	id = "gasSel";
	this.analyticsCode = code;
	this.codes = juice.stringToArray(code,",;");
	initFunc = this.startgas;
	if(arguments.length == 2){
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
	juice.loadJs(target,"",doit);
}

gasJuice.prototype.rungas = function(){
		
	var insert = 'try{';
	for(var i = 0; i < this.codes.length;i++){
		var v = 'Trk_' + i;
		insert += 'var ' + v + ' = _gat._getTracker("' + this.codes[i] + '");';
		if(i > 0){
			insert += v + '._setDomainName("none");';
			insert += v + '._setAllowLinker(true);';
		}
		insert += v + '._initData();';
		insert += v + '._trackPageview();';		
	}
	insert += '} catch(err) {}';

	var script = document.createElement("script"); 
	script.setAttribute('type','text/javascript'); 
	script.text = insert; 
	$jq("body").append(script);

}