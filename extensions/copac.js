//copac.js
//Extension to launch search of copac.ac.uk based on meta value of 'ISBN'.
//Note: copac search only accepts a single ISBN

//Note: This version of the extension

//Constructor arguments:
//arg: src - url to logo to display in selection panel
//arg: text - text to display in selection panel
//arg: target - selector to append this link to

function copacJuice(target, src,text){

    text=text || "Search on Copac";

    if(juice.hasMeta("isbns")){
        var isbns = juice.getMeta("isbns");
        var selString = isbns[0];
        var url = "http://copac.ac.uk/wzgw?form=A%2FT&id=&au=&ti=&pub=&sub=&any=&fs=Search&date=&plp=&isn=" + escape(selString);

        var html = '<a href="'+url+'" class="copacLink"><img src="'+src+'" alt="'+text+'" title="'+text+'"></a>';
        var link=$(html);

        $(target).append(link);

    }

}



