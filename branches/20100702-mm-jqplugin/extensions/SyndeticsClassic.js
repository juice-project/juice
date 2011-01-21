// SyndeticsClassic.js
// -------------------
// Version: 1.0
// Author: db
// Last Edit: 25/11/2010

// THIS EXTENSION IS A DROP-IN REPLACEMENT FOR SyndeticsJackets

// Displays book jacket from Syndetics
// Opens a pop-up window to display Syndetics information from their 'Classic' service

// URL for jackets is in the form:
//		http://www.syndetics.com/index.aspx?isbn=<ISBN>/<SIZE>.GIF&client=<PASSWORD>type=<TYPE>
// Where:
// ISBN is assigned depending on current record
// SIZE is SC or MC (Small or Medium)
// PASSWORD is customer specific 
// TYPE is hwwesterkid (This returns the "No Image Found" image)

// URL for Syndetics Classic data is in the form:
// 		http://lib.syndetics.com/rn12.pl?isbn=<ISBN>/index.html&client=<PASSWORD>;
// Where:
// ISBN is assigned depending on current record
// PASSWORD is customer specific

/*
 * Constructor arguments:
 * arg: ju - instance of juice
 * arg: insert - JuiceInsert to use
 * arg: targetDiv - id of element to place image in
 * arg: size - size of image to insert [small | medium] - defaults to small
 * arg: password - password to pass to call to Syndetics
 */

// This function creates the pop-up window.
function poptastic(url) {
	// Change the window size by altering 'width' and 'height'
	// Setting the title is pretty pointless as the external page will overwrite it
	var newwindow=window.open(url,'SyndeticsClassic JUICE Extension','height=400,width=500');
	if (window.focus) {newwindow.focus()}
}

// Main function
function SyndeticsClassic(ju,insert, targetDiv, size, password){
	// Initialise extension
	id = "SyndeticsClassic";
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
		SyndeticsClassic.superclass.init.call(this,id,initFunc,null,insert,ju);
		SyndeticsClassic.superclass.startup.call(this);
	}
}

SyndeticsClassic.prototype = new JuiceProcess();
SyndeticsClassic.prototype.constructor = SyndeticsClassic;
SyndeticsClassic.superclass = JuiceProcess.prototype;

SyndeticsClassic.prototype.start = function(){

	if(juice.hasMeta("image_isbns")){
		// Get ISBNs for current page
		var isbns = juice.getMetaValues("image_isbns");

		// Parse ISBNs
		for(var i=0; i < isbns.length; i++){
			
			// Construct image URL
			var imgurl = "http://www.syndetics.com/index.aspx?isbn=" + 
						isbns[i] + "/" + this.size + ".GIF&client=" + 
						this.password + "&showCaptionBelow=t&caption=Click+for+more+info";
			
			// Construct info URL
			var infourl = "http://lib.syndetics.com/rn12.pl?isbn=" + 
						isbns[i] + "/index.html&client=" + this.password;
			
			// Construct final link
			var insertLink = "<a href=\"javascript:poptastic('" + infourl + "');\"><img src='" + imgurl + "'></img></a>";
			
			// Add to page
			this.showInsert(i);
			insert = this.getInsertObject(i);
			insert.append(insertLink);
		}
	} 
}
