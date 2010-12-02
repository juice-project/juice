/**
 * @author nadeemshabir
 */
module("juice.core");

test("test the debug function", function(){
    expect(4);

    var msg1 = "some test debug";    
    var msg2 = "another debug message";


    juice.setDebug(true);
    juice.debugOutln(msg1);
    
    // check to see if the div has been injected into the dom
    equals( $("#JuiceDebug").length, 1, "Debug div should have been injected into the dom");

    // check to see that the message is the one we set
    var actualMsg = $("#JuiceDebug").text();
    equals(actualMsg, msg1, "debug message '" + msg1 + "'" );
    
    // additional debug is appended to the same div
    juice.debugOutln(msg2);
    //juice.debugOutln("");
    actualMsg = $("#JuiceDebug").text();

    equals( $("#JuiceDebug").length, 1, "There should still only be one JuiceDebug div in the dom");
    equals(actualMsg, msg1+msg2, "debug message '" + msg1+msg2 + "'" );
    
});

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
	setTimeout(function(){
							equals(typeof extendedbyJuice, 'function', 'There should be an extendbyjuice extension');
							start();
							}, 40);	
	

});

test("test multi script loading", function(){
	stop();
	juice.loadExtensions('AspireList', 'copac');
	setTimeout(function(){
						equals(typeof AspireListJuice, 'function', 'There should be an aspire list extension');
						equals(typeof copacJuice, 'function', 'There should be an copac extension');
						
						start();
						}, 40);
						

});
