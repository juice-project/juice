function talis_prism_metadef(){
	juice.findMeta("isbns",".item > #details .table .ISBN",juice.stringToAlphnumAray);
	juice.findMeta("isbn",".item > #details .table .ISBN");
	juice.findMeta("author",".item > .summary .author > .author");
	juice.findMeta("title",".item > .summary > .title");
	juice.findMeta("shelfmark","#availability > table > tbody > tr > td:nth-child(3)",null);
	juice.findMeta("location","#availability > table > tbody > tr > td:nth-child(2)",null);
}