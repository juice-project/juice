/*
 * Juice 0.1 - Javascript User Interface Framework for Extension
 * http://juice-project.googlecode.com
 *
 * Copyright (c) 2009 Talis (talis.com)
 * Originator: Richard Wallis
 * Under GPL (gpl-2.0.txt) license.
 *
 * $Author$
 * $Date$
 * $Rev$
 */

//============== Class _Juice ==============	
 
function _Juice(){
	this._debugEnabled = true;
	this._debugWinId = "AreilXDebug";
	this._debugWinSel = "#"+this._debugWinId;
	this._metaWinId = "AreilXMeta";
	this._metaWinSel = "#"+this._metaWinId;
	this._ready = false;
	this._panels = [];
	this._meta = [];
	this._overlayFunc = null;
	$(document).ready(this._setReady)
}

_Juice.prototype._setReady = function(){
	this._ready = true;
}

_Juice.prototype.setDebug = function(state){
	this._debugEnabled = state;
}

_Juice.prototype.overlayFunc = function(v){
	if(v != null){
		this._overlayFunc = v;
	}
	return this._overlayFunc;
}

_Juice.prototype.hasMeta = function(id){
	for(var i=0;i < this._meta.length;i++){
		var meta = this._meta[i];
		if((id == null || meta.getId() == id) && meta.hasMeta()){
			return true;
		}
	}
	return false;
}

_Juice.prototype.addMeta = function(meta){
	this._meta[this._meta.length] = meta;
}

_Juice.prototype.getMeta = function(id,index){
	var meta = this.getMetaInstance(id);
	if(meta != null){
		return meta.get(index);
	}
	return null;
}

_Juice.prototype.getMetaInstance = function(id){
	for(var i=0;i < this._meta.length;i++){
		var meta = this._meta[i];
		if(meta.getId() == id && meta.hasMeta()){
			return meta;
		}
	}
	return null;
}

_Juice.prototype.getMetaValue = function(valueId){
	return $(this._metaWinSel + " > #" + valueId).text();
}


_Juice.prototype.addPanel = function(panel){
	this._panels[this._panels.length] = panel;
}

_Juice.prototype.hasDebugWin = function(){
	if($(this._debugWinSel).length){
		return true
	}
	return false;
}

_Juice.prototype.debugOutln = function(text){
	this.debugOut(text + "<br/>");
}

_Juice.prototype.debugOut = function(text){
	if(this._debugEnabled){
		if(!this.hasDebugWin()){
			this.createDebugWin();
		}
		$(this._debugWinSel).append(text);
	}
}

_Juice.prototype.createDebugWin = function(){
	this.appendElement("body","div",this._debugWinId);
}

_Juice.prototype.appendElement = function(selector,type,id){
	var html = '<' + type + ' id="' + id + '"></' + type + '>';
	$(selector).append(html);
}

_Juice.prototype.addToPanel = function(sel){
	for(var i=0;i < this._panels.length;i++){
		var defPanel = sel.defPanel();
		var panel = this._panels[i];
		if(defPanel != null && panel.getPanelId() != defPanel){
			continue;
		}
		panel.add(sel);
	}
	
}
_Juice.prototype.enableOnPanel = function(sel){
	for(var i=0;i < this._panels.length;i++){
		var defPanel = sel.defPanel();
		var panel = this._panels[i];
		if(defPanel != null && panel.getPanelId() != defPanel){
			continue;
		}
		panel.enable(sel);
	}
	
}

_Juice.prototype.popup_win = null;
_Juice.prototype.launchWinH = 600;
_Juice.prototype.launchWinW = 800;

_Juice.prototype.launchWinHieght = function(v){
	if(v != null){
		this.launchWinH = v;
	}
	return this.launchWinH;
}

_Juice.prototype.launchWinWidth = function(v){
	if(v != null){
		this.launchWinW = v;
	}
	return this.launchWinW;
}

