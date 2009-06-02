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
 
//Master Juice Class - global instance created as 'juice'
function _Juice(){
	this._debugEnabled = false;
	this._debugWinId = "JuiceDebug";
	this._debugWinSel = "#"+this._debugWinId;
	this._ready = false;
	this._panels = [];
	this._meta = [];
	this._overlayFunc = null;
	$(document).ready(this._setReady)
}


_Juice.prototype._setReady = function(){
	this._ready = true;
}

//setDebug - Set Debug output state
_Juice.prototype.setDebug = function(state){
	this._debugEnabled = state;
}

//overlayFunc - Set/get function used to load lightbox overlay
//arg: v - new value - optional
_Juice.prototype.overlayFunc = function(v){
	if(v != null){
		this._overlayFunc = v;
	}
	return this._overlayFunc;
}

//hasMeta - Have mata value(s) been itentified
//arg: id - Meta value name to check - optional, defaults to any meta value
_Juice.prototype.hasMeta = function(id){
	for(var i=0;i < this._meta.length;i++){
		var meta = this._meta[i];
		if((id == null || meta.getId() == id) && meta.hasMeta()){
			return true;
		}
	}
	return false;
}

//addMeta - Store meta description
//arg: meta - Description - type JuiceMetaAttr
_Juice.prototype.addMeta = function(meta){
	this._meta[this._meta.length] = meta;
}

//getMeta - return stored value
//arg: id - Description id to use
//arg: index - element in array of values - optional, defauts to 0.
//See also: JuiceMetaAttr.get
_Juice.prototype.getMeta = function(id,index){
	var meta = this.getMetaInstance(id);
	if(meta != null){
		return meta.get(index);
	}
	return null;
}

//getMetaInstance - Get stored Meta description
//arg: id - Description id of description o return
_Juice.prototype.getMetaInstance = function(id){
	for(var i=0;i < this._meta.length;i++){
		var meta = this._meta[i];
		if(meta.getId() == id && meta.hasMeta()){
			return meta;
		}
	}
	return null;
}

_Juice.prototype.debugMeta = function(){
	for(var i=0;i < this._meta.length;i++){
		var meta = this._meta[i];
		if(meta.hasMeta()){
			juice.debugOutln("Meta: "+meta.getId()+" - "+meta.get());			
		}else{
			juice.debugOutln("Meta: "+meta.getId()+" not set");
		}
	}	
}

//addPanel - Store panel description
//arg: panel - Description - type JuicePanel
_Juice.prototype.addPanel = function(panel){
	this._panels[this._panels.length] = panel;
}

//hasDebugWin - Returns true if page contains debug win
_Juice.prototype.hasDebugWin = function(){
	if($(this._debugWinSel).length){
		return true
	}
	return false;
}

//debugOutln - append text plus '<br/>' to debug window
//arg: text
_Juice.prototype.debugOutln = function(text){
	this.debugOut(text + "<br/>");
}

//debugOutln - append text to debug window
//arg: text
_Juice.prototype.debugOut = function(text){
	if(this._debugEnabled){
		if(!this.hasDebugWin()){
			this.createDebugWin();
		}
		$(this._debugWinSel).append(text);
	}
}

//createDebugWin - append debug window to document body
_Juice.prototype.createDebugWin = function(){
	this.appendElement("body","div",this._debugWinId);
}

//appendElement - append element 
//arg: selector - JQuery select for append point
//arg: type - element type to create
//arg: id - id of element
_Juice.prototype.appendElement = function(selector,type,id){
	var html = '<' + type + ' id="' + id + '"></' + type + '>';
	$(selector).append(html);
}

//addToPanel - add selector to panel(s)
//arg: sel - selector to add - type JuiceSelectProcess
//If selector defines a default panel - only add to that, otherwise all panels
//See also: JuiceSelectProcess, JucePanel
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

//enableOnPanel - enaple selector on panel(s) 
//arg: sel - selector to enable - type JuiceSelectProcess
//See also: JuiceSelectProcess, JucePanel
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

//Global separate browser launch window
_Juice.prototype.popup_win = null;
//Defaut launch window height
_Juice.prototype.launchWinH = 600;
//Defaut launch window width
_Juice.prototype.launchWinW = 800;

//launchWinHieght - set/get defaut launch window height
//arg: v - new value - optional
_Juice.prototype.launchWinHieght = function(v){
	if(v != null){
		this.launchWinH = v;
	}
	return this.launchWinH;
}

