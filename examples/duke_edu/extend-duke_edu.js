jQuery(document).ready(function () {
	juice.setDebug(true)
	juice.loadJs("http://juice-project.s3.amazonaws.com/metadefs/duke_edu_metadef.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/panels/juiceBasicPanel.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GBS.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/WorldCat.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/LibraryThing.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/OpenLibrary.js");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceDefault.css");
	juice.onJsLoaded(runExtensions);
});

function runExtensions(){
	duke_edu_metadef();
	if(juice.hasMeta()){
		buildSelectionPanel();
		var procGBS = new GBSJuice(juice,
			'http://books.google.com/intl/en/googlebooks/images/books_sm2.gif',
			'View at Google Books');
		var procWorldcat = new worldcatJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/worldcat.jpg',
			'Search WorldCat');
		var procLibraryThing = new librarythingSearchJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/librarything-logo.gif',
			'Search LibraryThing');
		var procOpenLib = new openlibraryJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/OpenLibrary.jpg',
			'Search Open Library');
	}
}

function buildSelectionPanel(){
	var div = '<div><div id="ExtentionsPanelHdr" class="detailscontentheader">Alternative Sources</div>' +
			  '<div id="ExtentionsPanelWindow" class="detailscontentbody"></div></div>';
	var insert = new JuiceInsert(div,".recorddetailscontent","append");
	var panel = new JuiceBasicPanel(insert,"ExtentionsPanelWindow",'juiceXInactiveIcon juiceXMediumPaddedIcon','juiceXActiveIcon juiceXMediumPaddedIcon',null);
	juice.addPanel(panel);
}


