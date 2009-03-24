function duke_edu_metadef(){
	juice.addMeta(new JuiceMeta("isbn","li:has(> em:contains('ISBN:'))"));
	juice.addMeta(new JuiceMeta("isbns","li:has(> em:contains('ISBN:'))",juice.stringToAlphnumAray));
	juice.addMeta(new JuiceMeta("author","[title*='Perform a search for the author']"));
	juice.addMeta(new JuiceMeta("title",".resourcedetails > h1"));
}