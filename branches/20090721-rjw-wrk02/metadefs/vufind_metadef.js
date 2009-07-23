function vufind_metadef(){
	juice.findMeta("isbns",".Z3988","title",vufind_scrapez3988); 
	juice.findMeta("author",".Z3988","title",vufind_scrapez3988); 
	juice.findMeta("title",".Z3988","title",vufind_scrapez3988); 
//	juice.debugMeta();
}

function vufind_scrapez3988(val,meta){
	var value = null;
	switch(meta){
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
