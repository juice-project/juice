/*
 * Juice 0.7 - Javascript User Interface Framework for Extension
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
var $jq = jQuery; //TODO replace with closure param

//============== Juice Plugin Definition ==============	
(function($jq, window, undefined){
 
 
 //main juice, one only per app
 
var juice = {
_debugEnabled : false,
_ready : false,
_panels : [],
_meta : [],
version : "0.7",
protocol:("https:" == document.location.protocol) ? 'https://' : 'http://',
JsLoadFlags : [],
popup_win : null,
launchWinH : 600,
launchWinW : 800,
gapLoadFlags : [],
googleApiKey : "",
_googleLoadFlag : false	
};
    
//setDebug - Set Debug output state
juice.setDebug = function(state){
	juice._debugEnabled = state;
}

/**
 * Create and store meta reference from DOM elements or element attributes using jQuery selectors.
 * @see #setMeta
 * @param {String} id The id of meta definition to create
 * @param {String} selector JQuery selection string for element within page
 * @param {String} [attribute] Attribute name if attribute values are wanted
 * @param {Function} [filter] Function used to process retrieved data before storage
 */
juice.findMeta = function(id, selector, attribute, filter){
	
	if ( $jq.isFunction(attribute) ) {
		filter = attribute;
		attribute = null;
    }
	var i = 0;
	var values = [];
	$jq(selector).each(function(){
		var val;
		if(attribute){
			val = $jq(this).attr(attribute);
		}else{
			if ($jq(this).size() > 0) {
				//Only want the text of this node - not child nodes 
				// TODO: better save a jQuery object and filter filter nodes?
				val = "";
				var contents = $jq(this).contents();
				contents.each(function(){if(this.nodeType == 3 ) val += this.nodeValue;});
                // TODO: should we normalize space here?
			}
		}
		if($jq.isFunction(filter) && val !== undefined ){
			val = filter(val,id); // TODO: why was THIS given as second parameter to filter?
		}
		if (val !== undefined) {
			values[i++] = val;
		}
	});
	if(values.length > 0){
		juice.setMeta(id,values);
	}
	
}

/**
 * Create and store meta reference from function or data passed.
 * If argument is a function, it should return a value or array of values to store
 * the function will be called with a single argument - the id.
 * @param {String} id The id of meta definition to create
 * @param arg Value(s) to store, or function that returns value(s) to store
 */
juice.setMeta = function(id, arg){
	var val;
	if ( $jq.isFunction(arg) ) {
		val = arg(id);
    }else{
		val = arg;
	}
	if(val){
		var values= $jq.juice.toArray(val);
		juice._meta[id] = {'values':values};	
	}
}

/**
 * Have meta value(s) been stored.
 * @param {String} [id] The id of meta definition to check - optional, defaults to any/all meta values
 * @return true | false
 */
juice.hasMeta = function(id){
	if(id){
		var meta = juice._meta[id];
		if(meta != null){
			return meta.values.length>0;
		}
	}else{
		for(var i in juice._meta){
			if(juice._meta[i] != null){
				return true;
			}
		}
	}
	return false;
}

/**
 * Return stored value
 * @param {String} id The id of meta 
 * @param {int} index element in array of values - optional, defauts to 0.
 * @return value
 */
juice.getMeta = function(id,index){
	var meta = juice._meta[id];
	if(meta != null){
		return meta.values[ index == null ? 0 : index ];
	}
	return null;
}

/**
 * Delete stored value
 * @param {String} id The id of meta 
 */
juice.deleteMeta = function(id){
	if(juice._meta[id]){
		juice._meta[id] = null;
	}
}

/**
 * Return array of stored value(s)
 * @param {String} id The id of meta 
 * @return {Array} values.
 */
juice.getMetaValues = function(id){
	var meta = juice._meta[id]
	if(meta != null){
		return meta.values;
	}
	return null;
}

/**
 * Step through all set meta values
 * Output id and value(s) for each via debugOutln
 * @see #debugOutln
 */
