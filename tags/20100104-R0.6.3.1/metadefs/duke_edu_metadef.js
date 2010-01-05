function duke_edu_metadef(){
	juice.findMeta("isbn","li:has(> em:contains('ISBN:'))");
	juice.findMeta("isbns","li:has(> em:contains('ISBN:'))",juice.stringToAlphnumAray);
	juice.findMeta("author","[title*='Perform a search for the author']");
	juice.findMeta("title",".resourcedetails > h1");
}