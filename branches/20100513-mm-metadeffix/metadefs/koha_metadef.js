function koha_metadef(){
	juice.findMeta("isbns",".unapi-id","title",koha_scrapeunapi); 
	juice.findMeta("author",".author  a"); 
	juice.findMeta("title","#catalogue_detail_biblio  h1"); 
//	juice.debugMeta();
}

function koha_scrapeunapi(val,meta){
	var value = null;
	switch(meta){
		case "isbn":
		case "isbns":
			value = getFromParam(val,"koha:isbn");
//			juice.debugOutln("ISBN: "+val);
			break;
		default:
			break;
		
	}
	return juice.stringToAlphnumAray(unescape(value));
}

function getFromParam(string,name){
	var regexS = name+":([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( string );
	  
	if( results == null )
	    return "";
	 else
	    return results[1];
}
