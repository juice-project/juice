function talis_aspire_metadef(){
	juice.findMeta("isbns","#isbn10 > .fieldValue, #isbn13 > .fieldValue ",juice.stringToAlphnumAray);
	juice.findMeta("author","#authors > .fieldValue "); 
	juice.findMeta("title","#itemDetailsContainer > h1 "); 
}