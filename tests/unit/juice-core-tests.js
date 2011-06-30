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

test("Check aliases", function(){
	equals(typeof $.juice,'object');
	equals(typeof jQuery.juice, 'object');
	equals($.juice.insert,jQuery.juice.insert);
});

