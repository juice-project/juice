/**
 * Test suite for automatic testing with Rhino. For launching 
 * the test suite in a browser, open index.html instead.
*/

// init simulated browser environment
load("build/env-js/env.rhino.js");

window.onload = function(){

    // Load jquery, juice and the test runner
    load("jquery-1.3.2.js");
    load("juice-0.4.js");
    load("build/env-js/testrunner.js");

    //var start = new Date().getTime();

    // Load the tests
    load(
        "test/unit/demo.js",
        "test/unit/juice-core-tests.js"
    );
 
    //var end = new Date().getTime();

    // Display the results
    results();

    //print("\n\nTOTAL TIME : " + (end - start)/1000 + " SECONDS");
};


// load HTML page
window.location = "test/index.html";