//launchWinWidth - set/get defaut launch window width
//arg: v - new value - optional
_Juice.prototype.launchWinWidth = function(v){
	if(v != null){
		this.launchWinW = v;
	}
	return this.launchWinW;
}

//launchWin - Launch a new win of type type.
//arg: uri - target of win
//arg: type - "new"(default) | "overlay" | "iframe" | "current"
//arg: arg1 - type dependant extra agrument
//arg: arg2 - type dependant extra agrument
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

//launch - Go to uri in current browser window - called by 'launchWin' for type "current"
//arg: uri
_Juice.prototype.launch = function(uri){
	location.href = uri;
}

//launchOverlayWin - call Overlay function. - called by 'launchWin' for type "overlay"
//arg: content - html/dom to append to overlay - arg1 from 'launchWin'
//arg: hdrContent - html/dom to append to overlay header  - arg from 'launchWin'
_Juice.prototype.launchOverlayWin = function(content,hdrContent){
	if(this._overlayFunc){
		this._overlayFunc(content,hdrContent);
	}
}

//launchExternalWin - create and launch new browser window  - called by 'launchWin' for type "new"
//arg: uri - target uri for window
_Juice.prototype.launchExternalWin = function(uri){
	if(this.popup_win && !this.popup_win.closed){
		this.popup_win.close();
	}
	this.popup_win = window.open(uri,"Juice",'width='+this.launchWinW+',height='+this.launchWinH+',toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes');
	if(window.focus){
		this.popup_win.focus();
	}
}

//launchIframeWin - create and launch iframe in current browser window  - called by 'launchWin' for type "iframe"
//arg: uri - ifram target
//arg: insert - insert to carry iframe
//See also JiuceInsert
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

//Global instance of Juice class created on load
var juice = new _Juice();


//============== Class JuiceInsert ==============	
//Definition of insert in to document body	

function JuiceInsert(container,insertPoint,insertType){
	//html/dom to insert in to page
	this.container = container;
	//JQuery selection identifying insert point(s) in document
	this.insertPoint = insertPoint;
	//How to insert at insert point: before | after | append | prepend
	this.insertType = insertType;
	//Shown flag
	this.shown = false;
	//JQuery/Dom element created on insertion
	this.insertObject = null;
}

//show - If not show, insert container in document
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

//getInsertObject - return JQuery/Dom element created on insertion
JuiceInsert.prototype.getInsertObject = function(){
	return this.insertObject;
}

//remove - remove inserted elements from document - sets shown to false
JuiceInsert.prototype.remove = function(){
	if(this.shown){
		this.insertObject.remove();
		this.insertObject = null;
		this.shown = false;
	}
}

//============== Class JuiceProcess ==============

//Base controlling class for extentions
//See also:	JuiceSelectProcess
	
//arg: id - id of extension - should be unique in current document
//arg: initFunc - function to call when extention ready
//arg: selectFunc - function to call when extension activated
//arg: insert - insert definition to contain extention outout embeded in document - optional
//arg: ju - controlling Juice class
function JuiceProcess(id,initFunc,selectFunc,insert,ju){
	this._ready = false;
	if( arguments.length ){
		this.init(id,initFunc,selectFunc,insert,ju);
	}
}

//initAndStartup - set vlues in class - then call start
//arg: id - id of extension - should be unique in current document
//arg: initFunc - function to call when extention ready
//arg: selectFunc - function to call when extension activated
//arg: insert - insert definition to contain extention outout embeded in document - optional
//arg: ju - controlling Juice class
JuiceProcess.prototype.initAndStartup = function(id,initFunc,selectFunc,insert,ju){
	this.init(id,initFunc,selectFunc,insert,ju);
	this.startup();
}

//init - set vlues in class
//arg: id - id of extension - should be unique in current document
//arg: initFunc - function to call when extention ready
//arg: selectFunc - function to call when extension activated
//arg: ju - controlling Juice class
JuiceProcess.prototype.init = function(id,initFunc,selectFunc,insert,ju){
	this._ProcessId = id;
	this._startFunc = initFunc;
	this._selectFunc = selectFunc;
	this._insert = insert;
	this._juice = ju;
	this._ready = true;
}

//processId - set/get is of procees
//arg: v - new value - optional
JuiceProcess.prototype.processId = function(v){
	if(v != null){
		this._ProcessId = v;	
	}
	return this._ProcessId;
}

//initFunc - set/get initFunc
//arg: v - new value - optional
JuiceProcess.prototype.initFunc = function(v){
	if(v != null){
		this._initFunc = v;	
	}
	return this._initFunc;
}

