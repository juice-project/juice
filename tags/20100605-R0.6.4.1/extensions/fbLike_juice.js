// fbLike_juice.js

/* Extension to insert FaceBook Like button 
 *
 * Constructor arguments:
 * arg: ju - instance of juice
 * arg: insert - JuiceInsert to use
 * arg: targetDiv - id of element to place like button in
 * arg: opts - overiding options set - optional
 *			 - See Facebook Like Button information for details: http://developers.facebook.com/docs/reference/plugins/like
 *
 * Written by Richard Wallis
 * Version 0.1, July 2010
 */

 
var fbLikeJuice_count = 0;

function fbLikeJuice(ju, insert, targetDiv, opts){
    this.id = "fbLike" + fbLikeJuice_count++;
	juice.debugOutln("fred");
	
    this.targetDiv = targetDiv;					
				
	var defOpts = { 
		"action" : "like" ,
		"colorscheme" : "dark" ,
		"layout" : "standard" ,
		"showfaces" : "true" ,
		"width" : "100%",
		"admins" : null,
		"app_id" : null,
		"site_name" : null,
		"ref" : null };
	
	this.opts = juice.updateArray(defOpts,opts);
	

    initFunc = this.fbLikeInit;
    if(arguments.length){
        fbLikeJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
        fbLikeJuice.superclass.startup.call(this);
    }

}

fbLikeJuice.prototype = new JuiceProcess();
fbLikeJuice.prototype.constructor = fbLikeJuice;
fbLikeJuice.superclass = JuiceProcess.prototype;

fbLikeJuice.prototype.fbLikeInit = function(){
    var This = this;
	juice.loadJs("http://connect.facebook.net/en_US/all.js");
    juice.ready(function(){This.displayFbLike();});
}

fbLikeJuice.prototype.displayFbLike = function(){
	var myhref = location.protocol + "//" + location.hostname + location.pathname;
	
	FB.init({appId: null, status: true, cookie: true, xfbml: true});

	this.addFbMeta("og:title",juice.getMeta("title"));
	this.addFbMeta("og:author",juice.getMeta("author"));
	this.addFbMeta("og:isbn",juice.getMeta("isbn"));
	
	if(juice.getMeta("imageUrl")){
		this.addFbMeta("og:image",juice.getMeta("imageUrl"));
	}
	
	this.addFbMeta("og:type","book");
	this.addFbMeta("og:url",myhref);
	
	if(this.opts.admins){
		this.addFbMeta("fb:admins",this.opts.admins);
	}
	if(this.opts.app_id){
		this.addFbMeta("fb:app_id",this.opts.app_id);
	}
	if(this.opts.site_name){
		this.addFbMeta("fb:site_name",this.opts.site_name);
	}
	
	var thing = '<fb:like href="' + myhref + 
					'" layout="' + this.opts.layout + 
					'" show-faces="' + this.opts.showfaces + 
					'" width="' + this.opts.width + 
					'" action="' + this.opts.action + 
					'" colorscheme="' + this.opts.colorscheme;
					if(this.opts.ref){
						thing += '" ref="' + this.opts.ref;
					}
					thing += '"></fb:like>';
					
		
	this.showInsert();
	var insert = new JuiceInsert(thing, "#"+this.targetDiv,"append");
	insert.show();
}

fbLikeJuice.prototype.addFbMeta = function(name,value){
	var meta = '<meta property="' + name + '" content="' + value + '"/>';
	$jq(document.getElementsByTagName('head')[0]).append(meta);
}
