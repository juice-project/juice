// SyndeticsCovers.js
// -------------------
// Version: 0.4
// Author: Darren Bradley
// Last Edit: 06/09/2010

// Displays book jackets pulled from http://www.syndetics.com
// (Based on AmazonJacket.js)

// URL for jackets are in the form:
//		http://www.syndetics.com/index.aspx?isbn=<ISBN>/<SIZE>.GIF&client=<PASSWORD>type=<TYPE>
// where SIZE is SC or MC (Small or Medium)
// and PASSWORD is customer specific 
// and TYPE is hwwesterkid (This returns the "No Image Found" image)

/*
 * Constructor arguments:
 * arg: ju - instance of juice
 * arg: insert - JuiceInsert to use
 * arg: targetDiv - id of element to place image in
 * arg: size - size of image to insert [small | medium] - defaults to small
 * arg: password - password to pass to call to syndetics
 */
 
function SyndeticsCovers(ju,insert, targetDiv, size, password){
	// Initialise extension
	id = "SyndeticsCovers";
    this.targetDiv = targetDiv;					
	switch(size){
		case "medium" :
			this.size = "MC";
			break;
		case "small" :
			this.size = "SC";
			break;
		default :
			this.size = "SC";
			break;
	}
	this.password = password;

	initFunc = this.start;
	if(arguments.length){
		SyndeticsCovers.superclass.init.call(this,id,initFunc,null,insert,ju);
		SyndeticsCovers.superclass.startup.call(this);
	}
}

SyndeticsCovers.prototype = new JuiceProcess();
SyndeticsCovers.prototype.constructor = SyndeticsCovers;
SyndeticsCovers.superclass = JuiceProcess.prototype;

SyndeticsCovers.prototype.start = function(){

	if(juice.hasMeta("image_isbns")){
		var isbns = juice.getMetaValues("image_isbns");
		
		//juice.debugOutln("meta count: "+isbns.length);
		//juice.debugOutln("insert count: "+this.insertCount());
		
		for(var i=0; i < isbns.length; i++){
		
			var url = "http://www.syndetics.com/index.aspx?isbn=" + 
						isbns[i] + "/" + this.size + ".GIF&client=" + 
						this.password + "&type=hwwesterkid";
			
			var newImage = '<img src="' + url + '"/>';
			
			this.showInsert(i)
			insert = this.getInsertObject(i);
			insert.append(newImage);
		}
	} 
}

