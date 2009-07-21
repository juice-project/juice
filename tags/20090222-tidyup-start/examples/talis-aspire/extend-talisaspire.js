$(document).ready(function () {
	juice.setDebug(true)
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/metadefs/talis_aspire_metadef.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/panels/juiceListPanel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/panels/juiceBasicPanel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/GBSEmbedAreilX.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/GBSAreilX.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/WorldCatAriel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/AmzcoukAriel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/AudiblecoukAriel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/WaterstonesAriel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/LibraryThingAriel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/deliciousAriel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/copacAriel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/OpenLibraryAriel.js");
	juice.loadJs("http://talis-rjw.s3.amazonaws.com/juice-project/MTAEmbedAriel.js");
	juice.loadCss("http://talis-rjw.s3.amazonaws.com/juice-project/juiceDefault.css");
	juice.onJsLoaded(runExtensions);
});

function runExtensions(){
	talis_aspire_metadef();
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
	var panel = new JuiceBasicPanel(insert,"ExtentionsPanelWindow",'juiceXInactiveIcon','juiceXActiveIcon',null);
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

