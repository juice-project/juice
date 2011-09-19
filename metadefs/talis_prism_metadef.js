function talis_prism_metadef(){
        $jq.juice.findMeta("isbns",".item #details .ISBN",$jq.juice.stringToAlphnumAray);
        $jq.juice.findMeta("isbn",".item #details .ISBN");
        $jq.juice.findMeta("author",".item .summary .author .author");
        $jq.juice.findMeta("title",".item .summary .title");
        
        $jq.juice.findMeta("shelfmark","#availability .options table td:nth-child(2)");             
        $jq.juice.setMeta("location", shelf_location_mapper("#availability .options table td:nth-child(2)"));
        $jq.juice.findMeta("workids",".item .summary > .title > a","href",talis_prism_items_workids);
        $jq.juice.setMeta("workid",talis_prism_item_workid);

//		juice.debugMeta();
}


//maps shelves and locations to match
function shelf_location_mapper(sel){
        var ret=[];
	    $jq(sel).each(function(i, el){
                ret[ret.length]=$jq(el).parents('li').find('h3 span').text();
        });
        return ret;
}

function talis_prism_item_workid(){
        var locationBits = document.location.pathname.split('/');
        if(locationBits[locationBits.length - 2] == "items"){
                return locationBits[locationBits.length - 1];
        }
        return null;
}

function talis_prism_items_workids(val,id){
        if(val){
                var path = val.split('/');
                if(path && path[0] == "items"){
                        var id = path[1].split("?");
                        return id[0];
                }
                
        }
}

//call for de-deduping an array of items

function talis_prism_dedup(a) {
        var i, r=[], o={};
        if(jQuery.isArray(a)){
                for (i=0;i<a.length;i++) {
                        if (!o[a[i]]){
                        o[a[i]]={};
                        r.push(a[i]);
                        }
                }
        }
        return r;
}
