// SyndeticsJackets.js
// -------------------
// Version: 1.0
// Author: db
// Last Edit: 29/11/2010

// Displays book jackets pulled from http://www.syndetics.com

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
 
function SyndeticsJackets(ju, insert, targetDiv, size, password){
	// Initialise extension
	id = "SyndeticsJackets";
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
		SyndeticsJackets.superclass.init.call(this,id,initFunc,null,insert,ju);
		SyndeticsJackets.superclass.startup.call(this);
	}
}

SyndeticsJackets.prototype = new JuiceProcess();
SyndeticsJackets.prototype.constructor = SyndeticsJackets;
SyndeticsJackets.superclass = JuiceProcess.prototype;

SyndeticsJackets.prototype.start = function(){

	if(juice.hasMeta("image_isbns")){
		// Get ISBNs for current page
		var isbns = juice.getMetaValues("image_isbns");
		// Parse ISBNs
		for(var i=0; i < isbns.length; i++){
			// Construct image URL
			var url = "http://www.syndetics.com/index.aspx?isbn=" + 
						isbns[i] + "/" + this.size + ".GIF&client=" + 
						this.password;
			// Construct final link
			var newImage = '<img src="' + url + '" onError="this.src=\'http://prism.talis.com/talis-consultancy/assets/-/nojacket.gif\';" />';
			
			// Add to page
			this.showInsert(i)
			insert = this.getInsertObject(i);
			insert.append(newImage);
		}
	} 
}

