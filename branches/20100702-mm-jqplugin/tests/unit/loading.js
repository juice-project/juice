module("juice.scriptloading");

test("test script loading", function(){
	expect(1);
	stop(1000);
	juice.loadJs('../extensions/delicious.js','', function(){
													equals(typeof deliciousJuice, 'function', 'There should be a delicious extension');
													start();
													});
});

test("test multi script loading", function(){
	expect(2);
	stop();
	juice.loadExtensions('AspireList', 'copac');
	setTimeout(function(){
						equals(typeof AspireListJuice, 'function', 'There should be an aspire list extension');
						equals(typeof copacJuice, 'function', 'There should be a copac extension');
						
						start();
						}, 400);
						

});