//debugMeta - Ouput via debug all metadefinions and their values if set.
juice.debugMeta = function(){
	for(var i in juice._meta){
		var meta = juice._meta[i];
		if(meta.values.length>0){
			if (meta.values.length>1) {
				juice.debugOutln(i+": ["+meta.values.join(",")+"]");
			} else { 
				// TODO: value may be undefined - is this purpose?
				juice.debugOutln(i+": "+meta.values[ index == null ? 0 : index ]);
			}
		}else{
			juice.debugOutln("Meta "+i+": not set");
		}
	}	
}

//addPanel - Store panel description
//arg: panel - Description - type JuicePanel
juice.addPanel = function(panel){
	juice._panels[juice._panels.length] = panel;
}

//debugOutln - append text to debug window
//arg: text
juice.debugOutln = function(text){
	if(juice._debugEnabled){
		if($jq("#JuiceDebug").length==0){
			$jq("body").append('<div id="JuiceDebug" style="clear: both; z-index: 5000; position: relative; text-align: left; color: #000000; background: #ffffff; font-size: 1.25em;"</div>');
		}
		$jq("#JuiceDebug").append(text+ "<br/>");
	}
}

//addToPanel - add selector to panel(s)
//arg: sel - selector to add - type JuiceSelectProcess
//If selector defines a default panel - only add to that, otherwise all panels
//See also: JuiceSelectProcess, JucePanel
juice.addToPanel = function(sel){
	for(var i=0;i < juice._panels.length;i++){
		var panel = juice._panels[i];
		if(( sel.defPanel == null && !panel.shared) ||
		  ( sel.defPanel != null && panel.panelId !=  sel.defPanel)){
			continue;
		}
		panel.add(sel);
	}
	
}

//enableOnPanel - enable selector on panel(s) 
//arg: sel - selector to enable - type JuiceSelectProcess
//See also: JuiceSelectProcess, JucePanel
juice.enableOnPanel = function(sel,pos){
	for(var i=0;i < juice._panels.length;i++){
		var panel = juice._panels[i];
		if(( sel.defPanel == null && !panel.shared) ||
		  ( sel.defPanel != null && panel.panelId !=  sel.defPanel)){
			continue;
		}
		panel.enable(sel,pos);
	}
	
}

//launchWin - Launch a new win of type type.
//arg: uri - target of win
//arg: type - "new"(default) | "overlay" | "iframe" | "current"
//arg: arg1 - type dependant extra agrument
//arg: arg2 - type dependant extra agrument
juice.launchWin = function(uri,type,arg1,arg2){
	switch(type){
		case "current":
			location.href = uri
			break;
		case "overlay":
			juice.launchOverlayWin(arg1,arg2);
			break;
		case "iframe":
			juice.launchIframeWin(uri,arg1);
			break;
		case "iframe-overlay":
			var target  = juice.launchOverlayWin(arg1,arg2);
			juice.launchIframeWin(uri,target);
			break;
		//TODO opening in a new window is bad practive should we remove?
		case "new":
		default:
			juice.launchExternalWin(uri);
			break;
	}
}

//launchOverlayWin - called by 'launchWin' for type 'overlay' 

juice.launchOverlayWin  = function (content,hdrContent){
	
	if(content instanceof JuiceInsert){
		content = content._container;
	}
	
	$jq('body').append('<div id="juiceOverlayMask" class="juiceOverlayMask"></div>');
	$jq('body').append('<div id="juiceOverlay" class="juiceOverlay" role="dialog" aria-labelledby="juiceovTitle" />');
	$jq('#juiceOverlay').append('<h2 id="juiceovTitle" class="juiceOverlayTitle" tabindex="0" />'+content);
	if(hdrContent){
		$jq("#juiceOverlay h2").append(hdrContent);
	}
	$jq("#juiceOverlay h2").append('<a href="javascript:void()" id="juiceovExitClick"><img alt="close lightbox" src="http://talis-rjw.s3.amazonaws.com/PrismDev/close_icon.png" class="juiceovOverlayExitClick" /></a>');	
	var overlayRemove = function(){
		$jq('#juiceOverlay').remove();
		$jq('#juiceOverlayMask').remove();
	}
	
	$jq("#juiceovExitClick").click(overlayRemove);
	$jq(document).keydown(function(e){
		if(e.keyCode==27){
			overlayRemove();
		}
	});

	
}