_Juice.prototype.launchWin = function(uri,type,arg1,arg2){
	switch(type){
		case "current":
			this.launch(uri);
			break;
		case "overlay":
			this.launchOverlayWin(arg1,arg2);
			break;
		case "iframe":
			this.launchIframeWin(uri,arg1);
			break;
		case "new":
		default:
			this.launchExternalWin(uri);
			break;
	}
}

this._overlayFunc

_Juice.prototype.launch = function(uri){
	location.href = uri;
}

_Juice.prototype.launchOverlayWin = function(content,hdrContent){
	if(this._overlayFunc){
		this._overlayFunc(content,hdrContent);
	}
}

_Juice.prototype.launchExternalWin = function(uri){
	if(this.popup_win && !this.popup_win.closed){
		this.popup_win.close();
	}
	this.popup_win = window.open(uri,"Juice",'width='+this.launchWinW+',height='+this.launchWinH+',toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes');
	if(window.focus){
		this.popup_win.focus();
	}
}


_Juice.prototype.launchIframeWin = function(uri,insert){
	insert.show();
	var target = insert.getInsertObject();
	var frame = document.createElement("iframe");
	frame.id = "juiframe";
	frame.src = uri;
	frame.height = target.height();
	frame.width  = target.width();
	frame.scrolling = "auto";
	target.append(frame);
}

_Juice.prototype.runscript = function(id,src){
	$("#"+id).remove();
	var cont = '<script id="' + id + '" src="' + src +'" type="text/javascript"></script>';
	$(document).prepend(cont);
}


var juice = new _Juice();

//============== Class JuiceInsert ==============	
	

function JuiceInsert(container,insertPoint,insertType){
	this.container = container;
	this.insertPoint = insertPoint;
	this.insertType = insertType;
	this.shown = false;
	this.insertObject = null;
}

JuiceInsert.prototype.show = function(){
	if(!this.shown){
		this.insertObject = jQuery(this.container);
		switch(this.insertType){
			case "after":
				$(this.insertPoint).after(this.insertObject);
				break;
			case "before":
				$(this.insertPoint).before(this.insertObject);
				break;
			case "prepend":
				$(this.insertPoint).prepend(this.insertObject);
				break;
			case "append":
			default:
			$(this.insertPoint).append(this.insertObject);
				break;
		}
		this.shown = true;
		
	}
	
}

JuiceInsert.prototype.getInsertObject = function(){
	return this.insertObject;
}

JuiceInsert.prototype.remove = function(){
	if(this.shown){
		this.insertObject.remove();
		this.insertObject = null;
		this.shown = false;
	}
}

//============== Class JuiceProcess ==============	
	
function JuiceProcess(id,initFunc,selectFunc,ju){
	this._ready = false;
	if( arguments.length ){
		this.init(id,initFunc,selectFunc,ju);
	}
}

JuiceProcess.prototype.initAndStartup = function(id,initFunc,selectFunc,insert,ju){
	this.init(id,initFunc,selectFunc,insert,ju);
	this.startup();
}

JuiceProcess.prototype.init = function(id,initFunc,selectFunc,insert,ju){
	this._ProcessId = id;
	this._startFunc = initFunc;
	this._selectFunc = selectFunc;
	this._insert = insert;
	this._juice = ju;
	this._ready = true;
}
JuiceProcess.prototype.processId = function(v){
	if(v != null){
		this._ProcessId = v;	
	}
	return this._ProcessId;
}
JuiceProcess.prototype.initFunc = function(v){
	if(v != null){
		this._initFunc = v;	
	}
	return this._initFunc;
}
JuiceProcess.prototype.selectFunc = function(v){
	if(v != null){
		this._selectFunc = v;	
	}
	return this._selectFunc;
}
JuiceProcess.prototype.insert = function(v){
	if(v != null){
		this._insert = v;	
	}
	return this._insert;
}


JuiceProcess.prototype.startupWhenReady = function(){
	if(this.ready()){
		this.startup();
	}else{
		var This = this;
		setTimeout(function() { This.startupWhenReady(); },5);
	}
}

JuiceProcess.prototype.startup = function(){
	//Call real func via a timeout to create new thread
	var This = this;
	setTimeout(function(){This._startup();},2);
}

