module("juice.scriptloading");

test("test script loading", function(){
	stop();
	juice.loadJs('../extensions/delicious.js','', function(){
													equals(typeof deliciousJuice, 'function', 'There should be a delicious extension');
													start();
													});
});



test("runscript", function(){
	stop();
	juice.runscript('testrunscript', '../extensions/extendedbyjuice.js');
	var oncomplete=function(){
							equals(typeof extendedbyJuice, 'function', 'There should be an extendbyjuice extension');
							start();
							}
	setTimeout(oncomplete, 40);	
	

});

test("test multi script loading", function(){
	stop();
	juice.loadExtensions('AspireList', 'copac');
	var oncomplete2=function(){
						equals(typeof AspireListJuice, 'function', 'There should be an aspire list extension');
						equals(typeof copacJuice, 'function', 'There should be an copac extension');
						start();
						};
	setTimeout(oncomplete2, 40);
						

});