//launchExternalWin - create and launch new browser window  - called by 'launchWin' for type "new"
//arg: uri - target uri for window
juice.launchExternalWin = function(uri){
	if(juice.popup_win && !juice.popup_win.closed){
		juice.popup_win.close();
	}
	juice.popup_win = window.open(uri,"Juice",'width='+juice.launchWinW+',height='+juice.launchWinH+',toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes');
	if(window.focus){
		juice.popup_win.focus();
	}
}

//launchIframeWin - create and launch iframe in current browser window  - called by 'launchWin' for type "iframe"
//arg: uri - ifram target
//arg: insert - insert to carry iframe
//See also JuiceInsert
juice.launchIframeWin = function(uri,insert){
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

//============== Utilities ==========

/**
 * Add script element to document
 * @param {string} id script id - used to identify & remove any previous instaces in document
 * @param {uri} src uri of script to insert
 */
juice.runscript = function(id,src){
	$jq("#"+id).remove();
	var cont = '<script id="' + id + '" src="' + src +'" type="text/javascript"></script>';
	$jq(document).prepend(cont);
}   

/**
 * Call user function when all loading Google APIs and JavaScripts are loaded
 * Waits on setTimeout of 5ms before trying again
 * @param func Function to call when ready
 * Also maps to deprecated onAllReady
 */
juice.ready = juice.onAllLoaded =  function(func){
	if(juice.isGoogleApiLoaded() && juice.isJsLoaded()){
		func();
	}else{
		setTimeout(function(){juice.ready(func);},5);
	}
}

//Quick and easy loading of extensions in standard folder structure 
//args: extension strings ('x','y',etc)

juice.loadExtensions = function(){
	var path=$jq('script[src*=/juice.js]').first().attr('src').replace('/juice.js','/');

	var args = Array.prototype.slice.call(arguments);
	args = args.slice(0, args.length);

	for (var i = 0; i < args.length; i++){
		if(args[i].indexOf('.js')==-1) {
			args[i]=args[i]+'.js';
		}
	    juice.loadJs(path+'extensions/'+args[i],'');
	    }
}


//Load script 
//arg: target - append to head of of document - ONLY if not previously loaded anywhere in document
//arg: pathPrefix - path to prefixed to relative and absolute paths
//arg: onLoadEvent - function to call when loaded
juice.loadJs = function (target,pathPrefix,onLoadEvent){
	var file = juice._absoluteUri(target,pathPrefix);
	if(juice.findJs(file)){
		if(onLoadEvent){
			onLoadEvent();
		}
		return;
	}
	juice._loadFile(file,"js",onLoadEvent);
}
		
//Load css 
//arg: target - append to head of of document
//arg: pathPrefix - path to prefixed to relative and absolute paths
juice.loadCss = function (target,pathPrefix){
	juice._loadFile(juice._absoluteUri(target,pathPrefix),"css");
}
		
//_loadFile - internl function to append file elements to document header
//arg: type - "function to call when loaded "css" | "js"
//arg: evnt - function to call when loaded - only relevant for type "js"
juice._loadFile = function (file,type,evnt){
	
	        if(type == "js"){
	           		var head = document.getElementsByTagName('head')[0]; 
	            	var ins = document.createElement('script'); 
	            	evnt = evnt || $jq.noop;
	            	ins.type = 'text/javascript'; 
	            	ins.src = file; 
	            	juice.JsLoadFlags[juice.JsLoadFlags.length] = {'name':file, 'loaded':false};
	            	ins.onreadystatechange = function () {
	            	    if (ins.readyState == 'loaded' || ins.readyState == 'complete') {        
	            	        evnt();      
	            	        juice.jsOnLoadEvent(file);
	            	    }
	            	}
	            	ins.onload = function () {    
	            	   evnt();       
	            	   juice.jsOnLoadEvent(file);
	            	}
	            	head.insertBefore(ins, head.firstChild );
	            	
	        }else if(type == "css"){
	            $('head').prepend('<link type="text/css" rel="stylesheet" href="'+file+'" />');   
	        }
	       	
}

juice._absoluteUri = function(file, pathPrefix){
	if(juice._strBeginsWith(file,"http://") || juice._strBeginsWith(file,"https://") || juice._strBeginsWith(window.location.protocol,"file:") ){
		return file;
	}
	if(juice._strBeginsWith(file,"/")){
		if(!pathPrefix){
			pathPrefix = "";
		}else{
			pathPrefix = "/" + pathPrefix;
		}
		return window.location.protocol + "//" + window.location.host + pathPrefix + file;
	}else{
		if(!pathPrefix){
			pathPrefix = "";
		}else{
			pathPrefix = pathPrefix + "/";
		}
		var ret =  window.location.protocol + "//" + window.location.host;
		var path = document.location.pathname;
		if(juice._strEndsWith(path,"/")){
			path = path.substr(0,path.length -1);
		}
		
		var locationBits = path.split('/');
		for(var i = 0; i < locationBits.length - 1;i++){
			ret += locationBits[i] + "/";
		}
		return ret + pathPrefix + file;
	}
}

//findJs - return true if script element already loaded in document
juice.findJs = function (file){
	var script=$jq('script[src*='+juice.urlRoot(file)+']');
	if(script.length>0) return true;
	return false;
}

//Remove everything after and including '#' and/or '?' from a string
juice.urlRoot = function(url){
	if(url.indexOf('#') != -1){
		url = url.substring(0,url.indexOf('#'));
	}
	if(url.indexOf('?') != -1){
		url = url.substring(0,url.indexOf('?'));
	}
	return url;
}

//jsOnLoadEvent - called by browser script load - flags file as loaded
//arg: name - id of script lodd
juice.jsOnLoadEvent = function(name){
	var loadFlags = juice.JsLoadFlags;
	for(var i=0;i < loadFlags.length; i++ ){
		if(name == loadFlags[i].name){
			loadFlags[i].loaded = true;
			break;
		}
	}
}

//onJsLoaded - call function when all loading scripts are loaded
//Waits on setTimeout of 5ms before trying again
juice.onJsLoaded = function(func){
	if(juice.isJsLoaded()){
		func();
	}else{
		setTimeout(function(){juice.onJsLoaded(func);},10);
	}
}

//isJsLoaded - returns true if all scripts loaded
juice.isJsLoaded = function(){
	!juice.JsNotLoaded().length;
}

//JsNotLoaded - returns array of script names not yet loaded
juice.JsNotLoaded = function(){
	var ret = [];
	var loadFlags = juice.JsLoadFlags;
	for(var i = 0;i < loadFlags.length; i++ ){
		if(!loadFlags[i].loaded){
			ret[ret.length] = loadFlags[i].name;
		}
	}
	return ret;
}	

//Google API Loading utils ----------

juice.loadGoogle_jsapi = function(){
	if(!juice._googleLoadFlag){
		var key = juice.googleApiKey;
		if(key != ""){
			key = "key=" + key + "&";
		}
		juice.loadJs("http://www.google.com/jsapi?" + key, "", function(){
			juice._googleLoadFlag = true;
		});
	}
}

juice.loadGoogleApi = function(api,ver,args){
	if(!juice.googleApiLoaded(api)){
		juice.gapLoadFlags[juice.gapLoadFlags.length] = {'name':api, 'loaded':false};
		juice._loadGoogleApi(api,ver,args);
	}
}	

juice._loadGoogleApi = function(api,ver,args){
	
	juice.loadGoogle_jsapi();	//Check we have loaded the master api

	if(juice._googleLoadFlag){
		google.load(api, ver,{callback:function(){juice.gapOnLoadEvent(api);}})
	}else{
		setTimeout(function(){juice._loadGoogleApi(api,ver,args);},20);
	}
}

//gapOnLoadEvent - called by browser Google API load - flags api as loaded
//arg: name - id of api loaded
juice.gapOnLoadEvent = function(name){
	var loadFlags = juice.gapLoadFlags;
	for(var i=0;i < loadFlags.length; i++ ){
		if(name == loadFlags[i].name){
			loadFlags[i].loaded = true;
			break;
		}
	}
}

//onGoogleApiLoaded - call function when all loading Google APIs are loaded
//Waits on setTimeout of 5ms before trying again
juice.onGoogleApiLoaded = function(func){
	if(juice.isGoogleApiLoaded()){
		func();
	}else{
		setTimeout(function(){juice.onGoogleApiLoaded(func);},5);
	}
}

//isGoogleApiLoaded - returns true if all Google APis  loaded
juice.isGoogleApiLoaded = function(){
	if(juice.googleApiNotLoaded().length){
		return false;
	}
	return true;
}

//googleApiNotLoaded - returns array of Google APis names not yet loaded
juice.googleApiNotLoaded = function(){
	var ret = [];
	var loadFlags = juice.gapLoadFlags;
	for(var i = 0;i < loadFlags.length; i++ ){
		if(!loadFlags[i].loaded){
			ret[ret.length] = loadFlags[i].name;
		}
	}
	return ret;
}	
//googleApiLoaded - returns true if Google APi loading or loaded
juice.googleApiLoaded = function(api){
	var ret = [];
	var loadFlags = juice.gapLoadFlags;
	for(var i = 0;i < loadFlags.length; i++ ){
		if(loadFlags[i].name == api){
			return true;
		}
	}
	return false;
}	

//Text handling utils ----------

juice.nums = '0123456789';
juice.lc = 'abcdefghijklmnopqrstuvwxyz';
juice.uc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//isVal return true if all chars in 'value' string can be found in 'val' string
juice.isVal = function(value,val) {
	if (value == "") return true;
	for (i=0; i<value.length; i++) {
		if (val.indexOf(value.charAt(i),0) == -1) return false;
	}
	return true;
}

juice.isnumser = function(value) {return $jq.juice.isVal(value,$jq.juice.nums);}
juice.isLower = function(value) {return $jq.juice.isVal(value,j$jq.juice.lc);}
juice.isUpper = function(value) {return $jq.juice.isVal(value,$jq.juice.uc);}
juice.isAlpha = function(value) {return $jq.juice.isVal(value,$jq.juice.lc+$jq.juice.uc);}
juice.isAlphanum = function(value) {return $jq.juice.isVal(value,$jq.juice.lc+$jq.juice.uc+$jq.juice.nums);}

//Converts string of words in to an array of strings - word only included if it only conains alphanum chars
//arg: str - string to parse
juice.stringToAlphnumAray = function(str){
	var items = [];
	var count = 0;
	var raw = $jq.juice.stringToArray(str,",.:;");
 	for(j=0;j < raw.length;j++){
		if($jq.juice.isAlphanum(raw[j])){
			items[count++] = raw[j];
		}
	}
	return items;
}

juice.stringToArray = function(str,extras)
// Assumes: str is a sequence of words, separated by whitespace
// Other seperator chars can be added from string extras
// Returns: an array containing the individual words
{
	var seps = " \t\s\n\f\r" + extras.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); //escapes regex chars
	var replace=new RegExp('['+seps+']','mg'); //normalises string
	str.replace(replace, ' ');
	return str.split(' ');
	
}

