var procEGBS = null;
var locationBits = document.location.pathname.split('/');
var whichPrism = locationBits[1];
var demo = false;
if(whichPrism == "demo"){
	demo = true;
	whichPrism = locationBits[2];
}
var whichPage = locationBits[locationBits.length - 1];

juice.googleApiKey("ABQIAAAAKi1cC767naAPtNw6ExDJHBSr1cLuvfmD_hPnfKXXZtPgfYowlRRaiVfGUqzawVB9RWLIPD4MTDzgdw");
	
jQuery(document).ready(function () { 
	juice.setDebug(true);
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/JuiceSimpleInsert.js");
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
//	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/LibraryThingCK.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/MTAEmbed.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GoogleMap.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GoogleRssfeed.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GoogleAnalytics.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/local/UCDMaps.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/local/textic.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/juiceOverlay-0.3.js");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceDefault.css");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceOverlay.css");
	juice.onJsLoaded(runExtensions);
});

function runExtensions(){
	buildExtendedBy();
	var procGas = new gasJuice(juice);
	talis_prism_metadef();
//	juice.debugMeta();
	if(whichPage == "index.php" || whichPage == "" ){
		frontPage();
	}
	
//	juice.overlayFunc(juiceOverlayDisplay);
	switch(whichPrism){
		case "sandbox-gov":
	//	buildTextic();
		break;
		case "sandbox-ac":
		break;
	}	
	if(juice.hasMeta()){
		switch(whichPrism){
			case "sandbox-gov":
				buildSelectionPanel2();
				buildMTAInsert();
			break;
			case "sandbox-ac":
				buildSelectionPanel();
				buildGBSInsert();
				buildMapsInsert();
			break;
		}
		
		buildWorldCatIframe();


		var procGBS = new GBSJuice(juice,
			'http://books.google.com/intl/en/googlebooks/images/gbs_preview_button1.gif',
			'Preview at Google Books');

		var procAmzcouk = new amzcoukJuice(juice,
			'http://library.corporate-ir.net/library/17/176/176060/mediaitems/109/a.co.uk_logo_RGB.jpg',
			'Search Amazon.co.uk');
		var procAudiblecouk = new audiblecoukJuice(juice,
			'http://www.audible.co.uk/mercury/logo.jpg',
			'Search Audible');
		var procWaterstones = new waterstonesJuice(juice,
			'http://www.waterstones.com/waterstonesweb/graphics/global/branding_logo.gif',
			'Search Waterstones',"current");
		var procLibraryThing = new librarythingSearchJuice(juice,
			'http://talis-rjw.s3.amazonaws.com/arielx/images/librarything-logo.gif',
			'Search LibraryThing');
/*		var procLibraryThingCK = new LibraryThingCKJuice(juice,
			'http://juice-project.s3.amazonaws.com/examples/talis-prism/images/ltcommonknowledge-med.gif',
			'LibraryThing Common Knowledge');
*/
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

function buildMapsInsert(){
//	juice.debugOutln("buildMapsInsert");
	var div = '<div id="MapPanelWindow" style="display: inline; margin-left: 5px;"></div>';
	var insert = new JuiceInsert(div,"#availability > table > tbody > tr > td:nth-child(2)","append");
	var panel = new JuiceBasicPanel(insert,"MapPanelWindow",'juiceXInactiveIcon','juiceXActiveIcon',null);
	panel.shared(false);
	juice.addPanel(panel);
	var procMaps = new UCDMapsJuice(juice,
		'http://juice-project.s3.amazonaws.com/extensions/local/floormap1.gif',
		'Locate in Library',"MapPanelWindow");
}

function buildSelectionPanel(){
	var div = '<div id="ExtentionsPanel" style="display: block; width: 100%">' +
		'<br/><h2 class="title">Extensions</h2>' +
		'<div id="ExtentionsPanelWindow" style="width: 100%">' +
		'</div></div>';
	var insert = new JuiceInsert(div,"#details","append");
	var panel = new JuiceBasicPanel(insert,"ExtentionsPanelWindow",'juiceXInactiveIcon juiceXMediumPaddedIcon','juiceXActiveIcon juiceXMediumPaddedIcon',null);
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
	var div = '<div id="worldcatframe" style="display: block; height: 600px; width: 100%; border: 1px solid #EAEADC; ">' + 
		'</div>';
	var insert = new JuiceInsert(div,"#details .table","after");
	var procWorldcat = new worldcatJuice(juice,
		'http://talis-rjw.s3.amazonaws.com/arielx/images/worldcat.jpg',
		'Search WorldCat',
		null,
		"iframe-ovelay",
		insert);
}
function buildMTAInsert(){
	var div = '<div id="MTAPanel" style="display: block; width: 240px; height: 310px"><br/><h2 class="title">Meet the Author</h2><div id="MTAViewer" style="width: 240px; height: 200px"></div></div>';
	var insert = new JuiceInsert(div,"#itemActions > ul:last","after");
	procMTA = new MTAEmbedJuice(juice,insert,"MTAViewer");
}

function buildExtendedBy(){
	var div = '<div id="extendedBy" style="display: block; width: 100%; text-align: center;">' +
	'Extended by <a href="http://juice-project.googlecode.com">The Juice Project</a></div>';
	var insert = new JuiceInsert(div,"body","append");
	var procExtendedBy = new simpleInsertJuice(juice,insert);	
}

function buildTextic(){
	var div = '<div id="textic"></div>';
	var insert = new JuiceInsert(div,"#pageFooter","prepend");
	new texticJuice(juice,insert,"textic");
}

function frontPage(){
	var html = '<div id="hpContainer" style="width: 100%; margin-right: auto; margin-left: auto; text-align: left; height: auto;">' +
				'<div id="hpLeft" style="width: 30%; float: left; border-right: 5px;"/>' +
				'<div id="hpCenter" style="width: 40%; float: left; text-align: center;">' +
//				'<div id="hpCenterHead" style="display: block; width: 100%; text-align: center; hight: 20px">Your Libraries</div>'+
				'<div id="hpCenterHead" class="gfg-title" style="display: block; width: 100%; text-align: center; hight: 20px">Library Locations</div>'+
				'<div id="hpCenterBody" style="display: block; width: 100%;"/>' +
				'</div>' +
				'<div id="hpRight" style="width: 30%; float: right; border-left: 5px"/>' +
				'</div>';
	var insert = new JuiceInsert(html,"#pageContent","append");
	insert.show();
	var googleOptions = {
	   numResults : 10
	 }

	 new GoogleRSSFeedJuice(juice,insert,"hpRight", "http://blogs.talis.com/panlibus/feed", googleOptions);
	 new GoogleRSSFeedJuice(juice,insert,"hpLeft", "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/front_page/rss.xml", googleOptions);
	if(whichPrism == "sandbox-ac"){
		insertHours();
	}else{
		var mapOps = {
			height : "280px",
			width : "350px",
			zoom : 13,
			center : {lt: 52.00, lg: 0.00},
			points : [
			{ point : {lt: 52.00, lg: 0.00}, title : "Test point", body : "This is some display text"},
//			{ point : {lt: 52.01, lg: 0.01}, title : "Test point2", body : "This is some display text"}
			]
		};
	 	new GoogleMapJuice(juice,insert,"hpCenterBody",mapOps);
	}

}

function insertHours(){
var hours = '<div style="text-align: left; margin-left: 40px; " id="branch_hours">' +
    '<div id="branch_hours_inner">' +
        '<h2 style="text-align: center;">Opening Hours</h2>' +
        '<table id="branch_hours_table">' +
            '<tr>' +
                '<td style="text-align: left;">Sunday</td>' +
                '<td style="text-align: center;">10:00AM - 4:00PM</td>' +
            '</tr>' +
            '<tr>' +
                '<td style="text-align: left;">Monday</td>' +
                '<td style="text-align: center;">9:30AM - 9:00PM</td>' +
            '</tr>' +
            '<tr>' +
                '<td style="text-align: left;">Tuesday</td>' +
                '<td style="text-align: center;">9:30AM - 9:00PM</td>' +
            '</tr>' +
            '<tr>' +
                '<td style="text-align: left;">Wednesday</td>' +
                '<td style="text-align: center;">9:30AM - 9:00PM</td>' +
            '</tr>' +
            '<tr>' +
                '<td style="text-align: left;">Thursday</td>' +
                '<td style="text-align: center;">9:30AM - 9:00PM</td>' +
            '</tr>' +
            '<tr>' +
                '<td style="text-align: left;">Friday</td>' +
                '<td style="text-align: center;">9:30AM - 9:00PM</td>' +
            '</tr>' +
            '<tr>' +
                '<td style="text-align: left;">Saturday</td>' +
                '<td style="text-align: center;">9:30AM - 9:00PM</td>' +
            '</tr>' +
        '</table>' +
    '</div>' +
'</div>';
var insert = new JuiceInsert(hours,"#hpCenterBody","append");
insert.show();
}





