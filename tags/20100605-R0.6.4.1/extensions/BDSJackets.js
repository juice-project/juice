// BDSJackets.js
// -------------------
// Version: 1.0
// Author: db
// Last Edit: 25/11/2010

// Displays book jackets pulled from  http://www.bdslive.net

// URL for jackets are in the form:
//		http://www.bdslive.net/xmla/imagegrabber.asp?ISBN=<ISBN>&SIZE=<SIZE>&DBM=<PASSWORD>
// SIZE is s or l (Small or Large)
// PASSWORD is supplied by BDS

/*
 * Constructor arguments:
 * arg: ju - instance of juice
 * arg: insert - JuiceInsert to use
 * arg: targetDiv - id of element to place image in
 * arg: size - size of image to insert [small | large] - defaults to small
 * arg: password - password to pass to call to syndetics
 */
 
// Main function
function BDSJackets(ju,insert, targetDiv, size, password){
	// Initialise extension
	id = "BDSJackets";
    this.targetDiv = targetDiv;					
	switch(size){
		case "large" :
			this.size = "l";
			break;
		case "small" :
			this.size = "s";
			break;
		default :
			this.size = "s";
			break;
	}
	this.password = password;

	initFunc = this.start;
	if(arguments.length){
		BDSJackets.superclass.init.call(this,id,initFunc,null,insert,ju);
		BDSJackets.superclass.startup.call(this);
	}
}

BDSJackets.prototype = new JuiceProcess();
BDSJackets.prototype.constructor = BDSJackets;
BDSJackets.superclass = JuiceProcess.prototype;

BDSJackets.prototype.start = function(){

	if(juice.hasMeta("image_isbns")){
		var isbns = juice.getMetaValues("image_isbns");
		
		for(var i=0; i < isbns.length; i++){
		
			// Construct image URL
			var url = "http://www.bdslive.net/xmla/imagegrabber.asp?ISBN=" + 
						isbns[i] + "&SIZE=" + this.size + "&DBM=" + 
						this.password;		

			// Construct image tag
			var newImage = '<img src="' + url + '"/>';
			
			// Add to page
			this.showInsert(i)
			insert = this.getInsertObject(i);
			insert.append(newImage);
		}
	} 
}