//selectFunc - set/get selectFunc
//arg: v - new value - optional
JuiceProcess.prototype.selectFunc = function(v){
	if(v != null){
		this._selectFunc = v;	
	}
	return this._selectFunc;
}

//insert - set/get insert
//arg: v - new value - optional
JuiceProcess.prototype.insert = function(v){
	if(v != null){
		this._insert = v;	
	}
	return this._insert;
}


//startupWhenReady - call 'startup' when instance is set ready
//Wait (using 'setTimeout') 5ms if not ready before retrying
JuiceProcess.prototype.startupWhenReady = function(){
	if(this.ready()){
		this.startup();
	}else{
		var This = this;
		setTimeout(function() { This.startupWhenReady(); },5);
	}
}

//startup - call startFunc if defined
//Defers to '_startup' via a setTimeout of 1ms to take advantage of any browser threading cpability
JuiceProcess.prototype.startup = function(){
	//Call real func via a timeout to create new thread
	var This = this;
	setTimeout(function(){This._startup();},2);
}

//_startup - call startFunc if defined
//Called by 'startup' via a setTimeout of 1ms to take advantage of any browser threading cpability
JuiceProcess.prototype._startup = function(){
	if(this._startFunc){
		this._startFunc(this);
	}
}

//ready - return ready state
JuiceProcess.prototype.ready = function(){
	return this._ready;
}


//Global array of juiceProcess's used to externally call back to methods in the correct instance
var _JXSPA = [];
//This instance's position in global array
JuiceProcess.prototype.callbackArrayPos = -1;

//Construct callback function call for this instance
//arg: methodName - name of method to call
JuiceProcess.prototype.jsonCallBackPrefix = function(methodName){
	var ret = "_JXSPA["+this.getCallBackPos()+"]";
	if(methodName){
		ret += "." + methodName;
	}
	return ret;
}	

//getCallBackPos - return postion of this instance in global array
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

//showInsert - calls show on insert
//See also: JuiceInsert.show()
JuiceProcess.prototype.showInsert = function(){
	if(this._insert){
		this._insert.show();
	}
}

//enable - dummy function for override in this base class
JuiceProcess.prototype.enable = function(){
//Dummy func
}


//============== Class JuiceSelectProcess ==============	
	
//Base class for selection style extensions
//Extends JuiceProcess
//See also: JuiceProcess

//arg: id - id of extension - should be unique in current document
//arg: iconSrc - uri of icon to display in selection panel
//arg: selText - text to display
//arg: initFunc - function to call when extention ready
//arg: selectFunc - function to call when extension activated
//arg: insert - insert definition to contain extention output embeded in document - optional
//arg: ju - controlling Juice class
//arg: defPanel - panel this extention is restrictd to - optional
function JuiceSelectProcess(id,iconSrc,selText,initFunc,selectFunc,insert,ju,defPanel){
	this._ready = false;
	if( arguments.length ){
		this.init(id,iconSrc,selText,initFunc,selectFunc,insert,ju,defPanel);
	}
}

JuiceSelectProcess.prototype = new JuiceProcess();
JuiceSelectProcess.prototype.constructor = JuiceSelectProcess;
JuiceSelectProcess.superclass = JuiceProcess.prototype;


//arg: id - id of extension - should be unique in current document
//arg: iconSrc - uri of icon to display in selection panel
//arg: selText - text to display
//arg: initFunc - function to call when extention ready
//arg: selectFunc - function to call when extension activated
//arg: insert - insert definition to contain extention output embeded in document - optional
//arg: ju - controlling Juice class
//arg: defPanel - panel this extention is restrictd to - optional
JuiceSelectProcess.prototype.init = function(id,iconSrc,selText,initFunc,selectFunc,insert,aX,defPanel){
	this._iconSrc = iconSrc;
	this._selText = selText;
	this._defPanel = defPanel;
	JuiceSelectProcess.superclass.init.call(this,id,initFunc,selectFunc,insert,aX);
	this.addToIconWin();
	this.startup();
}

//iconSrc - Set/get iconSrc
//arg: v - new value - optional
JuiceSelectProcess.prototype.iconSrc = function(v){
	if(v != null){
		this._iconSrc = v;	
	}
	return this._iconSrc;
}

//selText - Set/get selText
//arg: v - new value - optional
JuiceSelectProcess.prototype.selText = function(v){
	if(v != null){
		this._selText = v;	
	}
	return this._selText;
}

