//Replaace all 'textic' with extention name
//Add in Extension specific code
//Save in file extension-name.js

function texticJuice(ju,insert,targetDiv){
	id = "texticSel";
	this.targetDiv = targetDiv;
	initFunc = this.starttextic;
	if(arguments.length){
		juice.loadGoogle_jsapi();
		texticJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
		texticJuice.superclass.startup.call(this);
	}

}

texticJuice.prototype = new JuiceProcess();
texticJuice.prototype.constructor = texticJuice;
texticJuice.superclass = JuiceProcess.prototype;

texticJuice.prototype.starttextic = function(){
	this.showInsert();
	var This = this;
	juice.onAllLoaded(function(){This.load();});
}

texticJuice.prototype.load = function(){
	var text = '<a id="TTLaunchA" href="http://www.textic.com">' +
		'<img id="talkletslaunchbutton" alt="Text-to-speech screen reading accessibility. Click to listen to website." ' +
		'src="http://www.talklets-secure.com/images/198/loading.gif" style="border:0px;" /></a>';
	$jq("#"+this.targetDiv).append(text);
	juice.loadJs("http://s3.talklets-secure.com/Talklets2/jslaunch.aspx");
}