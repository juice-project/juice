jQuery(document).ready(function () {
	juice.setDebug(true)
	juice.loadJs("http://juice-project.s3.amazonaws.com/metadefs/koha_metadef.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/panels/juiceBasicPanel.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/panels/juiceListPanel.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GBS.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/WorldCat.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/Audiblecouk.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/LibraryThing.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/OpenLibrary.js");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceDefault.css");
	juice.loadJs("http://juice-project.s3.amazonaws.com/juiceOverlay-0.3.js");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceOverlay.css");
	juice.onJsLoaded(runExtensions);
});

function runExtensions(){
	koha_metadef();
//	juice.debugMeta();
	if(juice.hasMeta()){
		buildSelectionPanel();
		var procGBS = new GBSJuice(juice,
			'http://books.google.com/intl/en/googlebooks/images/books_sm2.gif',
			'View at Google Books');
			buildWorldCatIframe();
//		var procWorldcat = new worldcatJuice(juice,
//			'http://talis-rjw.s3.amazonaws.com/arielx/images/worldcat.jpg',
//			'Search WorldCat');
		var procAudiblecouk = new audiblecoukJuice(juice,
			'http://www.audible.co.uk/mercury/logo.jpg',
			'Search Audible');
		var procLibraryThing = new librarythingSearchJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/librarything-logo.gif',
			'Search LibraryThing');
		var procOpenLib = new openlibraryJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/OpenLibrary.jpg',
			'Search Open Library');
	}

}

function buildSelectionPanel(){
	var div = '<div id="ExtentionsPanel2" class="box submenu">' +
		'<h4>Alternative Sources</h4>' +
		'</div>';
	var insert = new JuiceInsert(div,"#further","after");
	var panel = new JuiceListPanel(insert,"ExtentionsPanel2",'juiceXInactiveText','juiceXActiveText',null);
	juice.addPanel(panel);
}


function buildWorldCatIframe(){
	var div = '<div id="worldcatframe" style="display: block; height: 600px; width: 100%; border: 1px solid #EAEADC; ">' + 
		'</div>';
	var insert = new JuiceInsert(div,"body","after");
	var procWorldcat = new worldcatJuice(juice,
		'http://talis-rjw.s3.amazonaws.com/arielx/images/worldcat.jpg',
		'Search WorldCat',
		null,
		"iframe-overlay",
		div);
}

