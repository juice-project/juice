module("juice.scriptloading");



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

test("test script loading", function(){
	stop();
	juice.loadJs('../extensions/delicious.js','', function(){
													
													equal(typeof deliciousJuice, 'function', 'There should be a delicious extension');
													
													start();
													});
});
