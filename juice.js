/*
 * Juice 0.4.1 - Javascript User Interface Framework for Extension
 * http://juice-project.googlecode.com
 *
 * Copyright (c) 2009 Talis (talis.com)
 * Originator: Richard Wallis
 * Under GPL (gpl-2.0.txt) license.
 *
 * $Author: richard.wallis@talis.com $
 * $Date: 2009-03-23 18:15:18 +0000 (Mon, 23 Mar 2009) $
 * $Rev: 39 $
 */

//============== Remap jQuery ==============
// Isolates Juice from use of jQuery compatability mode whilst retailing a short-ish cut 
var $jq = jQuery;
	
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
	$jq(document).ready(this._setReady);
}

//Version of Juice
_Juice.prototype.version = "0.4";

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
	if(this._overlayFunc == null){
		try{
			this._overlayFunc = juiceOverlayDisplay;
		}catch(msg){
			//catch undefined juiceOverlayDisplay - the default function JavasSript not loaded. 
			//juice.debugOutln("juiceOverlayDisplay not defined");
		}
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

//getMetaArray - return array of stored value(s) or null
//arg: id - Description id to use
//See also: JuiceMetaAttr.getValues
_Juice.prototype.getMetaArray = function(id){
	var meta = this.getMetaInstance(id);
	if(meta != null){
		return meta.getValues();
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

/**
 * Ouput via debug all metadefinions and their values nicely formatted.
 */
_Juice.prototype.debugMeta = function(){
	for(var i=0;i < this._meta.length;i++){
		var meta = this._meta[i];
		var div = $jq("<div class='juice-debug-meta'>");
		$jq("<span class='juice-debug-meta-id'>")
		  .appendTo(div).text(meta.getId());
		if (meta.hasMeta()) {
			var values = $jq("<ul>");
			jQuery.each( meta.getValues(), function(i,s){
				$jq("<li class='juice-debug-meta-value'>")
				  .appendTo( values ).text(s);
			});
			div.append(values);
		}else{
			div.append(" not set");
		}
		juice.debugOut(div);
	}	
}

//addPanel - Store panel description
//arg: panel - Description - type JuicePanel
_Juice.prototype.addPanel = function(panel){
	this._panels[this._panels.length] = panel;
}

//hasDebugWin - Returns true if page contains debug win
_Juice.prototype.hasDebugWin = function(){
	if($jq(this._debugWinSel).length){
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
		$jq(this._debugWinSel).append(text);
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
	$jq(selector).append(html);
}

//addToPanel - add selector to panel(s)
//arg: sel - selector to add - type JuiceSelectProcess
//If selector defines a default panel - only add to that, otherwise all panels
//See also: JuiceSelectProcess, JucePanel
_Juice.prototype.addToPanel = function(sel){
	for(var i=0;i < this._panels.length;i++){
		var defPanel = sel.defPanel();
		var panel = this._panels[i];
		if((defPanel == null && !panel.shared()) ||
		  (defPanel != null && panel.getPanelId() != defPanel)){
			continue;
		}
		panel.add(sel);
	}
	
}

//enableOnPanel - enaple selector on panel(s) 
//arg: sel - selector to enable - type JuiceSelectProcess
//See also: JuiceSelectProcess, JucePanel
_Juice.prototype.enableOnPanel = function(sel,pos){
	for(var i=0;i < this._panels.length;i++){
		var defPanel = sel.defPanel();
		var panel = this._panels[i];
		if((defPanel == null && !panel.shared()) ||
		  (defPanel != null && panel.getPanelId() != defPanel)){
			continue;
		}
		panel.enable(sel,pos);
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
		case "iframe-ovelay":
			var target  = this.launchOverlayWin(arg1,arg2);
			this.launchIframeWin(uri,target);
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
	var target = null;
	if(this.overlayFunc()){
		if(content instanceof JuiceInsert)
		{
			content = content.container();
		}
		target = this.overlayFunc()(content,hdrContent);
	}
	return target;
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
	var target = insert;
	if(insert instanceof JuiceInsert){
		insert.show();
		target = insert.getInsertObject();
	}
	if(target){
		var frame = document.createElement("iframe");
		frame.id = "juiframe";
		frame.src = uri;
		frame.height = target.height();
		frame.width  = target.width();
		frame.scrolling = "auto";
		target.append(frame);
	}
}

//Global instance of Juice class created on load
var juice = new _Juice();


//============== Class JuiceInsert ==============	
//Definition of insert in to document body
//InsertPoint could result in multiple instances of insert on a single page - this is supported
//methods such asa show(), getInsertObject(), and remove() default to a zero position in any
//aray of instances to simplify operation of a single insert instance.

function JuiceInsert(container,insertPoint,insertType){
	//html/dom to insert in to page
	this._container = container;
	//JQuery selection identifying insert point(s) in document
	this._insertPoint = insertPoint;
	//How to insert at insert point: before | after | append | prepend | replace
	this._insertType = insertType;
	//Shown flags
	this.shown = [];
	//JQuery/Dom elements created on insertion
	this._insertObjects = [];
	//Number of matching insert points
	this.inserts = $jq(this._insertPoint).length;

	for(var i=0;i< this.inserts; i++){
		this.shown[i] = false;
		this._insertObjects[i] = null;
	}
}

//container - Set/get function used to load container
//arg: v - new value - optional
JuiceInsert.prototype.container = function(v){
	if(v != null){
		this._container = v;
	}
	return this._container;
}

//insertPoint - Set/get function used to load insertPoint
//arg: v - new value - optional
JuiceInsert.prototype.insertPoint = function(v){
	if(v != null){
		this._insertPoint = v;
	}
	return this._insertPoint;
}

//insertType - Set/get function used to load insertType
//arg: v - new value - optional
JuiceInsert.prototype.insertType = function(v){
	if(v != null){
		this._insertType = v;
	}
	return this._insertType;
}

//insertCount - return count of instances of this insert 
JuiceInsert.prototype.insertCount = function(){
	return this.inserts;
}

//insertObjects - return array of inserted copies of the container from each instance
JuiceInsert.prototype.insertObjects = function(){
	return this._insertObjects;
}

//showAll - Call show() for all instances of this insert
JuiceInsert.prototype.showAll = function(){
	for(var i=0;i< this.inserts; i++){
		this.show(i);
	}
}
	
//show - If not shown, insert container in document
//arg: pos - which instance of this insert to show - optional - defaults to 0

JuiceInsert.prototype.show = function(pos){
	if(!pos){
		pos = 0;
	}
	var This = this;
	$jq(this._insertPoint).each(function(i){
		if(i == pos && !This.shown[i]){
			var ins = jQuery(This._container);
			var target = jQuery(this);
			This._insertObjects[i] = ins;
			switch(This._insertType){
				case "after":
					target.after(ins);
					break;
				case "before":
					target.before(ins);
					break;
				case "prepend":
					target.prepend(ins);
					break;
				case "replace":
					target.replaceWith(ins);
					break;
				case "append":
				default:
					target.append(ins);
					break;
			}
			This.shown[i] = true;
		}		
	});
}

//getInsertObject - return JQuery/Dom element created on insertion
//arg: pos - which instance of this insert - optional - defaults to 0
JuiceInsert.prototype.getInsertObject = function(pos){
	if(!pos){
		pos = 0;
	}
	return this._insertObjects[pos];
}

//remove - remove inserted elements from document - sets shown to false
//arg: pos - which instance of this insert - optional - defaults to 0
JuiceInsert.prototype.remove = function(pos){
	if(!pos){
		pos = 0;
	}
	if(this.shown[pos]){
		this._insertObjects[pos].remove();
		this._insertObjects[pos] = null;
		this.shown[pos] = false;
	}
}

//============== Class JuiceProcess ==============

//Base controlling class for extentions
//See also:	JuiceSelectProcess
	
//arg: id - id of extension - should be unique in current document
//arg: initFunc - function to call when extention ready
//arg: selectFunc - function to call when extension activated
//arg: insert - insert definition to contain extention output embeded in document - optional
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
//arg: insert - insert definition to contain extention output embeded in document - optional
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

//processId - set/get of proceesId
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
//Defers to '_startup' via a setTimeout of 2ms to take advantage of any browser threading cpability
JuiceProcess.prototype.startup = function(){
	//Call real func via a timeout to create new thread
	var This = this;
	setTimeout(function(){This._startup();},2);
}

//_startup - call startFunc if defined
//If no _startFunc defined calls enable() - normally responsibility of any start function.
//Called by 'startup' via a setTimeout of 2ms to take advantage of any browser threading cpability
JuiceProcess.prototype._startup = function(){
	if(this._startFunc){
		this._startFunc(this);
	}else{
		this.enable();
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
	return encodeURIComponent(ret);
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
//arg: pos - optional position in insert array
JuiceProcess.prototype.showInsert = function(pos){
	if(this._insert){
		this._insert.show(pos);
	}
}

//getInsertObjects - returns array of insert objects
//See also: JuiceInsert.insertObjects()
JuiceProcess.prototype.getInsertObjects = function(){
	if(this._insert){
		return this._insert.insertObjects();
	}
	return [];
}

//getInsertObject - returns insert object
//See also: JuiceInsert.getInsertObject()
//arg: pos - optional position in insert array
JuiceProcess.prototype.getInsertObject = function(pos){
	if(this._insert){
		return this._insert.getInsertObject(pos);
	}
	return null;
}

//getInsertCount - returns insert object count
//See also: JuiceInsert.insertCount()
JuiceProcess.prototype.insertCount = function(){
	if(this._insert){
		return this._insert.insertCount();
	}
	return 0;
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
//arg: defPanel - panel this extention is restricted to - optional
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
JuiceSelectProcess.prototype.init = function(id,iconSrc,selText,initFunc,selectFunc,insert,ju,defPanel){
	this._iconSrc = iconSrc;
	this._selText = selText;
	this._defPanel = defPanel;
	JuiceSelectProcess.superclass.init.call(this,id,initFunc,selectFunc,insert,ju);
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
	this._juice.addToPanel(this);
}


//enable - set this extension's selector to enabled state on panel(s)
//arg: pos - Which instance of insert on the panel to enable - defaults to 0 - optional
//See also: _Juice.enableOnPanel()
JuiceSelectProcess.prototype.enable = function(pos){
	this._juice.enableOnPanel(this,pos);
}

//getSelectFunction - return function to call this instance's select function
//Used by panels to define click functions on inserted dom elements
//Arg: i - position in possible array of panels - defaults to 0 - optional
JuiceSelectProcess.prototype.getSelectFunction = function(i){
	if(!i){
		i = 0
	}
	var pos = this.getCallBackPos();
	return(function(){_JXSPA[pos]._selectFunc(i);});
}
	
//============== Class JuicePanel ==============	
	
//Base/Controlling class for selection panels

//arg: insertDiv - JuiceInsert defining panel insert in document
//arg: pannelId - Id of panel
//arg: startClass - css classes to be applied to inserted icons before selector is enabled
//arg: liveClass - css classes to be applied to inserted icons when selector is enabled
//arg: showFunc - function to be called as panel is shown - optional (isert show function may be sufficient)
function JuicePanel(insertDiv, panelId, startClass, liveClass, showFunc){
	this.init(insertDiv, panelId, startClass, liveClass, showFunc);
}

//arg: insertDiv - JuiceInsert defining panel insert in document
//arg: pannelId - Id of panel
//arg: startClass - css classes to be applied to inserted icons before selector is enabled
//arg: liveClass - css classes to be applied to inserted icons when selector is enabled
//arg: showFunc - function to be called as panel is shown - optional (isert show function may be sufficient)
JuicePanel.prototype.init = function(insertDiv, panelId, startClass, liveClass, showFunc){
	this._panelId = panelId;
	this._insertDiv = insertDiv;
	this._startClass = startClass;
	this._liveClass = liveClass;
	this._showFunc = showFunc;
	this.inserted = false;
	this.shown = false;
	this._shared = true;
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

//shared - Set/get showFunc
//arg: v - new value - optional
JuicePanel.prototype.shared = function(v){
	if(v != null){
		this._shared = v;	
	}
	return this._shared;
}

//insert - show the panel containing insert
//See also: JuiceInsert.show()
JuicePanel.prototype.insert = function(){
	if(!this.inserted){
		this._insertDiv.showAll();
		this.inserted = true;
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
	var objects = this._insertDiv.insertObjects();
	for(var i = 0;i < objects.length;i++){
		var id = this.makeId(sel,i);
		var htm = '<img title="'+ sel.selText() + '" id="' + id + '" class="' + this.startClass() + '" src="' + sel.iconSrc() + '" />';
		objects[i].append(htm);
	}
	sel.insert(this._insertDiv);
}

//enable - Sets selector icon's css class to liveClass
//arg: sel - selector
//See also: JuiceSelectProcess 
JuicePanel.prototype.enable = function(sel,pos){
	var func = sel.getSelectFunction(pos);
	var id = this.makeId(sel,pos);
	var classes = this.startClass().split(" ");
	for(var i=0;i < classes.length;i++){
		$jq("#"+id).removeClass(classes[i]);
	}
	classes = this.liveClass().split(" ");
	for(var i=0;i < classes.length;i++){
		$jq("#"+id).addClass(classes[i]);
	}
	$jq("#"+id).click(func);
}

//makeID - construct a uniquie id for selections added to this panel
//combination of panelID, selectorId and position in array of insert instances for this panel
JuicePanel.prototype.makeId = function(sel,pos){
	if(!pos){
		pos = 0;
	}
	return this.getPanelId() + "-" + sel.processId() + "-" + pos;
}

/**
 * Meta definition class for data from elements or element attributes.
 * Can store single value or an array of values. A value is always a string.
 * You can optionally add a filter function to process and/or filter retrieved 
 * data before storage.
 * @constructor
 * @param {String} id The id of meta definition
 * @param {String} selector JQuery selection string for element within page
 * @param {String} [attribute] Attribute name if attribute values are wanted
 * @param {Function} [filter] Function used to process retrieved data before storage
 */
function JuiceMeta(id, selector, attribute, filter){
	if ( jQuery.isFunction(attribute) ) {
		filter = attribute;
		attribute = null;
    }
	this.id = id; // TODO: should better be store in Juice instead of JuiceMeta
	this._selector = selector;
	this._attName = attribute;
	this._filterFunc = filter;
	this._values = [];
	this._find(); // TODO: maybe this should better be called later
}

/**
 * Return a value that have been identified and stored. By default the first
 * value is returned (index 0) but you can select any other value by index.
 * @param {Number} [index] The index of a value, starting with 0
  */
JuiceMeta.prototype.get = function(index){
	return this._values[ index == null ? 0 : index ];
}

/**
 * Return an array of values that have been identified and stored.
 */
JuiceMeta.prototype.getValues = function(){
	return this._values;
}

/**
 * Return the number of values that have been identified and stored.
 */
JuiceMeta.prototype.getLength = function(){
	return this._values.length;
}

/**
 * Return the identifier name of this meta definition.
 */
JuiceMeta.prototype.getId = function(){
	return this.id;
}

/**
 * Return whether value(s) have been identified and stored.
 */
JuiceMeta.prototype.hasMeta = function(){
	return this._values.length > 0
}

/**
 * Internal internal function to identify & store values from JQuery selector
 */
JuiceMeta.prototype._find = function(){
	var THIS = this;
	var i = 0;
	$jq(this._selector).each(function(){
		var val;
		if(THIS._attName){
			val = $jq(this).attr(THIS._attName);
		}else{
			if ($jq(this).size() > 0) {
				//Only want the text of this node - not child nodes 
				// TODO: better save a jQuery object and filter filter nodes?
				val = "";
				var contents = $jq(this).contents();
				contents.each(function(){if(this.nodeType == 3 ) val += this.nodeValue;});	
			}
		}
		if(jQuery.isFunction(THIS._filterFunc) && val !== undefined ){
			val = THIS._filterFunc(val); // TODO: why was THIS given as second parameter to filter?
		}
		if (val !== undefined) {
			THIS._values[i++] = val;
		}
	});
}

//============== Utilities ==========

//runscript - add script element to document
//arg: id - script id - used to identify & remove any previous instaces in document
//arg: src - src uri of script to insert
_Juice.prototype.runscript = function(id,src){
	$jq("#"+id).remove();
	var cont = '<script id="' + id + '" src="' + src +'" type="text/javascript"></script>';
	$jq(document).prepend(cont);
}

//Script &  CSS Loading Utilities ----------

	//onAllLoaded - call function when all loading Google APIs and JavaScripts are loaded
	//Waits on setTimeout of 5ms before trying again
	_Juice.prototype.onAllLoaded = function(func){
		var This = this;
		if(this.isGoogleApiLoaded() && this.isJsLoaded()){
			func();
		}else{
			setTimeout(function(){This.onAllLoaded(func);},5);
		}
	}



//JsLoadFlag - utility class to track script loading ready states
function JsLoadFlag(file){
	this.name = file;
	this.loaded = false;
}

//JsLoadFlags - Array to track script/css file loadings
_Juice.prototype.JsLoadFlags = [];

//Load script file - append to head of of document - ONLY if not previously loaded anywhere in document
//arg: onLoadEvent - function to call when loaded
_Juice.prototype.loadJs = function (file,onLoadEvent){
	if(this.findJs(file)){
		if(onLoadEvent){
			onLoadEvent();
		}
		return;
	}
	this._loadFile(file,"js",onLoadEvent);
}
		
//Load css file - append to head of of document
_Juice.prototype.loadCss = function (file){
	this._loadFile(file,"css");
}
		
//_loadFile - internl function to append file elements to document header
//arg: type - "function to call when loaded "css" | "js"
//arg: onLoadEvent - function to call when loaded - only relevant for type "js"
_Juice.prototype._loadFile = function (file,type,onLoadEvent){
	var This = this;
	var evnt = onLoadEvent;
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

	if(type == "js"){
		This.JsLoadFlags[this.JsLoadFlags.length] = new JsLoadFlag(file);
		
		ins.onreadystatechange = function () {
	        if (ins.readyState == 'loaded' || ins.readyState == 'complete') {
				if(evnt){
					evnt();
				}
	            This.jsOnLoadEvent(file);
	        }
	    }
	    ins.onload = function () {
			if(evnt){
				evnt();
			}
	       This.jsOnLoadEvent(file);
	    }
	}
	//Copy of jQuery fix for IE6 - insert at top of head 
	head.insertBefore( ins, head.firstChild );
}

//findJs - return true if script element already loaded in document
_Juice.prototype.findJs = function (file){
	var fileString = this.urlRoot(file);
	var scripts = document.getElementsByTagName('script');
	
	for(var i=0;i < scripts.length;i++){
		if(this.urlRoot(scripts[i].getAttribute("src")) == fileString){
			return true;
		}
	}
	return false;
}

//Remove everything after and including '#' and/or '?' from a string
_Juice.prototype.urlRoot = function(url){
	str = new String(url);
	if(str.indexOf('#') != -1){
		str = new String(str.substring(0,str.indexOf('#')));
	}
	if(str.indexOf('?') != -1){
		str = new String(str.substring(0,str.indexOf('?')));
	}
	return str.toString();
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
		setTimeout(function(){This.onJsLoaded(func);},10);
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

_Juice.prototype._googleApiKey = "";
_Juice.prototype.googleApiKey = function(v){
	if(v != null){
		this._googleApiKey = v;	
	}
	return this._googleApiKey;
}

_Juice.prototype._googleLoadFlag = "off";
_Juice.prototype.loadGoogle_jsapi = function(apiKey){
	var key = this._googleApiKey;
	if(apiKey){
		key = apiKey;
	}
	if(key != ""){
		key = "key=" + key + "&";
	}
	if(this._googleLoadFlag == "off"){
		this._googleLoadFlag = "loading";
		var google = "http://www.google.com/jsapi?" + key + "callback=_juice_googleLoad";
		juice.loadJs(google);
	}
}

function _juice_googleLoad(){
	juice._googleLoaded();
}

_Juice.prototype._googleLoaded = function(){
	this._googleLoadFlag = "loaded";
}

_Juice.prototype.loadGoogleApi = function(api,ver,args){
	if(!this.googleApiLoaded(api)){
		this.gapLoadFlags[this.gapLoadFlags.length] = new JsLoadFlag(api);
		this._loadGoogleApi(api,ver,args);
	}
}	

_Juice.prototype._loadGoogleApi = function(api,ver,args){
	var This = this;
	
	this.loadGoogle_jsapi();	//Check we have loaded the master api

	if(this._googleLoadFlag == "loaded"){
		this.startLoadGoogleApi(api,ver,args);
	}else{
		setTimeout(function(){This._loadGoogleApi(api,ver,args);},20);
	}
}

_Juice.prototype.gapLoadFlags = [];

_Juice.prototype.startLoadGoogleApi = function(api,ver,args){
//	if(!this.googleApiLoaded(api)){
//		this.gapLoadFlags[this.gapLoadFlags.length] = new JsLoadFlag(api);
		google.load(api, ver,{callback:function(){juice.gapOnLoadEvent(api);}})		
//	}
}

//gapOnLoadEvent - called by browser Google API load - flags api as loaded
//arg: name - id of api loaded
_Juice.prototype.gapOnLoadEvent = function(name){
	var loadFlags = this.gapLoadFlags;
	for(var i=0;i < loadFlags.length; i++ ){
		if(name == loadFlags[i].name){
			loadFlags[i].loaded = true;
			break;
		}
	}
}


	//Google API Loading utils ----------

//onGoogleApiLoaded - call function when all loading Google APIs are loaded
//Waits on setTimeout of 5ms before trying again
_Juice.prototype.onGoogleApiLoaded = function(func){
	var This = this;
	if(this.isGoogleApiLoaded()){
		func();
	}else{
		setTimeout(function(){This.onGoogleApiLoaded(func);},5);
	}
}

//isJsLoaded - returns true if all Google APis  loaded
_Juice.prototype.isGoogleApiLoaded = function(){
	if(this.googleApiNotLoaded().length){
		return false;
	}
	return true;
}

//googleApiNotLoaded - returns array of Google APis names not yet loaded
_Juice.prototype.googleApiNotLoaded = function(){
	var ret = [];
	var loadFlags = this.gapLoadFlags;
	for(var i = 0;i < loadFlags.length; i++ ){
		if(!loadFlags[i].loaded){
			ret[ret.length] = loadFlags[i].name;
		}
	}
	return ret;
}	
//googleApiLoaded - returns true if Google APi loading or loaded
_Juice.prototype.googleApiLoaded = function(api){
	var ret = [];
	var loadFlags = this.gapLoadFlags;
	for(var i = 0;i < loadFlags.length; i++ ){
		if(loadFlags[i].name == api){
			return true;
		}
	}
	return false;
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
	var raw = juice.stringToArray(str,",.:;");
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
	var seps = " \t\n\r" + extras;
	var index;

	var items = [];
	var count = 0;

	while (str != "") {
	  index = 0;
	  while (index < str.length && juice.isSepChar(str.charAt(index),seps)) {
	    index++;  
	  }
	  if (index < str.length) {
	    var item = "";
	    while (index < str.length && !juice.isSepChar(str.charAt(index),seps)) {
	      item += str.charAt(index);
	      index++;
	    }

	    items[count++] = item;
	  }
	  str = str.substring(index+1, str.length);
	}
  return items;
}


_Juice.prototype.isSepChar = function(ch,chars) 
// Given   : ch is a character
// Returns : true if ch is a whitecase letter
// arg: chars - string containing alternative whitecase characters - optional
{ 
	var white = " \t\n\r";
	if(chars != null || chars != ""){
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

