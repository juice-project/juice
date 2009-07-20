function talis_prism_metadef(){
	juice.addMeta(new JuiceMeta("isbns",".item > #details .table .ISBN",juice.stringToAlphnumAray));
	juice.addMeta(new JuiceMeta("isbn",".item > #details .table .ISBN"));
	juice.addMeta(new JuiceMeta("author",".item > .summary .author > .author"));
	juice.addMeta(new JuiceMeta("title",".item > .summary > .title"));
	juice.addMeta(new JuiceMeta("shelfmark","#availability > table > tbody > tr > td:nth-child(3)",null));
	juice.addMeta(new JuiceMeta("location","#availability > table > tbody > tr > td:nth-child(2)",null));
}