//defPanel - Set/get defPanel
//arg: v - new value - optional
JuiceSelectProcess.prototype.defPanel = function(v){
	if(v != null){
		this._defPanel = v;	
	}
	return this._defPanel;
}

//addToIconWin - add this extension's selector to panel(s)
//See also: _Juice.addToPanel()
JuiceSelectProcess.prototype.addToIconWin = function(){
	if(!this._juice.hasMeta()){
			return;
	}
	this._juice.addToPanel(this);
}


//enable - set this extension's selector to enabled state on panel(s)
//See also: _Juice.enableOnPanel()
JuiceSelectProcess.prototype.enable = function(){
	this._juice.enableOnPanel(this);
}

//getSelectFunction - return function to call this instance's select function
//Used by panels to defind click functions on inserted dom elements
JuiceSelectProcess.prototype.getSelectFunction = function(){
	var pos = this.getCallBackPos();
	return(function(){_JXSPA[pos]._selectFunc();});
}
	
//============== Class JuicePanel ==============	
	
//Base/Controlling class for selection panels

//arg: insertDiv - JuiceInsert defining panel insert in document
//arg: pannelId - Id of panel
//arg: startClass - css class to be applied to inserted icons before selector is enabled
//arg: liveClass - css class to be applied to inserted icons when selector is enabled
//arg: showFunc - function to be called as panel is shown - optional (isert show function may be sufficient)
function JuicePanel(insertDiv, panelId, startClass, liveClass, showFunc){
	this.init(insertDiv, panelId, startClass, liveClass, showFunc);
}

//arg: insertDiv - JuiceInsert defining panel insert in document
//arg: pannelId - Id of panel
//arg: startClass - css class to be applied to inserted icons before selector is enabled
//arg: liveClass - css class to be applied to inserted icons when selector is enabled
//arg: showFunc - function to be called as panel is shown - optional (isert show function may be sufficient)
JuicePanel.prototype.init = function(insertDiv, panelId, startClass, liveClass, showFunc){
	this._panelId = panelId;
	this._insertDiv = insertDiv;
	this._startClass = startClass;
	this._liveClass = liveClass;
	this._showFunc = showFunc;
	this.inserted = false;
	this.shown = false;
} 

//getPanelId - return panelId
JuicePanel.prototype.getPanelId = function(){
	return this._panelId;
}

//startClass - Set/get startClass
//arg: v - new value - optional
JuicePanel.prototype.startClass = function(v){
	if(v != null){
		this._startClass = v;	
	}
	return this._startClass;
}

//liveClass - Set/get liveClass
//arg: v - new value - optional
JuicePanel.prototype.liveClass = function(v){
	if(v != null){
		this._liveClass = v;	
	}
	return this._liveClass;
}

//showFunc - Set/get showFunc
//arg: v - new value - optional
JuicePanel.prototype.showFunc = function(v){
	if(v != null){
		this._showFunc = v;	
	}
	return this._showFunc;
}

//insert - show the panel containing insert
//See also: JuiceInsert.show()
JuicePanel.prototype.insert = function(){
	if(!this.inserted){
		this._insertDiv.show();
	}
}

//show - call optional showFunc
JuicePanel.prototype.show = function(){
	if(jQuery.isFunction(this._showFunc) && !this.shown){
		this._showFunc();
		this.shown = true;
	}
}

//add - append selector's icon to panel
//arg: sel - selector
//See also: JuiceSelectProcess
//Sets icon's css class to startClass
//Confirms panel is inserted and shown
JuicePanel.prototype.add = function(sel){
	this.insert();
	this.show();
	var htm = '<img title="'+ sel.selText() + '" id="' + this.getPanelId() + sel.processId() + '" class="' + this.startClass() + '" src="' + sel.iconSrc() + '" />';
	
	$("#"+this.getPanelId()).append(htm);
}

//enable - Sets selector icon's css class to liveClass
//arg: sel - selector
//See also: JuiceSelectProcess 
JuicePanel.prototype.enable = function(sel){
	var func = sel.getSelectFunction();
		$("#"+this.getPanelId() + sel.processId()).removeClass(this.startClass());
		$("#"+this.getPanelId() + sel.processId()).addClass(this.liveClass());
		$("#"+this.getPanelId() + sel.processId()).click(func);
}

//============== Class JuiceMeta ==============	

//Meta definition class
//Extends JuiceMetaAttr
//Can store single value or an array of values

//arg: id - id of definition
//arg: selector - JQuery selection string for element within page
//filterFunc - optional function used to process retrieved data before storage	
function JuiceMeta(id, selector,filterFunc){
	JuiceMeta.superclass.init.call(this,id, selector, null, filterFunc);
}

