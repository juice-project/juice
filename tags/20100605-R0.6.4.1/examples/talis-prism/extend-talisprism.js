//////////////// WARNING - this example contains many extra functions for demo purposes
//////////////// Any functions begining with demo_ are not required for a normal Talis Prism tennancy
//////////////// RJW August 2009

//////////////// Code to ascertain prism tennancy name
var locationBits = document.location.pathname.split('/');
var whichPrism = locationBits[1];
if(whichPrism == "demo"){
	whichPrism = locationBits[2];
}

var prismPage = "";

jQuery(document).ready(function () { 
	prismPage = jQuery("body").attr("id");
	whenJuiceLoaded(startJuiceActions);
});

/// Function to wait for juice.js to be fully loaded before proceeding
/// Only really needed if this script file is dynamingly loaded via another script
function whenJuiceLoaded(func){
	if(typeof juice != 'undefined'){
		func();
	}else{
		setTimeout(function(){whenJuiceLoaded(func);},10);
	}
}


///Not normally required see warning at top of file
function demo_Mode(){
	juice.setDebug(true);
	str = new String(window.location.search);
	if(str.indexOf('?') == 0){
		str = str.substring(1,str.length);
	}
	params = str.split('&');
	for(var i=0;i < params.length;i++){
		var param = params[i].split('=');
		if(param[0] == 'demo'){
			if(param[1] == 'yes' || param[1] == 'true'){
				juice.setCookie("juiceDemo","true",0,2,0);
			}else if(param[1] == 'no' || param[1] == 'false'){
				juice.deleteCookie("juiceDemo");
			}			
		}
	}

	if(juice.getCookie("juiceDemo")){
		return true;
	}

	return false;
}

function startJuiceActions(){
	
	if(demo_Mode()){
		juice.loadJs("http://juice-project.s3.amazonaws.com/examples/talis-prism/demo.js");
		return;
	}
	juice.googleApiKey("ABQIAAAAKi1cC767naAPtNw6ExDJHBSr1cLuvfmD_hPnfKXXZtPgfYowlRRaiVfGUqzawVB9RWLIPD4MTDzgdw");
	juice.setDebug(true);
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/JuiceSimpleInsert.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/extendedbyJuice.js");
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
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/AmazonJackets.js");
//	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/BookListFromFeed.js");


juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/qrcode_juice.js");
juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/Carousel3D.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/local/UCDMaps.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/local/LibraryGUIDEMaps.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/local/BhamACMaps.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/local/textic.js");
	juice.loadJs("http://juice-project.s3.amazonaws.com/juiceOverlay-0.3.js");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceDefault.css");
	juice.loadCss("http://juice-project.s3.amazonaws.com/juiceOverlay.css");
	juice.onJsLoaded(runExtensions);
}

