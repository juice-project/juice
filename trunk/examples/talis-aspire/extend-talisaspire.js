jQuery.noConflict();

jQuery(document).ready(function () {
	juice.setDebug(true)
	juice.loadExtensions("talis_aspire_metadef.js","juiceBasicPanel.js", "juiceListPanel.js", "GBSEmbed.js", "GBS.js", "WorldCat.js","Amzcouk.js","Audiblecouk.js","Waterstones.js","LibraryThing.js","delicious.js","copac.js","OpenLibrary.js","LibraryThingCK.js","MTAEmbed.js","juiceOverlay-0.3.js","juiceDefault.css");
	juice.onJsLoaded(runExtensions);
//	setTimeout(function(){juice.debugOutln(juice.JsNotLoaded());},5000)
});

function runExtensions(){
	talis_aspire_metadef();
//	juice.debugOutln(juice.debugMeta());
	if(juice.hasMeta()){
		buildSelectionPanel();
		buildSelectionPanel2();
		buildMTAInsert();
		var procGBS = new GBSJuice(juice,
			'http://books.google.com/intl/en/googlebooks/images/books_sm2.gif',
			'View at Google Books');
		var procWorldcat = new worldcatJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/worldcat.jpg',
			'Search WorldCat');
		var procAmzcouk = new amzcoukJuice(juice,
			'http://library.corporate-ir.net/library/17/176/176060/mediaitems/109/a.co.uk_logo_RGB.jpg',
			'Search Amazon.co.uk');
		var procAudiblecouk = new audiblecoukJuice(juice,
			'http://www.audible.co.uk/mercury/logo.jpg',
			'Search Audible');
		var procWaterstones = new waterstonesJuice(juice,
			'http://www.waterstones.com/waterstonesweb/graphics/global/branding_logo.gif',
			'Search Waterstones');
		var procLibraryThing = new librarythingSearchJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/librarything-logo.gif',
			'Search LibraryThing');
		var procDelicious = new deliciousJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/Delicious.jpg',
			'Bookmark with Delicious');
		var procCopac = new copacJuice(juice,
			'http://copac.ac.uk/img/85x67_copac.gif',
			'Search Copac');
		var procOpenLib = new openlibraryJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/OpenLibrary.jpg',
			'Search Open Library');
		
	}

}
function buildSelectionPanel(){
	var div = '<div id="ExtentionsPanel" style="display: block; width: 100%">' +
		'<br/><div class="panelHeading"><h2 class="floatleft">Alternative Sources</h2></div>' +
		'<div id="ExtentionsPanelWindow" style="width: 100%">' +
		'</div></div>';
	var insert = new JuiceInsert(div,"#itemDetailsProperties","after");
	var panel = new JuiceBasicPanel(insert,"ExtentionsPanelWindow",'juiceXInactiveIcon juiceXMediumPaddedIcon','juiceXActiveIcon juiceXMediumPaddedIcon',null);
	juice.addPanel(panel);
}

function buildSelectionPanel2(){
	var div = '<div id="ExtentionsPanel2" class="itemFulfillmentPanel">' +
		'<div class="itemFulfillmentPanelHeading">Alternative Sources</div>' +
		'<div id="ExtentionsPanelWindow2" class="itemFulfillmentPanelDetail">' +
		'</div></div>';
	var insert = new JuiceInsert(div,"#itemSidebar","append");
	var panel = new JuiceListPanel(insert,"ExtentionsPanelWindow2",'juiceXInactiveText','juiceXActiveText',null);
	juice.addPanel(panel);
}


function buildMTAInsert(){
	var div = '<div id="MTAPanel" style="display: block"><br/>' +
		'<h2 class="title">Meet the Author</h2>' + 
		'<div id="MTAViewer" style="width: 240px; height: 180px"></div>' +
		'</div>';
	var insert = new JuiceInsert(div,"#itemSidebar","append");
	procMTA = new MTAEmbedJuice(juice,insert,"MTAViewer");
}


