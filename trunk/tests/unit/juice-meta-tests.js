/**
 * @author jakobvoss
 */
module("juice.juicemeta");

test("test Meta definitions", function(){

    // add raw set definitions

	juice.setMeta("s1","setting_1");
	juice.setMeta("s2",function(){return "fsetting_2"});
	juice.setMeta("s3","setting_3");
	juice.deleteMeta("s3");
	
	juice.setMeta("s4","setting_4");
	juice.setMeta("s4","resetting_4");
	juice.setMeta("s5",5);
	juice.setMeta("s6",["6-left","6-right"]);
	juice.setMeta("s7",function(){return null;});
	juice.setMeta("s8",function(){return ["8-left","8-right"];});
	juice.setMeta("s9",function(id){return "Set by: "+id;});

	// add find with jQuery definitions 
    // .a does not exist so this should all return null
    juice.findMeta("a",".a");
    juice.findMeta("a@",".a","value");
    juice.findMeta("a_f",".a",function(){return;});
    juice.findMeta("a@f",".a","value",function(){});
    juice.findMeta("a+",".a",function(){return "something"}); // sic!

    // the empty string
    juice.findMeta("b",".b"); // content
    juice.findMeta("b@",".b","value"); // attribute

    // filtered out by filter function => null
    juice.findMeta("b_f",".b",function(){});
    juice.findMeta("b@f",".b","value",function(){});

    // attribute does not exist => null
    juice.findMeta("b2@",".b2","value");
    juice.findMeta("b2@f",".b2","value",function(){});
    juice.findMeta("b2@f+",".b2","value",function(){return "something"});

    // content and attribute (single value)
    juice.findMeta("c",".c");
    juice.findMeta("c@",".c","value");
    juice.findMeta("cf",".c",function(val,id){return "id: "+id+" found '"+val+"'";});

    // filtered out by filter function => null
    juice.findMeta("c_f",".c",function(){});
    juice.findMeta("c@f",".c","value",function(){});

    // content and attribute (multiple values)
    juice.findMeta("d",".d");
    juice.findMeta("d@",".d","value");

    // filtered out by filter function => null
    juice.findMeta("d_f",".d",function(){});
    juice.findMeta("d@f",".d","value",function(){});

    // complex content
    juice.findMeta("e",".e");

    //whitespace issues

    juice.findMeta("n_f_g", ".f .g", $.juice.stringToAlphnumArray);

    var is_unset = [
		"s3","s7",
        "a", "a@", "a_f", "a@f", "a+", // .a does not exist
        "b_f","b@f","b2@","b2@f","b2@f+",
        "c_f","c@f","d_f","d@f"
    ];

    var is_set = {
		"s1":"setting_1",
		"s2":"fsetting_2",
		"s4":"resetting_4",
		"s5":5,
        "s6":["6-left","6-right"],
        "s8":["8-left","8-right"],
		"s9":"Set by: s9",
        "b":"", "b@":"",
        "c":"Hello",
        "c@":"Hello",
        "cf":"id: cf found 'Hello'",
        "d":["","Hello"],
        "d@":["","Hello"],
        "e":"content  test",
        "n_f_g":["1234","5678"]
    };


    expect(53);

    for(var i=0; i<is_unset.length; i++) {
        ok( !juice.hasMeta(is_unset[i]), "meta not set: " + is_unset[i] );
    }

    for (var meta in is_set) {
        ok( juice.hasMeta(meta), "hasMeta: " + meta );
        var value = is_set[meta];
        if (typeof(value) == "object" && value.length) {
            for(var i=0; i<value.length; i++) {
                equals( juice.getMeta(meta, i), value[i], "meta has right value: " + meta + "[" + i + "]");
            }
        } else {
            equals( juice.getMeta(meta), value, "meta has right value: " + meta );
        }
    }

});
