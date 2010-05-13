function talis_prism2_metadef(){
        juice.findMeta("isbns","td:has(span:contains('ISBN')) + td>font>span",juice.stringToAlphnumAray);
        juice.findMeta("author","td:has(span:contains('Author')) + td>font>span");
        juice.findMeta("title","td:has(span:contains('Title')) + td>font>span");
}
