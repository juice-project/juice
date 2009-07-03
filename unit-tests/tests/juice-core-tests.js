/**
 * @author nadeemshabir
 */
module("juice.core");

test("test the debug function", function(){
	expect(4);
	var expectedMsg = "some test debug";	
	jQuery(document).ready(function () {
	  juice.setDebug(true);
	  juice.debugOutln(expectedMsg);
	});
	
	// check to see if the div has been injected into the dom
	equals( $("#JuiceDebug").length, 1, "Debug div should have been injected into the dom");
	// check to see that the message is the one we set
	var actualMsg = $("#JuiceDebug").text();
	equals(actualMsg, expectedMsg, "expecting " + expectedMsg + " to be outputted in debug window" );
	
	// additional debug is appended to the same div
	var anotherMsg = " hello world"
	juice.debugOutln(anotherMsg);
	actualMsg = $("#JuiceDebug").text();
	equals( $("#JuiceDebug").length, 1, "There should still only be one JuiceDebug div in the dom");
	equals(actualMsg, expectedMsg+anotherMsg, "expecting " + expectedMsg+anotherMsg + " to be outputted in debug window" );
});