JuiceProcess.prototype._startup = function(){
	if(this._startFunc){
		this._startFunc(this);
	}
}

JuiceProcess.prototype.ready = function(){
	return this._ready;
}


var _JXSPA = [];
JuiceProcess.prototype.callbackArrayPos = -1;

JuiceProcess.prototype.jsonCallBackPrefix = function(funcName){
	var ret = "_JXSPA["+this.getCallBackPos()+"]";
	if(funcName){
		ret += "." + funcName;
	}
	return ret;
}	

JuiceProcess.prototype.getCallBackPos = function(){
	if(this.callbackArrayPos == -1){
		_JXSPA[_JXSPA.length] = this;
		for(var i=0;i < _JXSPA.length;i++){
			if(_JXSPA[i] == this){
				break;
			}
		}
		this.callbackArrayPos = i;
	}
	return this.callbackArrayPos;	
}

JuiceProcess.prototype.enable = function(){
//Dummy func
}
JuiceProcess.prototype.showInsert = function(){
	if(this._insert){
		this._insert.show();
	}
}

//============== Class JuiceSelectProcess ==============	
	
JuiceSelectProcess.prototype = new JuiceProcess();
JuiceSelectProcess.prototype.constructor = JuiceSelectProcess;
JuiceSelectProcess.superclass = JuiceProcess.prototype;


function JuiceSelectProcess(id,iconSrc,alt,initFunc,selectFunc,insert,aX,defPanel){
	this._ready = false;
	if( arguments.length ){
		this.init(id,iconSrc,alt,initFunc,selectFunc,insert,ju,defPanel);
	}
}

JuiceSelectProcess.prototype.init = function(id,iconSrc,selText,initFunc,selectFunc,insert,aX,defPanel){
	this._iconSrc = iconSrc;
	this._selText = selText;
	this._defPanel = defPanel;
	JuiceSelectProcess.superclass.init.call(this,id,initFunc,selectFunc,insert,aX);
	this.addToIconWin();
	this.startup();
}

JuiceSelectProcess.prototype.iconSrc = function(v){
	if(v != null){
		this._iconSrc = v;	
	}
	return this._iconSrc;
}
JuiceSelectProcess.prototype.selText = function(v){
	if(v != null){
		this._selText = v;	
	}
	return this._selText;
}
JuiceSelectProcess.prototype.defPanel = function(v){
	if(v != null){
		this._defPanel = v;	
	}
	return this._defPanel;
}
JuiceSelectProcess.prototype.addToIconWin = function(){
	if(!this._juice.hasMeta()){
			return;
	}
	this._juice.addToPanel(this);
}


JuiceSelectProcess.prototype.enable = function(){
	this._juice.enableOnPanel(this);
}

JuiceSelectProcess.prototype.getSelectFunction = function(){
	var pos = this.getCallBackPos();
	return(function(){_JXSPA[pos]._selectFunc();});
}
	
//============== Class JuicePanel ==============	
	
function JuicePanel(insertDiv, panelId, startClass, liveClass, showFunc){
	this.init(insertDiv, panelId, showFunc);
}

JuicePanel.prototype.init = function(insertDiv, panelId, startClass, liveClass, showFunc){
	this._panelId = panelId;
	this._insertDiv = insertDiv;
	this._startClass = startClass;
	this._liveClass = liveClass;
	this._showFunc = showFunc;
	this.inserted = false;
	this.shown = false;
} 

JuicePanel.prototype.getPanelId = function(){
	return this._panelId;
}

JuicePanel.prototype.startClass = function(v){
	if(v != null){
		this._startClass = v;	
	}
	return this._startClass;
}

JuicePanel.prototype.liveClass = function(v){
	if(v != null){
		this._liveClass = v;	
	}
	return this._liveClass;
}

JuicePanel.prototype.showFunc = function(v){
	if(v != null){
		this._showFunc = v;	
	}
	return this._showFunc;
}

JuicePanel.prototype.insert = function(){
	if(!this.inserted){
		this._insertDiv.show();
	}
}

