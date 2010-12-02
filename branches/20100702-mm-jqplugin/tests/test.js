/**
 * Test suite for automatic testing with Rhino. For launching 
 * the test suite in a browser, open index.html instead.
*/

// init simulated browser environment

Packages.org.mozilla.javascript.Context.getCurrentContext().setOptimizationLevel(-1);

load("build/env-js/env.rhino.js");

window.onload = function(){

    // Load jquery, juice and the test runner
    load("jquery-1.4.4.js");
    load("juice.js");
    load("tests/qunit/testrunner.js");
        
    QUnit.init();
    QUnit.config.blocking = false;
    QUnit.config.autorun = true;
    QUnit.config.updateRate = 0;
    
    var count = 0, module;
    // track test modules so we can include them in logs
    QUnit.moduleStart = function(name, settings) {
        module = name;
    };
    // hookinto QUnit log so we can log test results 
    QUnit.log = function(result, message, raw){
        console.log(
             '{%s}(%s)[%s] %s ',
             module, 
             count++, 
             result ? 'PASS' : 'FAIL', 
             raw.message
        );
    };
    QUnit.done = function(fail, pass){
        console.log('PASSED: %s FAILED: %s', pass, fail);
    };
    
    
    // Load the tests
    load(
        "tests/unit/demo.js",
        "tests/unit/juice-core-tests.js",
        "tests/unit/juice-meta-tests.js",
        "tests/unit/loading.js"
    );
    
};




// load HTML page
window.location = "tests/index.html";