//Array handling utils ----------

//toArray ensures return is an array of the data.
//If data is single value returns a single element array
//Handles a string as a single value
juice.toArray = function(data){
	var items = [];

	if(!data){
		return items;
	}else if($jq.isArray(data)){
		return data; 		
	}else if(typeof data == "string"){
		items[0] = data; 		
	}else if(!data[0]){ 
		items[0] = data; 
	}else{ 
		items = data; 
	}
	return items;
}

/**
 * Merge values from second array in to first one
 * returns array with values from both
 * any duplicates removed vales from second array taking precedence
 * @param first array
 * @param second array to merg in to first
 * @returns merged array
 */
juice.updateArray = function(first,second){
	var ret = first;
	if(second){
		for(var i in second){
			ret[i] = second[i];
		}
	}
	return ret;
}

///Cookie handling utils

/**
 * Set browser coookie
 * @param {string} name
 * @param {string} value
 * @param {int} [minutes]
 * @param {int} [hours]
 * @param {int} [days]
 * @param {string} [path]
 * @param {string} [domain]
 * @param {boolean} secure
 */

juice.setCookie = function(name,value,minutes,hours,days,path,domain,secure ){
	var cookie_string = name + "=" + escape ( value );

	if(minutes){
		if(!hours){
			hours = 0;
		}
		if(!days){
			days = 0;
		}
		var date = new Date();
		date.setTime(date.getTime()+((((days*24*60*60) + (hours*60*60) + (minutes*60))*1000)));
		var expires = "; expires="+date.toGMTString();
		cookie_string += "; expires=" + expires.toGMTString();
	}

	if(path){
		cookie_string += "; path=" + escape ( path );
	}

	if (domain){
		cookie_string += "; domain=" + escape ( domain );	
	}

	if (secure){
		cookie_string += "; secure";	
	}

	document.cookie = cookie_string;
}
/**
 * Get browser coookie
 * @param {string} name
 * @return {string} cookie value or null
 */
