$(document).ready(function () {
	juice.setDebug(false);
	juice.loadJs("http://talis-juice-live.s3.amazonaws.com/extensions/GoogleAnalytics.js");
	juice.onJsLoaded(runExtensions);
});

function runExtensions(){
	var procGas = new gasJuice(juice,"UA-2411194-16");
}