JuiceMeta.prototype = new JuiceMetaAttr();
JuiceMeta.prototype.constructor = JuiceMeta;
JuiceMeta.superclass = JuiceMetaAttr.prototype;


//============== Class JuiceMetaAttr ==============	
	
//Meta definition class for data from elements or element attributes
//Can store single value or an array of values

//arg: id - id of definition
//arg: selector - JQuery selection string for element within page
//arg: attName - optional name of element attribute 
//filterFunc - optional function used to process retrieved data before storage	
function JuiceMetaAttr(id, selector, attName, filterFunc){
	if( arguments.length ){
		this.init(id, selector, attName, filterFunc);
	}
}

//init
//arg: id - id of definition
//arg: selector - JQuery selection string for element within page
//arg: attName - optional name of element attribute 
//filterFunc - optional function used to process retrieved data before storage	

JuiceMetaAttr.prototype.init = function(id, selector, attName, filterFunc){
	this.id = id;
	this._selector = selector;
	this._attName = attName;
	this._filterFunc = filterFunc;
	this._values = [];
	this._found = false;
	this._find();
}

//get - return stored value
//arg: index - index of value in array of values - optional, defaults to 0
JuiceMetaAttr.prototype.get = function(index){
	if(index == null){
		index = 0;
	}
	return this._values[index];
}

//getLength - return length of values array
JuiceMetaAttr.prototype.getLength = function(){
	return this._values.length;
}

//getId - return id
JuiceMetaAttr.prototype.getId = function(){
	return this.id;
}

//hasMeta - return true if value(s) identified and stored
JuiceMetaAttr.prototype.hasMeta = function(){
	return this._found;
}

//_find - internal function to identify & store values from JQuery selector
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

//runscript - add script element to document
//arg: id - script id - used to identify & remove any previous instaces in document
//arg: src - src uri of script to insert
_Juice.prototype.runscript = function(id,src){
	$("#"+id).remove();
	var cont = '<script id="' + id + '" src="' + src +'" type="text/javascript"></script>';
	$(document).prepend(cont);
}

	//File loading utils ----------
//JsLoadFlag - utility class to track script loading ready states
function JsLoadFlag(file){
	this.name = file;
	this.loaded = false;
}

//JsLoadFlags - Array to track script/css file loadings
_Juice.prototype.JsLoadFlags = [];

//Load script file - append to head of of document - ONLY if not previously loaded anywhere in document
_Juice.prototype.loadJs = function (file){
	if(this.findJs(file)){
		return;
	}
	this._loadFile(file,"js");
}
		
//Load css file - append to head of of document
_Juice.prototype.loadCss = function (file){
	this._loadFile(file,"css");
}
		
//_loadFile - internl function to append file elements to document header
_Juice.prototype._loadFile = function (file,type){
	var This = this;
	
    var head = document.getElementsByTagName('head')[0]; 
    var ins = null;
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

//findJs - return true if script element already loaded in document
_Juice.prototype.findJs = function (file){
	var scripts = document.getElementsByTagName('script');
	for(var i=0;i < scripts.length;i++){
		if(scripts[i].getAttribute("src") == file){
			return true;
		}
	}
	return false;
}


//jsOnLoadEvent - clled by browser script load - flags file as loaded
//arg: name - id of script lodd
_Juice.prototype.jsOnLoadEvent = function(name){
	var loadFlags = this.JsLoadFlags;
	for(var i=0;i < loadFlags.length; i++ ){
		if(name == loadFlags[i].name){
			loadFlags[i].loaded = true;
			break;
		}
	}
}

//onJsLoaded - call function when all loading scripts are loaded
//Waits on setTimeout of 5ms before trying again
_Juice.prototype.onJsLoaded = function(func){
	var This = this;
	if(this.isJsLoaded()){
		func();
	}else{
		setTimeout(function(){This.onJsLoaded(func);},5);
	}
}

//isJsLoaded - returns true if all scripts loaded
_Juice.prototype.isJsLoaded = function(){
	if(this.JsNotLoaded().length){
		return false;
	}
	return true;
}

//JsNotLoaded - returns array of script names not yet loaded
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

//isVal retun true if all chars in 'value' string can be found in 'val' string
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

//Converts string of words in to an array of strings - word only included if it only conains alphanum chars
//arg: str - string to parse
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

//toArray ensures retun is an array of the data.
//If data is single value returns a single element array
//Handles a string as a single value
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