JuicePanel.prototype.show = function(){
	if(jQuery.isFunction(this._showFunc) && !this.shown){
		this._showFunc();
		this.shown = true;
	}
}

JuicePanel.prototype.add = function(sel){
	this.insert();
	this.show();
	var htm = '<img title="'+ sel.selText() + '" id="' + this.getPanelId() + sel.processId() + '" class="' + this.startClass() + '" src="' + sel.iconSrc() + '" />';
	
	$("#"+this.getPanelId()).append(htm);
}

JuicePanel.prototype.enable = function(sel){
	var func = sel.getSelectFunction();
		$("#"+this.getPanelId() + sel.processId()).removeClass(this.startClass());
		$("#"+this.getPanelId() + sel.processId()).addClass(this.liveClass());
		$("#"+this.getPanelId() + sel.processId()).click(func);
}

//============== Class JuiceMeta ==============	
	
function JuiceMeta(id, selector,filterFunc){
	JuiceMeta.superclass.init.call(this,id, selector, null, filterFunc);
}

JuiceMeta.prototype = new JuiceMetaAttr();
JuiceMeta.prototype.constructor = JuiceMeta;
JuiceMeta.superclass = JuiceMetaAttr.prototype;


//============== Class JuiceMetaAttr ==============	
	
function JuiceMetaAttr(id, selector, attName, filterFunc){
	if( arguments.length ){
		this.init(id, selector, attName, filterFunc);
	}
}

JuiceMetaAttr.prototype.init = function(id, selector, attName, filterFunc){
	this.id = id;
	this._selector = selector;
	this._attName = attName;
	this._filterFunc = filterFunc;
	this._values = [];
	this._found = false;
	this._find();
}

JuiceMetaAttr.prototype.get = function(index){
	if(index == null){
		index = 0;
	}
	return this._values[index];
}

JuiceMetaAttr.prototype.getLength = function(){
	return this._values.length;
}

JuiceMetaAttr.prototype.getId = function(){
	return this.id;
}

JuiceMetaAttr.prototype.hasMeta = function(){
	return this._found;
}

JuiceMetaAttr.prototype._find = function(){
	var THIS = this;
	var i = 0;
	$(this._selector).each(function(){
		var val;
		if(THIS._attName){
			val = $(this).attr(THIS._attName);						
		}else{
			val = $(this).text();			
		}
//		juice.debugOutln("found ["+THIS.id+"]: "+val);
		if(jQuery.isFunction(THIS._filterFunc)){
			THIS._values[i] = THIS._filterFunc(val,THIS);
		}else{
			THIS._values[i] = val;
		}
		if(val.length > 0){
			THIS._found = true;
		}
		i++;
	});
}

//============== Utilities ==========
	//File loading utils ----------
function JsLoadFlag(file){
	this.name = file;
	this.loaded = false;
}

_Juice.prototype.JsLoadFlags = [];

//Load script file - in head of of document - ONLY if not previously loaded anywhere in document
_Juice.prototype.loadJs = function (file){
	if(this.findJs(file)){
		return;
	}
	this._loadFile(file,"js");
}
		
_Juice.prototype.loadCss = function (file){
	this._loadFile(file,"css");
}
		
_Juice.prototype._loadFile = function (file,type){
	var This = this;
	
    var head = document.getElementsByTagName('head')[0]; 
    var ins;
	if(type == "js"){
	 	ins = document.createElement('script'); 
	    ins.type = 'text/javascript'; 
	    ins.src = file; 
	}else if(type == "css"){
	 	ins = document.createElement('link'); 
	    ins.type = 'text/css'; 
	    ins.rel = 'stylesheet'; 		
	    ins.href = file; 		
	}

    head.appendChild(ins); 

	if(type == "js"){
		This.JsLoadFlags[this.JsLoadFlags.length] = new JsLoadFlag(file);
		ins.onreadystatechange = function () {
	        if (ins.readyState == 'loaded' || ins.readyState == 'complete') {
	            This.jsOnLoadEvent(file);
	        }
	    }

	    ins.onload = function () {
	       This.jsOnLoadEvent(file);
	    }
	}
   
}

