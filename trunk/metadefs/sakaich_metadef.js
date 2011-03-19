function sakaich_metadef() {
	var isbns = new(Array);
	var primo_ids = new(Array);
	var coins = new(Array);
	$jq('span.Z3988').each(function() {
		coin = $jq(this).attr('title');
		coins.push(coin);
		bib_item = z3988_parse(coin);
		isbns.push(unescape(bib_item["rft.isbn"]));
		bib_id = bib_item["rft_id"];
		// This extension originally designed to work with OpenURLs containing IDs from the Primo discovery service by Ex Libris
		// This assumes that Primo IDs contain a specific string
		// Not a brilliant way of doing this
		// We need to ensure one and only one id per item (think about an array of rft_id, filter for primo_library, pick first entry if multiple match)
		if (bib_id && bib_id.search(/primo_library/) > 0) {
			primo_ids.push(bib_id);
		} else {
			// Add an empty ID for those without a Primo ID
			primo_ids.push("");
		}
	})
	juice.setMeta("image_isbns",isbns);
	juice.setMeta("primo_ids",primo_ids);
	juice.setMeta("coins",coins);
	//juice.debugMeta();
}

function z3988_parse(coin) {
	var openurl_elements = new(Array);
	var key_value = new(Array);
	openurl_elements = coin.split('&');
	var bib_item = new Object;
	for(i=0;i<openurl_elements.length;i++) {
		key_value = openurl_elements[i].split('=');
		bib_item[key_value[0]] = key_value[1];
	}
	
	return bib_item;

}