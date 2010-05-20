function talis_prism_metadef(){
	juice.findMeta("isbns",".item > #details .table .ISBN",juice.stringToAlphnumAray);
	juice.findMeta("isbn",".item > #details .table .ISBN");
	juice.findMeta("author",".item > .summary .author > .author");
	juice.findMeta("title",".item > .summary > .title");
	juice.findMeta("shelfmark","#availability > table > tbody > tr > td:nth-child(3)",null);
	juice.findMeta("location","#availability > table > tbody > tr > td:nth-child(2)",null);

	juice.findMeta("workids",".item > .summary > .title > a","href",talis_prism_items_workids);
	juice.setMeta("workid",talis_prism_item_workid);
	
//	juice.debugMeta();
}

function talis_prism_item_workid(){
	var locationBits = document.location.pathname.split('/');
	if(locationBits[locationBits.length - 2] == "items"){
		return locationBits[locationBits.length - 1];
	}
	return null;
}

function talis_prism_items_workids(val,id){
	if(val){
		var path = val.split('/');
		if(path && path[0] == "items"){
			var id = path[1].split("?");
			return id[0];
		}
		
	}
}