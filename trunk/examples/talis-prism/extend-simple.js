// Localised Juice extention file by Matt Machell

// **********README************
// This file is compatible with Juice version 0.7+
// It assumes you will load Juice after you load jQuery and you use $ not an alias
// It assumes you keep the Juice folder structure intact for easy extension loading
// This file includes the Google Books embed as an example extension

//run on page ready
$(function () {

	//allow showing of debug info. Set to false for your live tenancy
    $.juice.setDebug(true);
    
    //load required extensions from local copy
    $.juice.loadExtensions('JuiceSimpleInsert','GBSEmbed');

    //when all are loaded run them
    $.juice.ready(runExtensions);
});

function runExtensions(){
    //run metadefs to scrape needed information    
    talis_prism_metadef();


	//run extensions depending on context
    switch($("body").attr("id")){
        //homepage
        case "index":
            frontPage();
            break;
        
        //search results page
        case "searchaction":
            resultsPage();
            break;
            
            
        //individual item page    
        case "renderitem":
            itemPage();
            break;
    }   
    
    //add extended by attribution
    new extendedbyJuice(juice);
    
}

function frontPage(){
    // Functionality to run on the catalogue home
}

function resultsPage(){ 
   // Functionality to run on the search results page
}

function itemPage(){        
    // Item Page functionality
    if($.juice.hasMeta()) {   
    	//add htmlboilerplate
	    var div = '<div id="GBSPanel" style="display: block; width: 100%">' + 
	    	'<h2 class="title">Look Inside</h2>' + 
	    	'<div id="GBSViewer" style="width: 100%; height: 800px"></div>' + 
	    	'</div>';
		//add insert
	    var insert = new JuiceInsert(div,"#details .table","after");
	    
	    //add embeded google book in insert	    
	    new GBSEmbedJuice($.juice,insert,"GBSViewer");
    
    }    
}