function runExtensions(){

	buildExtendedBy();
	new gasJuice(juice,"UA-2411194-19,UA-11090604-1");
	talis_prism_metadef();
//	juice.debugMeta();
	switch(whichPrism){
		case "sandbox-gov":
		new gasJuice(juice,"UA-2411194-12,UA-11090604-1");
		buildTextic();
		break;
		case "sandbox-ac":
		new gasJuice(juice,"UA-2411194-19,UA-11090604-1");
		break;
	}	
	if(prismPage == "index"){
		frontPage();
		return;
	}else if(prismPage == "searchaction"){
		return;
	}
//	juice.overlayFunc(juiceOverlayDisplay);
	if(juice.hasMeta()){
 		switch(whichPrism){
			case "sandbox-gov":
				repaceImage();
				buildSelectionPanel2();
				buildMTAInsert();
				buildLocationsMapsInsert();
				buildQRInsert();
			break;
			case "sandbox-ac":
				buildSelectionPanel();
				buildGBSInsert();
				buildQRInsertSide();
			break;
		}
////
/*		var bhamdiv = '<div id="bhamframe" style="display: block; height: 600px; width: 100%; border: 1px solid #EAEADC; ">' + 
			'</div>';
		var bhaminsert = new JuiceInsert(bhamdiv,"#details .table","after");
		new BhamACDetailMapsJuice(juice,
			"",
			"Find in the Library"
			,null,
			"iframe-overlay",
			bhaminsert);
*/
///
/*
var bhdiv = '<div id="bhPanelWindow" style="display: inline; margin-left: 5px;"></div>';
var bhinsert = new JuiceInsert(bhdiv,".item > .summary > .description","append");
var bhpanel = new JuiceListPanel(bhinsert,"bhPanelWindow",'juiceXInactiveIcon','juiceXActiveIcon',null);
bhpanel.shared(false);
juice.addPanel(bhpanel);
new BhamACListMapsJuice(juice,
	"kjhkjhkjh",
	"Find in the Library"
	,"bhPanelWindow",
	"iframe-overlay",
	bhaminsert);
*/

		buildMapsInsert();
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
//	var insert = new JuiceInsert(div,"#availability > table > tbody > tr > td:nth-child(2)","append");
	var insert = new JuiceInsert(div,"#availability .options table tr.available td:nth-child(4)","append");
	var panel = new JuiceBasicPanel(insert,"MapPanelWindow",'juiceXInactiveIcon','juiceXActiveIcon',null);
	panel.shared(false);
	juice.addPanel(panel);
	switch(whichPrism){
		case "sandbox-gov":
		new LibraryGUIDEMapsJuice(juice,
			'http://juice-project.s3.amazonaws.com/extensions/local/floormap1.gif',
			'Locate in Library',"MapPanelWindow");
		break;
		case "sandbox-ac":
		new UCDMapsJuice(juice,
			'http://juice-project.s3.amazonaws.com/extensions/local/floormap1.gif',
			'Locate in Library',"MapPanelWindow");
		break;
	}
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

function repaceImage(){
	var div = '<div id = "repJack"></div>';
	var insert = new JuiceInsert(div,"#itemControl > .item > .image > img", "replace");
	new AmazonJackets(juice,insert,"repJack");
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
function buildQRInsert(){
	var div = '<div id="QRPanel" style="display: block; float: right; width: 230px; height: 230px"><div id="QRDiv" style="width: 230px; height: 230px"></div></div>';
	var insert = new JuiceInsert(div,"#details > .table","before");
	procMTA = new qrcodeJuice(juice,insert,"QRDiv","title,location,shelfmark",'\n','m');
}
function buildQRInsertSide(){
	var div = '<div id="QRPanel" style="display: block; float: right; width: 230px; height: 230px"><div id="QRDiv" style="width: 230px; height: 230px"></div></div>';
	var insert = new JuiceInsert(div,"#itemActions > ul:last","after");
//	var insert = new JuiceInsert(div,"#details > .table","before");
	new qrcodeJuice(juice,insert,"QRDiv","title,location,shelfmark",'\n','m');
}


function buildLocationsMapsInsert(){
	if(juice.hasMeta("location")){
		var locs = juice.getMetaValues("location");
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
/*
	var div = '<div id="extendedBy" style="display: block; width: 100%; text-align: center;">' +
	'Extended by <a href="http://juice-project.googlecode.com">The Juice Project</a></div>';
	var insert = new JuiceInsert(div,"body","append");
	var procExtendedBy = new simpleInsertJuice(juice,insert);	
*/
	new extendedbyJuice(juice);
}

function buildTextic(){
	var div = '<div id="textic"></div>';
	var insert = new JuiceInsert(div,"#pageFooter","prepend");
	new texticJuice(juice,insert,"textic");
}


var bhamlocs = [
{ point : {lt: 52.480257, lg: -1.904882}, id : "Birmingham Central Library", title : "Birmingham Central Library", body : "Chamberlain Square <br/>Birmingham <br/>B3 3HQ <br/>United Kingdom <br/>"},
        { point : {lt: 52.445041, lg: -1.824157 }, id : "Acocks Green Library", title : "Acocks Green Library", body : "Shirley Road <br/>Birmingham <br/>B27 7XH <br/>United Kingdom <br/>"},
        { point : {lt: 52.503812, lg: -1.895830}, id : "Aston Library", title : "Aston Library", body : "Albert Road <br/>Birmingham <br/>B6 5NQ  <br/>United Kingdom <br/>"},
        { point : {lt: 52.458916, lg: -1.885501}, id : "Balsall Heath Library", title : "Balsall Heath Library", body : "Moseley Road <br/>Balsall Heath <br/>Birmingham <br/>B12 9BX  <br/>United Kingdom <br/>"},
        { point : {lt: 52.436064, lg: -1.998500}, id : "Bartley Green Library", title : "Bartley Green Library", body : "Adams Hill  <br/>Birmingham <br/>B32 3QG   <br/>United Kingdom <br/>"},
        { point : {lt: 52.514065, lg: -1.901494}, id : "Birchfield Library", title : "Birchfield Library", body : "Birchfield Road <br/>Birmingham <br/>B20 3BX  <br/>United Kingdom <br/>"},
        { point : {lt: 52.492326, lg: -1.871659}, id : "Bloomsbury Library", title : "Bloomsbury Library", body : "Nechells Parkway  <br/>Birmingham <br/>B7 4PT  <br/>United Kingdom <br/>"},
        { point : {lt: 52.492326, lg: -1.871659}, id : "Boldmere Library", title : "Boldmere Library", body : "119 Boldmere Road  <br/>Birmingham <br/>B73 5TU  <br/>United Kingdom <br/>"},
        { point : {lt: 52.521875, lg: -1.784308}, id : "Castle Vale Library", title : "Castle Vale Library", body : "Turnhouse Road  <br/>Birmingham <br/>B35 6PR  <br/>United Kingdom <br/>"},
        { point : {lt: 52.407523, lg: -1.889397}, id : "Druids Heath Library", title : "Druids Heath Library", body : "Idmiston Croft  <br/>Birmingham <br/>B14 5NJ  <br/>United Kingdom <br/>"},
        { point : {lt: 52.526040, lg: -1.836304}, id : "Erdington Library", title : "Erdington Library", body : "Orphanage Road  <br/>Birmingham <br/>B24 9HP <br/>United Kingdom <br/>"},
        { point : {lt: 52.404607, lg: -2.016948}, id : "Frankley Library", title : "Frankley Library", body : "Frankley Community High School  <br/>New Street <br/>Birmingham <br/>B45 0EU <br/>United Kingdom <br/>"},
        { point : {lt: 52.490473, lg: -1.794595}, id : "Glebe Farm Library", title : "Glebe Farm Library", body : "Glebe Farm Road  <br/>Birmingham <br/>B33 9NA  <br/>United Kingdom <br/>"},
        { point : {lt: 52.433888, lg: -1.846632}, id : "Hall Green Library", title : "Hall Green Library", body : "1221 Stratford Road  <br/>Hall Green <br/>Birmingham <br/>B28 9AD  <br/>United Kingdom <br/>"},
        { point : {lt: 52.502470, lg: -1.929348}, id : "Handsworth Library", title : "Handsworth Library", body : "Soho Road  <br/>Birmingham <br/>B21 9DP  <br/>United Kingdom <br/>"},
        { point : {lt: 52.458412, lg: -1.951538}, id : "Harborne Library", title : "Harborne Library", body : "High Street <br/>Birmingham <br/>B17 9QG <br/>United Kingdom <br/>"},
        { point : {lt: 52.521280, lg: -1.935198}, id : "Hawthorn House Library", title : "Hawthorn House Library", body : "Hamstead Hall Road <br/>Birmingham <br/>B20 1HX  <br/>United Kingdom <br/>"},
        { point : {lt: 52.476340, lg: -1.788536}, id : "Kents Moat Library", title : "Kents Moat Library", body : "55-57 Pool Way  <br/>Birmingham <br/>B33 8NF  <br/>United Kingdom <br/>"},
        { point : {lt: 52.437616, lg: -1.892956}, id : "Kings Heath Library", title : "Kings Heath Library", body : "High Street <br/>Birmingham <br/>B14 7SW  <br/>United Kingdom <br/>"},
        { point : {lt: 52.410133, lg: -1.928275}, id : "Kings Norton Library", title : "Kings Norton Library", body : "Pershore Road South <br/>Birmingham <br/>B30 3EU  <br/>United Kingdom <br/>"},
        { point : {lt: 52.551970, lg: -1.885334}, id : "Kingstanding Library", title : "Kingstanding Library", body : "Kingstanding Road <br/>Birmingham <br/>B44 9ST  <br/>United Kingdom <br/>"},
        { point : {lt: 52.477699, lg: -1.923630}, id : "Ladywood Community and Health Centre", title : "Ladywood Community and Health Centre", body : "St.Vincent Street West <br/>Birmingham <br/>B16 8RP <br/>United Kingdom <br/>"},
        { point : {lt: 52.587460, lg: -1.824961}, id : "Mere Green Library", title : "Mere Green Library", body : "30A Mere Green Road <br/>Birmingham <br/>B75 5BT <br/>United Kingdom <br/>"},
        { point : {lt: 52.414987, lg: -1.967434}, id : "Northfield Library", title : "Northfield Library", body : "77 Church Road <br/>Birmingham <br/>B31 2LB <br/>United Kingdom <br/>"},
        { point : {lt: 52.534245, lg: -1.879277}, id : "Perry Common Library", title : "Perry Common Library", body : "College Road <br/>Birmingham <br/>B44 0HH <br/>United Kingdom <br/>"},
        { point : {lt: 52.460274, lg: -1.987181}, id : "Quinton Library", title : "Quinton Library", body : "Ridgacre Road <br/>Birmingham <br/>B32 2TW  <br/>United Kingdom <br/>"},
        { point : {lt: 52.441217, lg: -1.938360}, id : "Selly Oak Library", title : "Selly Oak Library", body : "669 Bristol Road <br/>Birmingham <br/>B29 6AE <br/>United Kingdom <br/>"},
        { point : {lt: 52.495259, lg: -1.776279}, id : "Shard End Library", title : "Shard End Library", body : "Shustoke Road <br/>Birmingham <br/>B34 7BA  <br/>United Kingdom <br/>"},
        { point : {lt: 52.461874, lg: -1.783041}, id : "Sheldon Library", title : "Sheldon Library", body : "Brays Road <br/>Birmingham <br/>B26 2RJ  <br/>United Kingdom <br/>"},
        { point : {lt: 52.471264, lg: -1.857131}, id : "Small Heath Library", title : "Small Heath Library", body : "Muntz Street <br/>Birmingham <br/>B10 9RX  <br/>United Kingdom <br/>"},
        { point : {lt: 52.460079, lg: -1.816621}, id : "South Yardley Library", title : "South Yardley Library", body : "Yardley Road <br/>Birmingham <br/>B25 8LT  <br/>United Kingdom <br/>"},
        { point : {lt: 52.449499, lg: -1.864558}, id : "Sparkhill Library", title : "Sparkhill Library", body : "641 Stratford Road <br/>Birmingham <br/>B11 4EA  <br/>United Kingdom <br/>"},
        { point : {lt: 52.485375, lg: -1.920819}, id : "Spring Hill Library", title : "Spring Hill Library", body : "Spring Hill <br/>Birmingham <br/>B18 7BH  <br/>United Kingdom <br/>"},
        { point : {lt: 52.428866, lg: -1.923553}, id : "Stirchley Library", title : "Stirchley Library", body : "Bournville Lane <br/>Birmingham <br/>B30 2JT <br/>United Kingdom <br/>"},
        { point : {lt: 52.562457, lg: -1.823217}, id : "Sutton Coldfield Library", title : "Sutton Coldfield Library", body : "Lower Parade <br/>Sutton Coldfield  <br/>Birmingham <br/>B72 1XX  <br/>United Kingdom <br/>"},
        { point : {lt: 52.533668, lg: -1.920055}, id : "Tower Hill Library", title : "Tower Hill Library", body : "Tower Hill <br/>Birmingham <br/>B42 1LG  <br/>United Kingdom <br/>"},
        { point : {lt: 52.541079, lg: -1.800714}, id : "Walmley Library", title : "Walmley Library", body : "Walmley Road <br/>Sutton Coldfield  <br/>Birmingham <br/>B76 1NP  <br/>United Kingdom <br/>"},
        { point : {lt: 52.494798, lg: -1.835344}, id : "Ward End Library", title : "Ward End Library", body : "Washwood Heath Road  <br/>Birmingham <br/>B8 2HF  <br/>United Kingdom <br/>"},
        { point : {lt: 52.439036, lg: -1.968049}, id : "Weoley Castle Library", title : "Weoley Castle Library", body : "76 Beckbury Road <br/>Birmingham <br/>B29 5HR  <br/>United Kingdom <br/>"},
        { point : {lt: 52.400592, lg: -1.960125}, id : "West Heath Library", title : "West Heath Library", body : "The Fordrough  <br/>Birmingham <br/>B31 3LX  <br/>United Kingdom <br/>"},
        { point : {lt: 52.418648, lg: -1.859168}, id : "Yardley Wood Library", title : "Yardley Wood Library", body : "Highfield Road <br/>Birmingham <br/>B14 4DU  <br/>United Kingdom <br/>"}
];
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
	var html = '<div id="hpContainer" style="background-color: transparent; width: 100%; margin-right: auto; margin-left: auto; text-align: left; height: auto;">' +
					'<div id="hpTop" style="width: 100%; margin-right: auto; margin-left: auto; text-align: left; height: auto;"/>' +
					'<div id="hpbottom" style="height: auto; display: block; overflow: hidden; width: 100%; background-color: #ffffff; border: 1px; border-style: solid; border-color: #3366cc;">' +
						'<div id="hpLeft" style="width: 30%; float: left; border-right: 5px;"/>' +
						'<div id="hpCenter" style="width: 40%; float: left; text-align: center;">' +
							'<div id="hpCenterHead" class="gfg-title" style="display: block; width: 100%; text-align: center; hight: 20px"></div>'+
							'<div id="hpCenterBody" style="display: block; width: 100%;"/>' +
						'</div>' +
						'<div id="hpRight" style="width: 30%; float: right; border-left: 5px;">' +
							'<div id="hpRightHead" class="gfg-title" style="display: block; width: 100%; text-align: center; hight: 20px"></div>'+
							'<div id="hpRightBody" style="display: block; width: 100%;"/>' +
						'</div>' +
					'</div>' +
				'</div>';
	var insert = new JuiceInsert(html,"#pageContent","append");
	insert.show();
	var googleOptions = {
	   numResults : 10
	 }

//	 new GoogleRSSFeedJuice(juice,insert,"hpRight", "http://blogs.talis.com/panlibus/feed", googleOptions);
//   new GoogleRSSFeedJuice(juice,insert,"hpRight", "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/front_page/rss.xml", googleOptions);

//	insertSocial();
	
	 new GoogleRSSFeedJuice(juice,insert,"hpLeft", "http://www.birminghampost.net/news/west-midlands-news/rss.xml", googleOptions);
//	 new GoogleRSSFeedJuice(juice,insert,"hpLeft", "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/front_page/rss.xml", googleOptions);
	if(whichPrism == "sandbox-ac"){
/*		$jq('#hpCenterHead').append("Opening Hours");
		insertHours();
*/
var carouselOpts1 = {
	height : "370px",
	width : "960px",
	feedUrl: "http://juice-project.s3.amazonaws.com/examples/talis-prism/sandbox-ac-carousel.atom"
};
new Carousel3DJuice(juice,insert,"hpTop",carouselOpts1);

$jq('#hpRightHead').append("Library Tweets");
var ops = {
	height : "280px",
	width : "280px",
	showAvatar : true,
	showId : true,
	showLink : true,
	count: 3
};
new TwitterFeedJuice(juice,insert,"hpRightBody","from: rjw",ops);
		$jq('#hpCenterHead').append("Library Locations");
		var mapOps1 = {
			height : "280px",
			width : "280px",
			defaultZoom : 12,
			defaultCenter : {lt: 51.481436,lg: -0.085402},
//			points : libraryLocations
			points : bhamlocs
		};
	 	new GoogleMapJuice(juice,insert,"hpCenterBody",mapOps1);

/*		$jq('#hpCenterHead').append("Library Tweets");
		var ops = {
			height : "280px",
			width : "350px",
			showAvatar : true,
			showId : true,
			showLink : true,
			count: 3
		};
		new TwitterFeedJuice(juice,insert,"hpCenterBody","from: rjw",ops);
*/

	}else{
		//sandbox-Gov
		$jq('#hpCenterHead').append("Library Locations");
		var mapOps = {
			height : "280px",
			width : "350px",
			defaultZoom : 12,
			defaultCenter : {lt: 51.481436,lg: -0.085402},
//			points : libraryLocations
			points : bhamlocs
		};
	 	new GoogleMapJuice(juice,insert,"hpCenterBody",mapOps);
//		$jq("#hpTop").append('<div class="gfg-title" style="display: block; width: 100%; text-align: center; hight: 20px">New Additons to stock</div>');
		var carouselOpts = {
			height : "270px",
			width : "960px",
			feedUrl: "http://juice-project.s3.amazonaws.com/examples/talis-prism/sandbox-ac-carousel.atom"
		}
		insertHours();
	 	new Carousel3DJuice(juice,insert,"hpTop",carouselOpts);
//	 	new BookListFromFeed(juice,insert,"hpTop",carouselOpts);
	}

}

function insertHours(){
	$jq('#hpRightHead').append("Opening Hours");
	
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
var insert = new JuiceInsert(hours,"#hpRightBody","append");
insert.show();
}

function insertSocial(){
	var head = '<div id="hpRightHead" class="gfg-title" style="display: block; width: 100%; text-align: center; hight: 20px">Follow the Library</div>';
	$jq('#hpRight').append(head);
	$jq('#hpRight').append('<a href="http://www.facebook.com/search/?q=birmingham+library&init=quick#/group.php?gid=6930638274&ref=search&sid=567241154.1198614156..1"><img width="285" border="1" src="http://juice-project.s3.amazonaws.com/examples/talis-prism/images/facebook.jpg"/></a>');
	$jq('#hpRight').append('<a href="http://twitter.com/thisisbrum"><img width="285" border="1" src="http://juice-project.s3.amazonaws.com/examples/talis-prism/images/Twitter-11.png"/></a>');
	$jq('#hpRight').append('<img width="285" border="1" src="http://juice-project.s3.amazonaws.com/examples/talis-prism/images/bebo.png"/>');
	
}