_Juice.prototype.findJs = function (file){
	var scripts = document.getElementsByTagName('script');
	for(var i=0;i < scripts.length;i++){
		if(scripts[i].getAttribute("src") == file){
			return true;
		}
	}
	return false;
}


_Juice.prototype.jsOnLoadEvent = function(name){
	var loadFlags = this.JsLoadFlags;
	for(var i=0;i < loadFlags.length; i++ ){
		if(name == loadFlags[i].name){
			loadFlags[i].loaded = true;
			break;
		}
	}
}

_Juice.prototype.onJsLoaded = function(func){
	var This = this;
	if(this.isJsLoaded()){
		func();
	}else{
		setTimeout(function(){This.onJsLoaded(func);},5);
	}
}

_Juice.prototype.isJsLoaded = function(){
	if(this.JsNotLoaded().length){
		return false;
	}
	return true;
}

_Juice.prototype.JsNotLoaded = function(){
	var ret = [];
	var loadFlags = this.JsLoadFlags;
	for(var i = 0;i < loadFlags.length; i++ ){
		if(!loadFlags[i].loaded){
			ret[ret.length] = loadFlags[i].name;
		}
	}
	return ret;
}	

	//Text handling utils ----------

_Juice.prototype.nums = '0123456789';
_Juice.prototype.lc = 'abcdefghijklmnopqrstuvwxyz';
_Juice.prototype.uc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

_Juice.prototype.isVal = function(value,val) {
	if (value == "") return true;
	for (i=0; i<value.length; i++) {
		if (val.indexOf(value.charAt(i),0) == -1) return false;
	}
	return true;
}

_Juice.prototype.isnumser = function(value) {return juice.isVal(value,juice.nums);}
_Juice.prototype.isLower = function(value) {return juice.isVal(value,juice.lc);}
_Juice.prototype.isUpper = function(value) {return juice.isVal(value,juice.uc);}
_Juice.prototype.isAlpha = function(value) {return juice.isVal(value,juice.lc+juice.uc);}
_Juice.prototype.isAlphanum = function(value) {return juice.isVal(value,juice.lc+juice.uc+juice.nums);}

_Juice.prototype.stringToAlphnumAray = function(str){
	var items = [];
	var count = 0;
	var raw = juice.stringToArray(str);
 	for(j=0;j < raw.length;j++){
		if(juice.isAlphanum(raw[j])){
			items[count++] = raw[j];
		}
	}
	return items;
}

_Juice.prototype.stringToArray = function(str,extras)
// Assumes: str is a sequence of words, separated by whitespace
// Other seperator chars can be added from string extras
// Returns: an array containing the individual words
{
	var white = " \t\n\r" + extras;
	var index;

	var items = [];
	var count = 0;

	while (str != "") {
	  index = 0;
	  while (index < str.length && juice.isSepChar(str.charAt(index),white)) {
	    index++;  
	  }

	  if (index < str.length) {
	    var item = "";
	    while (index < str.length && !juice.isSepChar(str.charAt(index),white)) {
	      item += str.charAt(index);
	      index++;
	    }

	    items[count] = item
	    count++;
	  }

	  str = str.substring(index+1, str.length);
	}
  return items;
}


_Juice.prototype.isSepChar = function(ch,chars) 
// Given   : ch is a character
// Returns : true if ch is a whitecase letter
{ 
	var white = " \t\n\r";
	if(chars == null || chars == ""){
		white = chars;
	}

	return (white.indexOf(ch) != -1);
}  

_Juice.prototype.toArray = function(data){
	var items = [];

	if(!data){
		return items;
	}else if(typeof data == "string"){
		items[0] = data; 		
	}else if(!data[0]){ 
		items[0] = data; 
	}else{ 
		items = data; 
	}
	return items;
}

//============== Stuff ==============	

function testDebug(data){
	if(this._debugEnabled){
		div = document.getElementById("ExtendDebug");
		if(div){
			div.innerHTML += " " + data;
		}
	}
}

