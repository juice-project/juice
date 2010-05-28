//example_extend.js
//Example localised Juice extention file
//Replace all references to {mySite} with url to where Juice is hosted for your site and uncomment lines.
jQuery(document).ready(function () {
	juice.setDebug(false);
//	juice.loadCss("http://{mySite}/js/juiceDefault.css");
//	juice.loadJs("http://{mySite}/js/juiceOverlay-0.3.js");
//	juice.loadCss("http://{mySite}/juiceOverlay.css");
	
	
//	juice.loadJs("http://{mySite}/js/extensions/extendedbyJuice.js");
//	juice.loadJs("http://{mySite}/js/extensions/GoogleAnalytics.js");
	juice.onAllLoaded(runExtensions);
});

function runExtensions(){
	
//	new extendedbyJuice(juice);
	// Replace UA-XXXXXXX-XX with your Google Analytics ID(s) - comma separated if there is more than one
//	new gasJuice(juice,"UA-XXXXXXX-XX");
	
}

