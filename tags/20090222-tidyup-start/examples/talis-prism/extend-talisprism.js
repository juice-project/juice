var procEGBS = null;
	
function startEGBS(){
	if(juice.hasMeta()){
		if(procEGBS != null){
			procEGBS.startupWhenReady();
		}else{
			setTimeout(startEGBS,5);
		}
	}
}
google.load("books", "0");
google.setOnLoadCallback(startEGBS);


$(document).ready(function () {
	juice.setDebug(true);
	juice.loadJs("http://juice-project.s3.amazonaws.com/metadefs/talis_prism_metadef.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/panels/juiceBasicPanel.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/panels/juiceListPanel.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GBSEmbed.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GBS.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/WorldCat.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/Amzcouk.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/Audiblecouk.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/Waterstones.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/LibraryThing.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/delicious.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/copac.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/OpenLibrary.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/LibraryThingCK.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/MTAEmbed.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/juiceOverlay.js");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceDefault.css");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceOverlay.css");
	juice.onJsLoaded(runExtensions);
});

function runExtensions(){
	talis_prism_metadef();
	
	juice.overlayFunc(juiceOverlayDisplay);
	
	if(juice.hasMeta()){
		buildSelectionPanel();
		buildSelectionPanel2();
		buildGBSInsert();
		buildMTAInsert();
		var procGBS = new GBSJuice(juice,
			'http://books.google.com/intl/en/googlebooks/images/books_sm2.gif',
			'View at Google Books');
/*		var procWorldcat = new worldcatJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/worldcat.jpg',
			'Search WorldCat');
*/
		buildWorldCatIframe();

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
		var procOpenLib = new LibraryThingCKJuice(juice,
			'http://juice-project.s3.amazonaws.com/examples/talis-prism/images/ltcommonknowledge-med.gif',
			'LibraryThing Common Knowledge');
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
		'<br/><h2 class="title">Extensions</h2>' +
		'<div id="ExtentionsPanelWindow" style="width: 100%">' +
		'</div></div>';
	var insert = new JuiceInsert(div,"#details","append");
	var panel = new JuiceBasicPanel(insert,"ExtentionsPanelWindow",'juiceXInactiveIcon','juiceXActiveIcon',null);
	juice.addPanel(panel);
}
function buildSelectionPanel2(){
	var div = '<div id="ExtentionsPanel2" style="display: block; width: 100%">' +
		'<br/><h2 class="title">Extensions</h2>' +
		'<div id="ExtentionsPanelWindow2" style="width: 100%">' +
		'</div></div>';
	var insert = new JuiceInsert(div,".sidebar","append");
	var panel = new JuiceListPanel(insert,"ExtentionsPanelWindow2",'juiceXInactiveText','juiceXActiveText',null);
	juice.addPanel(panel);
}

function buildGBSInsert(){
	var div = '<div id="GBSPanel" style="display: block; width: 100%">' + 
		'<br/><h2 class="title">Look Inside</h2>' + 
		'<div id="GBSViewer" style="width: 100%; height: 800px"></div>' + 
		'</div>';
	var insert = new JuiceInsert(div,"#details .table","after");
	procEGBS = new GBSEmbedJuice(juice,insert,"GBSViewer");
}
function buildWorldCatIframe(){
	var div = '<div id="worldcatframe" style="display: block; height: 800px; width: 100%; border: 1px solid #EAEADC; ">' + 
		'</div>';
	var insert = new JuiceInsert(div,"#details .table","after");
	var procWorldcat = new worldcatJuice(juice,
		'http://talis-rjw.s3.amazonaws.com/arielx/images/worldcat.jpg',
		'Search WorldCat',
		null,
		insert);
}
function buildMTAInsert(){
	var div = '<div id="MTAPanel" style="display: block; width: 240px; height: 310px"><br/><h2 class="title">Meet the Author</h2><div id="MTAViewer" style="width: 240px; height: 200px"></div></div>';
	var insert = new JuiceInsert(div,"#itemActions > ul:last","after");
	procMTA = new MTAEmbedJuice(juice,insert,"MTAViewer");
}



