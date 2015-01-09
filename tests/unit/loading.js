module("juice.scriptloading");

test("Get juice path", function(){

});

test("test multi script loading", function(){
	
	stop(600);
	expect(2);
	juice.loadExtensions('AspireList', 'copac');
	setTimeout(function(){
						
						equal(typeof AspireListJuice, 'function', 'There should be an aspire list extension');
						equal(typeof copacJuice, 'function', 'There should be a copac extension');
						start();
						}, 500);
						

});

test("test Google API loader", function(){
	stop();
	juice.loadGoogle_jsapi();
	setTimeout(function(){
							equal(typeof window.google, 'object', 'Google API should load');
							start();
							}, 500);

});

test("test script loading", function(){
	stop();
	juice.loadJs('../extensions/delicious.js','', function(){
													
													equal(typeof deliciousJuice, 'function', 'There should be a delicious extension');
													
													start();
													});
});

test("test loading of google apis", function(){
	stop();
	juice.loadGoogleApi("feeds", "1");
	setTimeout(function(){
							equal(typeof google.feeds, 'object', 'There should be a feeds api loaded');
							start();
							}, 500);
});


