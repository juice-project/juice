$jq(document).ready(function () {
	juice.setDebug(false);
	juice.loadJs("http://juice-project.s3.amazonaws.com/extensions/GoogleAnalytics.js");
	juice.onJsLoaded(runExtensions);
});

function runExtensions(){
	var procGas = new gasJuice(juice);
}
