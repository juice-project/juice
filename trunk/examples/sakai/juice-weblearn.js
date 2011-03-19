// Readme
// 
// 1. This has been tested with Juice 0.6.4
// 2. Download juice-basic-0.6.4.zip from http://code.google.com/p/juice-project/downloads/list
// 3. Unzip juice-basic-0.6.4.zip into an appropriate web accessible directory on the server where you wish to deploy Juice. For the purposes of this guide, it is assumed the directory is called 'juice'
// 4. Add the file sakaich_metadef.js to /juice/metadefs
// 5. Add the file daiaAvailability.js to /juice/extensions
// 6. Add the file juice-weblearn.js to /juice
// 7. In the webpage(s) where you wish to deploy the juice extension add the following lines before the closing </body> tag:
// 		<script type="text/javascript" src="juice/jquery-1.3.2.min.js"></script>
// 		<script type="text/javascript">
// 		jQuery.noConflict();
// 		</script>
// 		<script type="text/javascript" src="juice/juice.js"></script>
// 		<script type="text/javascript" src="juice/juice-weblearn.js"></script>
// 		
// 8. You will need to edit the paths to the /juice directory in these lines and also in juice-weblearn.js if your webpage is not in a directory containing the /juice directory
// 9. Other variables set in juice-weblearn.js can be edited as desired - including:
// 	availServer = the URL of the DAIA compliant availability service for print items
// 	eavailServer = the URL of the DAIA compliant availability service for electronic items

jQuery.noConflict();

jQuery(document).ready(function () {
	// Assumes that the page calling this file is in a directory also containing the juice folder
	// Can be moved to whereever you want, just correct the paths
	juice.setDebug(false);
	juice.loadJs("./juice/metadefs/sakaich_metadef.js");
	juice.loadJs("./juice/extensions/extendedbyJuice.js");	
	juice.loadJs("./juice/extensions/daiaAvailability.js");
	juice.loadCss("./juice/panels/juiceDefault.css");	
	juice.onAllLoaded(runExtensions);
});

function runExtensions(){
	var expandIcon = "https://yourdomain.com/expand.gif";
	var collapseIcon = "https://yourdomain.com/collapse.gif";
	sakaich_metadef();
	if(juice.hasMeta()){
		// Original implementation used IDs derived from the Primo discovery service by Ex Libris
		// Other IDs can be used - see below for use of OpenURL as an ID
		if(juice.hasMeta("primo_ids")){
			
			// ****************	
			// Get Print Availability
			// ****************
			
			var availServer = "http://yourdomain.com/library-availability/print"; // DAIA server for print availability
			var availabilityDiv = '<div id="availability"></div>';
			var insert_avail = new JuiceInsert(availabilityDiv,"span.Z3988","after");
			
			// call daiaAvailability
			/*
			 * Constructor arguments:
			 * arg: ju - instance of juice
			 * arg: insert - JuiceInsert to use
			 * arg: targetDiv - id of element to place image in
			 * arg: availIDs - Juice Meta element containing array of IDs for DAIA requests
			 * arg: availServer - url of availability server
			 * arg: availType - set to 'online' to treat all availability as online, otherwise will treat DAIA response generically
			 * arg: format - format to return DAIA results [json only format currently supported]
			 * arg: noLines - number of availability lines to display unhidden. 
			 *                Remaining lines will be hidden and 'show' button added.
			 *                Any 'open access' availability will be shown whatever this value
			 *                Ignored when availType == 'online'
			 * arg: toggleExpand - URL of image to be used for the toggleAvailability 'expand' function where some results are hidden. Not used when availType == 'online'
			 * arg: toggleCollapse - URL of image to be used for the toggleAvailability 'collapse' function where some results are hidden. Not used when availType == 'online'
			 */
			
			new daiaAvailability(juice,insert_avail,"availability","primo_ids",availServer,"print","jsonp",1,expandIcon,collapseIcon);
		}
		if(juice.hasMeta("coins")) {
			// ****************	
			// Get Electronic Availability
			// ****************

			// Create new Juice Meta that contains OpenURLs rather than just COINS 
			// This is so we can use a proper http URI for DAIA request

			var base_url = "http://openurl.yourdomain.com";
			openurls = new(Array);
			var coins = juice.getMetaValues("coins");
			for (var i = 0; i < coins.length; i++){
				openurls.push(base_url + coins[i]);
			};
			juice.setMeta("openurls",openurls);

			var eavailServer = "http://yourdomain.com/library-availability/electronic"; // DAIA server for electronic availability
			var eavailabilityDiv = '<div id="e-availability"></div>';
			var insert_eavail = new JuiceInsert(eavailabilityDiv,"span.Z3988","after");
			
			// call daiaAvailability
			/*
			 * Constructor arguments:
			 * arg: ju - instance of juice
			 * arg: insert - JuiceInsert to use
			 * arg: targetDiv - id of element to place image in
			 * arg: availIDs - Juice Meta element containing array of IDs for DAIA requests
			 * arg: availServer - url of availability server
			 * arg: availType - set to 'online' to treat all availability as online, otherwise will treat DAIA response generically
			 * arg: format - format to return DAIA results [json only format currently supported]
			 * arg: noLines - number of availability lines to display unhidden. 
			 *                Remaining lines will be hidden and 'show' button added.
			 *                Any 'open access' availability will be shown whatever this value
			 *                Ignored when availType == 'online'
			 * arg: toggleExpand - URL of image to be used for the toggleAvailability 'expand' function where some results are hidden. Not used when availType == 'online'
			 * arg: toggleCollapse - URL of image to be used for the toggleAvailability 'collapse' function where some results are hidden. Not used when availType == 'online'
			 */
			
			new daiaAvailability(juice,insert_eavail,"online-availability","openurls",eavailServer,"online","jsonp",0,expandIcon,collapseIcon);
		}

		// ****************	
		// Put footer in
		// ****************

		doCreatedBy();
		
		
	}
}

function doCreatedBy(){
	new extendedbyJuice(juice);
} 