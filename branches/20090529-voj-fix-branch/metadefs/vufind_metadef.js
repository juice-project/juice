function vufind_metadef(){
	juice.addMeta(new JuiceMeta("isbns",".Z3988","title",vufind_scrapez3988)); 
	juice.addMeta(new JuiceMeta("author",".Z3988","title",vufind_scrapez3988)); 
	juice.addMeta(new JuiceMeta("title",".Z3988","title",vufind_scrapez3988)); 
//	juice.debugMeta();
}

function vufind_scrapez3988(val,meta){
	var value = null;
	var id = meta.getId();
	switch(id){
		case "isbn":
		case "isbns":
			value = getFromParam(val,"rft.isbn");
			break;
		case "author":
			value = getFromParam(val,"rft.au");
			break;
		case "title":
			value = getFromParam(val,"rft.title");
			break;
		default:
			break;
		
	}
	return juice.stringToAlphnumAray(unescape(value));
}

function getFromParam(string,name){
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( string );
	  
	if( results == null )
	    return "";
	 else
	    return results[1];
}
