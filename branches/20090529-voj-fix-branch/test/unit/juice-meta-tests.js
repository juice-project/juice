/**
 * @author jakobvoss
 */
module("juice.juicemeta");

test("test JuiceMeta definitions", function(){

    // add definitions
/*
    <!-- string attribute/content -->
    <div class="c" value="Hello" style="display:none">Hello</div>
    <!-- some with content, some empty -->
    <div class="d" value=""></div>
    <div class="d" value="Hello" style="display:none">Hello</div>
    <!-- complex content -->
    <div class="e" style="display:none">content <span>this not</span></div>
  </div>
*/
    // .a does not exist so this should all return null
    juice.addMeta(new JuiceMeta("a",".a"));
    juice.addMeta(new JuiceMeta("a@",".a","value"));
    juice.addMeta(new JuiceMeta("a_f",".a",function(){return;}));
    juice.addMeta(new JuiceMeta("a@f",".a","value",function(){}));
    juice.addMeta(new JuiceMeta("a+",".a",function(){return "something"})); // sic!

    // the empty string
    juice.addMeta(new JuiceMeta("b",".b")); // content
    juice.addMeta(new JuiceMeta("b@",".b","value")); // attribute

    // filtered out by filter function => null
    juice.addMeta(new JuiceMeta("b_f",".b",function(){}));
    juice.addMeta(new JuiceMeta("b@f",".b","value",function(){}));

    // attribute does not exist => null
    juice.addMeta(new JuiceMeta("b2@",".b2","value"));
    juice.addMeta(new JuiceMeta("b2@f",".b2","value",function(){}));
    juice.addMeta(new JuiceMeta("b2@f+",".b2","value",function(){return "something"}));

    // content and attribute (single value)
    juice.addMeta(new JuiceMeta("c",".c"));
    juice.addMeta(new JuiceMeta("c@",".c","value"));

    // filtered out by filter function => null
    juice.addMeta(new JuiceMeta("c_f",".c",function(){}));
    juice.addMeta(new JuiceMeta("c@f",".c","value",function(){}));

    // content and attribute (multiple values)
    juice.addMeta(new JuiceMeta("d",".d"));
    juice.addMeta(new JuiceMeta("d@",".d","value"));

    // filtered out by filter function => null
    juice.addMeta(new JuiceMeta("d_f",".d",function(){}));
    juice.addMeta(new JuiceMeta("d@f",".d","value",function(){}));

    juice.addMeta(new JuiceMeta("e",".e"));

    var is_unset = [
        "a", "a@", "a_f", "a@f", "a+", // .a does not exist
        "b_f","b@f","b2@","b2@f","b2@f+",
        "c_f","c@f","d_f","d@f"
    ];

    var is_set = {
        "b":"", "b@":"",
        "c":"Hello",
        "c@":"Hello",
        "d":["","Hello"],
        "d@":["","Hello"],
        "e":"content",
    };

    expect(is_unset.length + is_set.length*2 + 2);

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
