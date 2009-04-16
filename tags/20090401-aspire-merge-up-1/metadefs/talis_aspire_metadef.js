function talis_aspire_metadef(){
	juice.addMeta(new JuiceMeta("isbns","#isbn10 > .fieldValue, #isbn13 > .fieldValue ",juice.stringToAlphnumAray));
	juice.addMeta(new JuiceMeta("author","#authors > .fieldValue ")); 
	juice.addMeta(new JuiceMeta("title","#itemDetailsContainer > h1 ")); 
}