juice.getCookie = function(name){
	var results = document.cookie.match ( '(^|;) ?' + name + '=([^;]*)(;|$)' );
	if ( results ){
		return ( unescape ( results[2] ) );	
	}
	return null;
}
/**
 * Delete browser coookie
 * @param {string} name
 */
juice.deleteCookie = function(name){
	var cookie_date = new Date();  // current date & time
	cookie_date.setTime(cookie_date.getTime() - 1);
	document.cookie = name += "=; expires=" + cookie_date.toGMTString();
}

juice._strBeginsWith = function(str,target){
	return (str.match("^"+target)==target)
}

juice._strEndsWith = function(str,target){
	return (str.match(target+"$")==target)
}

//map _Juice to jQuery plugin and window object TODO deprecate global juice object

window.juice=jQuery.juice=juice;

//============== Class JuiceInsert ==============	
//Definition of insert in to document body
//InsertPoint could result in multiple instances of insert on a single page - this is supported
//methods such asa show(), getInsertObject(), and remove() default to a zero position in any
//aray of instances to simplify operation of a single insert instance.

/**
 * Definition of insert in to document body
 * InsertPoint could result in multiple instances of insert on a single page - this is supported
 * methods such as show(), getInsertObject(), and remove() default to a zero position in any
 * array of instances to simplify operation of a single insert instance.
 * @namespace
 * @constructor
 * @param {String} container html to be inserted in to document
 * @param {String} insertPoint location within document
 * @param {String} insertType How to insert at insert point: before | after | append | prepend | replace
 */

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
	this.insertObjects = [];
	//Number of matching insert points
	this.inserts = $jq(this._insertPoint).length;

	for(var i=0;i< this.inserts; i++){
		this.shown[i] = false;
		this.insertObjects[i] = null;
	}
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
	pos = pos || 0;
	var This = this;
	$jq(this._insertPoint).each(function(i){
		if(i == pos && !This.shown[i]){
			var ins = jQuery(This._container);
			var target = jQuery(this);
			This.insertObjects[i] = ins;
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
	return this.insertObjects[pos || 0];
}

//remove - remove inserted elements from document - sets shown to false
//arg: pos - which instance of this insert - optional - defaults to 0
JuiceInsert.prototype.remove = function(pos){
	pos = pos || 0;
	if(this.shown[pos]){
		this.insertObjects[pos].remove();
		this.insertObjects[pos] = null;
		this.shown[pos] = false;
	}
}

window.JuiceInsert= $jq.juice.insert = JuiceInsert;

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

/**
 * Set vlues in class - then call start
 * @param {String} id of extension - should be unique in current document
 * @param {Function} initFunc function to call when extention ready
 * @param {Function} selectFunc function to call when extension activated
 * @param {JuiceInsert} [insert] definition to contain extention output embeded in document - optional
 * @param {juice} controlling Juice class
 */
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
	this.ProcessId = id;
	this._startFunc = initFunc;
	this._selectFunc = selectFunc;
	this._insert = insert;
	this._juice = ju;
	this._ready = true;
}

//initFunc - set/get initFunc
//arg: v - new value - optional
JuiceProcess.prototype.initFunc = function(v){
	if(v != null){
		this._initFunc = v;	
	}
	return this._initFunc;
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
	if(this._ready){
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


//Global array of juiceProcess's used to externally call back to methods in the correct instance
_JXSPA = [];
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
JuiceProcess.prototype.getInsertObjects = function(){
		return this._insert.insertObjects || [];
}

//getInsertObject - returns insert object
//See also: JuiceInsert.getInsertObject()
//arg: pos - optional position in insert array
JuiceProcess.prototype.getInsertObject = function(pos){
	return this._insert.getInsertObject(pos) || null;
}

//getInsertCount - returns insert object count
//See also: JuiceInsert.insertCount()
JuiceProcess.prototype.insertCount = function(){
	return this._insert.inserts || 0;
}


//enable - dummy function for override in this base class
JuiceProcess.prototype.enable = function(){
//Dummy func
}

window.JuiceProcess=$jq.juice.process = JuiceProcess;

//============== Class JuiceSelectProcess ==============	
	
//TODO fix to use the DOM rather than internals

/**
 * @constructor
 * @augments JuiceProcess
 */
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
	this.selText = selText;
	this.iconSrc = iconSrc;
	this.defPanel = defPanel;
	JuiceSelectProcess.superclass.init.call(this,id,initFunc,selectFunc,insert,ju);
	this.addToIconWin();
	this.startup();
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
	i = i || 0;
	var pos = this.getCallBackPos();
	return(function(){_JXSPA[pos]._selectFunc[i];});
}

window.JuiceSelectProcess = $jq.juice.selectProcess = JuiceSelectProcess;
	
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
	this.liveClass = liveClass;
	this.startClass = startClass;
	this.inserted = false;
	this.shown = false;
	this.shared = true;
	this.panelId = panelId;
	this._insertDiv = insertDiv;
	this._showFunc = showFunc;
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
	var objects = this._insertDiv.insertObjects;
	for(var i = 0;i < objects.length;i++){
		var id = this.makeId(sel,i);
		var htm = '<img title="'+ sel.selText + '" id="' + id + '" class="' + this.startClass + '" src="' + sel.iconSrc + '" />';
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
	var classes = this.startClass.split(" ");
	for(var i=0;i < classes.length;i++){
		$jq("#"+id).removeClass(classes[i]);
	}
	classes = this.liveClass.split(" ");
	for(var i=0;i < classes.length;i++){
		$jq("#"+id).addClass(classes[i]);
	}
	$jq("#"+id).click(func);
}

//makeID - construct a uniquie id for selections added to this panel
//combination of panelID, selectorId and position in array of insert instances for this panel
JuicePanel.prototype.makeId = function(sel,pos){
	pos = pos || 0;
	return this.panelId + "-" + sel.processId + "-" + pos;
}

window.JuicePanel = $jq.juice.panel = JuicePanel;

})(jQuery, window);


