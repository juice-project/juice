function talis_prism_metadef(){
	juice.addMeta(new JuiceMeta("isbn","#AreilXMeta > #isbn"));
	juice.addMeta(new JuiceMeta("isbns","#AreilXMeta > #isbn",juice.stringToAlphnumAray));
	juice.addMeta(new JuiceMeta("author","#AreilXMeta > #author"));
	juice.addMeta(new JuiceMeta("title","#AreilXMeta > #title"));
	juice.addMeta(new JuiceMeta("shelfmark","#availability > table > tbody > tr > td:nth-child(3)",null));
}