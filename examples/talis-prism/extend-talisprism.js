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
	juice.loadCss("http://juice-project.s3.amazonaws.com/extensions/TwitterFeed.css");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/TwitterFeed.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GoogleRssfeed.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GoogleAnalytics.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/Carousel3D.js");
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
				buildLocationsMapsInsert();
			break;
			case "sandbox-ac":
				buildSelectionPanel();
				buildMapsInsert();
				buildGBSInsert();
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
		"iframe-overlay",
		insert);
}
function buildMTAInsert(){
	var div = '<div id="MTAPanel" style="display: block; width: 240px; height: 310px"><br/><h2 class="title">Meet the Author</h2><div id="MTAViewer" style="width: 240px; height: 200px"></div></div>';
	var insert = new JuiceInsert(div,"#itemActions > ul:last","after");
	procMTA = new MTAEmbedJuice(juice,insert,"MTAViewer");
}

function buildLocationsMapsInsert(){
	if(juice.hasMeta("location")){
		var locs = juice.getMetaArray("location");
		var div = '<div id="LocMapPanel" style="display: block; width: 240px; height: 310px"><br/><h2 class="title">Library Location</h2><div id="LocMap" style="width: 240px; height: 250px"></div></div>';
		var insert = new JuiceInsert(div,"#itemActions > ul:last","after");
				var mapOps = {
					height : "250px",
					width : "240px",
					defaultZoom : 12,
					defaultCenter : {lt: 51.481436,lg: -0.085402},
					points : libraryLocations,
					select: locs
				};
			 	new GoogleMapJuice(juice,insert,"LocMap",mapOps);
	}
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

var libraryLocations = [
{ point : {lt: 51.500087,lg: -0.059738}, id : "Blue Anchor", title : "Blue Anchor Library", body : "Market Place<br/>Southwark Park Road<br/>SE16 3UQ<br/><br/><i>Opening hours</i>: Monday, Tuesday and Thursday 9am to 7pm, Friday 10am to 6pm, Saturday 9am to 5pm"},
{ point : {lt: 51.490095,lg: -0.098791}, id : "Brandon", title : "Brandon Library", body : "Maddock Way<br/>Cooks Road<br/>SE17 3NH<br/><br/><i>Opening hours</i>: Monday 10am to 6pm, Tuesday and Thursday 10am to 7pm, Saturday 10am to 5pm"},
{ point : {lt: 51.481436,lg: -0.085402}, id : "Camberwell", title : "Camberwell Library", body : "17-21 Camberwell Church Street<br/>SE5 8TR<br/><br/><i>Opening hours</i>: Monday, Tuesday and Thursday 9am to 8pm, Friday 10am to 6pm, Saturday 9am to 5pm"},
{ point : {lt: 51.4562, lg: -0.070381}, id : "Dulwich", title : "Dulwich Library", body : "368 Lordship Lane<br/>SE22 8NB<br/><br/><i>Opening hours</i>: Monday, Wednesday, Thursday and Friday 9am to 8pm, Tuesday 10am to 8pm, Saturday 9am to 5pm, Sun 12pm to 4pm"},
{ point : {lt: 51.497736, lg: -0.076904}, id : "East St.", title : "East Street Library", body : "168-170 Old Kent Road<br>SE1 5TY<br/><br/><i>Opening hours</i>: Monday and Thursday 10am to 7pm, Tuesday 10am to 6pm, Sat 10am to 5pm"},
{ point : {lt: 51.469034, lg: -0.074415}, id : "Grove Vale", title : "Grove Vale Library", body : "25-27 Grove Vale<br/>SE22 8EQ<br/><br/><i>Opening hours</i>: Monday and Thursday 10am to 7pm, Tuesday 10am to 6pm, Saturday 10am to 5pm"},
{ point : {lt: 51.436835, lg: -0.076132}, id : "Kingswood", title : "Kingswood Library", body : "Seeley Drive<br/>SE21 8QR<br/><br/><i>Opening hour</i>s: Monday and Thursday 10am to 2pm, Tuesday and Friday 2pm to 6pm, Sat 1pm to 5pm"},
{ point : {lt: 51.480688, lg: -0.065145}, id : "Local History Library", title : "Local History Library", body : "122 Peckham Hill Street<br/>SE15 5JR<br/><br/><i>Opening hours</i>: Monday and Thursday, 10am to 8pm, Tuesday and Friday, 10am to 5pm, Saturday 10am to 1pm"},
{ point : {lt: 51.498271, lg: -0.092525}, id : "Newington", title : "Newington Library", body : "155-157 Walworth Road<br/>SE17 1RS<br/><br/><i>Opening hours</i>: Monday, Tuesday and Friday 9am to 8pm, Wednesday and Thursday 10am to 8pm, Saturday 9am to 5pm, Sunday 12pm to 4pm"},
{ point : {lt: 51.47315, lg: -0.055532}, id : "Nunhead", title : "Nunhead Library", body : "Gordon Road<br/>SE15 3RW<br/><br/><i>Opening hours</i>: Monday, Tuesday and Thursday 10am to 7pm, Friday 10am to 6pm, Saturday 10am to 5pm"},
{ point : {lt: 51.481757, lg: -0.065145}, id : "Peckham", title : "Peckham Library", body : "122 Peckham Hill Street<br/>SE15 5JR<br/><br/><i>Opening hours</i>: Monday, Tuesday, Thursday and Friday 9am to 8pm, Wednesday 10am to 8pm, Saturday 10am to 5pm, Sunday 12pm to 4pm"},
{ point : {lt: 51.507247, lg: -0.048838}, id : "Rotherhithe", title : "Rotherhithe Library", body : "Albion Street<br/>SE16 7HY<br/><br/><i>Opening hours</i>: Monday and Thursday 10am to 7pm, Tuesday and Wednesday 10am to 6pm, Saturday 10am to 5pm"}
];

function frontPage(){
	var html = '<div id="hpContainer" style="width: 100%; margin-right: auto; margin-left: auto; text-align: left; height: auto;">' +
				'<div id="hpTop"style="width: 100%; margin-right: auto; margin-left: auto; text-align: left; height: auto;"/>' +
				'<div id="hpLeft" style="width: 30%; float: left; border-right: 5px;"/>' +
				'<div id="hpCenter" style="width: 40%; float: left; text-align: center;">' +
				'<div id="hpCenterHead" class="gfg-title" style="display: block; width: 100%; text-align: center; hight: 20px"></div>'+
				'<div id="hpCenterBody" style="display: block; width: 100%;"/>' +
				'</div>' +
				'<div id="hpRight" style="width: 30%; float: right; border-left: 5px;"/>' +
				'</div>';
	var insert = new JuiceInsert(html,"#pageContent","append");
	insert.show();
	var googleOptions = {
	   numResults : 10
	 }

	 new GoogleRSSFeedJuice(juice,insert,"hpRight", "http://blogs.talis.com/panlibus/feed", googleOptions);
	 new GoogleRSSFeedJuice(juice,insert,"hpLeft", "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/front_page/rss.xml", googleOptions);
	if(whichPrism == "sandbox-ac"){
/*		$jq('#hpCenterHead').append("Opening Hours");
		insertHours();
*/
		$jq('#hpCenterHead').append("Library Tweets");
		var ops = {
			height : "280px",
			width : "350px",
			showAvatar : true,
			showId : true,
			showLink : true,
			count: 4
		};
		new TwitterFeedJuice(juice,insert,"hpCenterBody","#talis",ops);
	}else{
		//sandbox-Gov
		$jq('#hpCenterHead').append("Library Locations");
		var mapOps = {
			height : "280px",
			width : "350px",
			defaultZoom : 12,
			defaultCenter : {lt: 51.481436,lg: -0.085402},
			points : libraryLocations
		};
	 	new GoogleMapJuice(juice,insert,"hpCenterBody",mapOps);
		$jq("#hpTop").append('<div class="gfg-title" style="display: block; width: 100%; text-align: center; hight: 20px">New Additons to stock</div>');
		var carouselOpts = {
			height : "350px",
			width : "960px",
			feedUrl: "http://juice-project.s3.amazonaws.com/examples/talis-prism/sandbox-ac-carousel.atom",
			items : [
			{ src : "http://prism.talis.com/sandbox-gov/imageservice.php?id=9780596000486&size=medium",
			  label : "JavaScript : the definitive guide",
			  link : "http://prism.talis.com/sandbox-gov/items/620805"},
			{ src : "http://prism.talis.com/sandbox-gov/imageservice.php?id=9780747551003&size=medium",
			  label : "Harry Potter and the order of the Phoenix",
			  link : "http://prism.talis.com/sandbox-gov/items/642036"},
			{ src : "http://prism.talis.com/sandbox-gov/imageservice.php?id=9781846040832&size=medium",
			  label : "Fighting the banana wars and other Fairtrade battles",
			  link : "http://prism.talis.com/sandbox-gov/items/723910"},
			{ src : "http://prism.talis.com/sandbox-gov/imageservice.php?id=9780349116051&size=medium",
			  label : "The wisdom of crowds",
			  link : "http://prism.talis.com/sandbox-gov/items/674096"},
			{ src : "http://prism.talis.com/sandbox-gov/imageservice.php?id=9781840782332&size=medium",
			  label : "C++ programming",
			  link : "http://prism.talis.com/sandbox-gov/items/645259"},
			{ src : "http://prism.talis.com/sandbox-gov/imageservice.php?id=9780099162810&size=medium",
			  label : "Orson Cart and the seamonster",
			  link : "http://prism.talis.com/sandbox-gov/items/93643"},
			{ src : "http://prism.talis.com/sandbox-gov/imageservice.php?id=9780500019962&size=medium",
			  label : "Art & fashion",
			  link : "http://prism.talis.com/sandbox-gov/items/682072"}
			]
		}
	 	new Carousel3DJuice(juice,insert,"hpTop",carouselOpts);
	}

}

function insertHours(){
var hours = '<div style="text-align: left; margin-left: 40px; " id="branch_hours">' +
    '<div id="branch_hours_inner">' +
//        '<h2 style="text-align: center;">Opening Hours</h2>' +
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





