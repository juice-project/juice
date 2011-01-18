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
    QUnit.testStart = function(name, settings) {
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
        //if in Rhino exit and fail
        if(java!=undefined && !result){
         java.lang.System.exit(1);
        }
    };
    QUnit.done = function(fail, total){
        console.log('TOTAL: %s FAILED: %s', total, fail);
     
    };
    
    
    // Load the tests    
    load(
        "tests/unit/demo.js",
        "tests/unit/juice-core-tests.js",
        "tests/unit/juice-meta-tests.js");
        
    //if we're in a browser load the remote laoding tests    
    if(java==undefined){
   		 load("tests/unit/loading.js");
    }
    else{
    	console.log('***Remember to run the tests in browser to handle remote loading tests***');
    }
	
    
};




// load HTML page
window.location = "tests/index.html";
