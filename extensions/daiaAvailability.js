// daiaAvailability.js
// -------------------
// Version: 1.0
// Author: Owen Stephens
// Last Edit: 15/03/2011

// Displays availability from DAIA compliant information

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

//***************************
//******** Notes ************
//***************************
 

// 1. Links to online versions
// Includes a special case for 'online' availability. This is triggered by specifying 'online' in availType 
// This is to cope with an issue with DAIA where the 'loan' and 'presentation' services can have a URL whether print or electronic
// (e.g. URL may be link to reservation service for print, or to full-text online for electronic)
// In the original implementation of this juice extension (Oxford University) a separate DAIA service was defined that only returned electronic availability
// The special case handling enables clearer information to be passed to the UX in this case
// However, the extension will handle all DAIA responses without this special case, it simply won't be as clear what the URL links to
 
function daiaAvailability(ju,insert, targetDiv, availIDs, availServer, availType, format, noLines, toggleExpand, toggleCollapse){
	// Initialise extension
	id = "daiaAvailability";
    this.targetDiv = targetDiv;
	this.availIDs = availIDs; // Which IDs from the MetaValues to pass to the DAIA availability service
    this.availServer = availServer; // URL of the DAIA compliant availability service
    this.format = format; // Currently only supports JSONP
	this.availType = availType; // Whether this query is specifically for online availability
    this.noLines = noLines; // For general availability, how many lines to show by default (the rest will be hidden with a toggle)
	this.expandIcon = toggleExpand; // For general availability allows for a local image to be specified for the toggleAvailability 'expand' function
	this.collapseIcon = toggleCollapse; // For general availability allows for a local image to be specified for the toggleAvailability 'collapse' function

	initFunc = this.start;
	if(arguments.length){
		daiaAvailability.superclass.init.call(this,id,initFunc,null,insert,ju);
		daiaAvailability.superclass.startup.call(this);
	}
}

daiaAvailability.prototype = new JuiceProcess();
daiaAvailability.prototype.constructor = daiaAvailability;
daiaAvailability.superclass = JuiceProcess.prototype;

daiaAvailability.prototype.start = function(){
			
	if(juice.hasMeta(this.availIDs)){
		var ids = juice.getMetaValues(this.availIDs);
				
		for(var i=0; i < ids.length; i++){
			this.div_id = i;
			// check there is a valid id to use
			if (ids[i] != "undefined" && ids[i].length >0) {
				this.avail_url = this.availServer + "?id=" + encodeURIComponent(ids[i]) + "&format=" + this.format;
				this.getDaia();
			}
			else {
				// Do nothing
			}
		}
	} 
}

daiaAvailability.prototype.getDaia = function(){
	var This = this;
	var url = this.avail_url;
	var id = this.div_id;
	var daia_div = null;
	var holdings_html = '';
	try {
		$jq.getJSON(url + '&callback=?', function(data) {
			if(data){
				$jq.each(data.document, function(index, daia_doc) {
					if (daia_doc.error) {
						juice.debugOutln(daia_doc.error);
						// To display feedback in the UI, assign an appropriate message to daia_div here
					}
					else {
						holdings_html = This.holdings_summary(daia_doc);
						daia_div = '';
						if (This.availType == 'online') {
							daia_div +=		'<div class="docdetails"></div>';
						} else if (This.href(daia_doc).length > 0){
							daia_div += 	'<div class="docdetails"><a href="' +
											This.href(daia_doc) +
											'">' +
											'Click for more information on this item' +
											'</a></div>';
						} else {
							daia_div +=		'<div class="docdetails"></div>';
						}
						daia_div +=  '<div class="docholdings">' +
										holdings_html +
										'</div>';
					}
				});
			}
			else {
				juice.debugOutln('Unable to get any availability information using the DAIA response: ' + dump(data) + '<br />');
				// To display feedback in the UI, assign an appropriate message to daia_div here
			}
			This.displayDaia(daia_div, id);
		});
	}
	catch (err) {
		juice.debugOutln(err);
	}
}

daiaAvailability.prototype.daia_err = function(daia_doc){
	var This = this;
	var ret = '';
	var error = '';
	error = daia_doc.error.content + ": " + daia_doc.error.errno;
	ret = error;
	return ret;
}

daiaAvailability.prototype.href = function(daia_doc){
	var ret = '';
	if (daia_doc.href) {
		ret = 	daia_doc.href;
	}
	return ret;
}

daiaAvailability.prototype.id = function(daia_doc){
	var ret = '';
	ret = 	daia_doc.id;		
	return ret;
}

daiaAvailability.prototype.item_count = function(daia_doc) {
	var ret = '';
	ret = daia_doc.item;
	return ret;
}

daiaAvailability.prototype.holdings_summary = function(daia_doc){
	var This = this;
	if (This.availType == 'online') {
		// Specific approach to DAIA which assumes all items are online and so URLs go to full text
		var e_html = '';
		if (typeof(This.item_count(daia_doc)) == 'undefined') {
			juice.debugOutln('No items in DAIA document: ' + dump(daia_doc) + '<br />');
			// To display feedback on the lack of online availability in the UI, assign an appropriate message to e_html here
		}
		else {
			var e_html = '<div class="online_links"><strong>Available online via:</strong><ul>';
			$jq.each(daia_doc.item, function(index, daia_item) {
				if (daia_item) {
					e_html += '<li style="display: block;"><a href="' + This.item_href(daia_item) + '">' + This.item_label(daia_item)  + '</a></li>';
				}
			});
			e_html += '</ul></div>';
		}
		ret = e_html;
	}
	else {
		// More generic routine, mainly (not exclusively) aimed at DAIA describing print materials
		
		// To allow show/hide toggle on the results need to create a doc_id which is a valid html 'id' attributefor a tbody element. 
		// Creating hash might be best strategy, but there may be licensing issues
		// Therefore here simply preserve legal characters and remove rest. This brings some risk of duplication
		var doc_id = daia_doc.id.replace(/[^A-Za-z0-9\-\_]/g,"");
		var ret = '';
		var all_depts = new Object();

		var holding_html =	'';
		var holding_html_open = '';
		var holding_html_content = '';
		var holding_html_close = '';
		var expandText = 'Show availability in all libraries';
		var expandHint = '(click arrow for more availability)';
		var oa_html = '';
		var summary_count = 0;
		if (typeof(This.item_count(daia_doc)) == 'undefined') {
			juice.debugOutln('No items in DAIA document: ' + dump(daia_doc) + '<br />');
			// No mechanism currently supported to display feedback on the lack of general availability in the UI
			return ret;
		}
		$jq.each(daia_doc.item, function(index, daia_item) {
			all_depts[(This.department_id(daia_item))] = index;
		});
		var unique_depts = new Array();
		for (j in all_depts) {
			unique_depts.push(j);
		}
		for ( i=0; i < unique_depts.length; i++) {
			var holding_summary = new Object();
			holding_summary.avail_loans = 0;
			holding_summary.avail_pres = 0;
			holding_summary.avail_oa = [];
			holding_summary.dept_id = unique_depts[i];
			$jq.each(daia_doc.item, function(index, daia_item) {
				if (daia_item.available) {
					if (This.department_id(daia_item) == unique_depts[i]) {
						holding_summary.dept_name = unique_depts[i];
						if(This.department_name(daia_item)){ 
							holding_summary.dept_name = This.department_name(daia_item);
						}
						holding_summary.avail_loans += This.count_avail_loans(daia_item); // returns an integer number of available loan elements
						holding_summary.avail_pres += This.count_avail_pres(daia_item);	 // returns an integer number of available pres elements
						holding_summary.avail_oa = holding_summary.avail_oa.concat(This.oa_urls(daia_item)); // returns an array of OA URLs
					}
				}
			});
			
			if (typeof(holding_summary.dept_name) == undefined || holding_summary.dept_name == null) {
				holding_summary.dept_name == unique_depts[i];
			}
			if (holding_summary.avail_loans > 0 || holding_summary.avail_pres > 0) {
				if (This.noLines == summary_count) {
					holding_html_content += '</tbody><tbody class="' + doc_id + ' collapsed" style="display:none;">';
				}			
				holding_html_content +=	'<tr>' +
										'<td>' + holding_summary.dept_name + '</td>' +
										'<td>' + holding_summary.avail_loans + '</td>' +
										'<td>' + holding_summary.avail_pres + '</td>' +
										'<td>';
				holding_html_content += 	'</td></tr>';
				summary_count++;
			}
			else
			{
				juice.debugOutln('No DAIA loan or presentation services available from DAIA document: ' + dump(daia_doc) + '<br />');
				// No mechanism currently supported to display feedback on the lack of loan/presentation services in the UI
			}
			if(holding_summary.avail_oa.length > 0) {

				for (k=0; k < holding_summary.avail_oa.length; k++) {
					oa_html += '<li><a href="'+ holding_summary.avail_oa[k] + '">' + holding_summary.avail_oa[k] + '</a></li>';
				}
			}
			else
			{
				juice.debugOutln('No DAIA openaccess services available from DAIA document: ' + dump(daia_doc) + '<br />');
				// No mechanism currently supported to display feedback on the lack of openaccess services in the UI
			}
		}
		holding_html_close += '</tbody></table>';
		if (summary_count > This.noLines) {
			holding_html_open  = '<table class="daia_summary"><thead><tr><th>Library' +
								'<img onclick="toggleAvailability(\'' + doc_id + '\',\'' + This.expandIcon + '\',\'' + This.collapseIcon +'\');" ' +
								'src="' + This.expandIcon +'"' +
								'alt="'+ expandText +'">' +
								'<span id="toggleAvailability">' + expandHint + '</span>' +
								'</th><th>Copies for loan</th><th>Reference only copies</th>' + 
								'</tr></thead><tbody>';
		}
		else {
		holding_html_open = '<table class="daia_summary"><thead><tr><th>Library' +
							'</th><th>Copies for loan</th><th>Reference only copies</th>' + 
							'</tr></thead><tbody>';				
		}
		holding_html = holding_html_open + holding_html_content + holding_html_close;
		if (oa_html.length > 0) {
			oa_html = '<div class="oa_links"><strong>Freely available copies online:</strong><ul>' + oa_html + '</ul></div>';
		}
		if (summary_count > 0) {
			if (oa_html.length > 0) {
				holding_html = oa_html + holding_html;
			}
			ret = holding_html;
		}
		else if (oa_html.length > 0) {
			ret = oa_html;
		}
	}
	return ret;
}

daiaAvailability.prototype.department_name = function(daia_item){
	var ret = '';
	if (daia_item.department) {
		if (daia_item.department.content) {
			ret = 	daia_item.department.content;
		}
	}
	else {
		ret = 'Unknown'
	}
	return ret;
}

daiaAvailability.prototype.department_id = function(daia_item){
	var ret = '';
	if (daia_item.department) {
		if  (daia_item.department.id) {
			ret = 	daia_item.department.id;		
		}
	}
	else {
		ret = 'unknown'
	}
	return ret;
}

daiaAvailability.prototype.storage = function(daia_item){
	var ret = '';
	ret = 	daia_item.storage.content;		
	return ret;
}

daiaAvailability.prototype.count_avail_loans = function(daia_item){
	var This = this;
	var ret = '';
	var no_loans = 0;
		$jq.each(daia_item.available, function(index, daia_available) {
			if (This.daia_service(daia_available) == 'loan') {
				no_loans++;
			}
		});
	ret = 	no_loans;
	return ret;
}

daiaAvailability.prototype.count_avail_pres = function(daia_item){
	var This = this;
	var ret = '';
	var no_pres = 0;
		$jq.each(daia_item.available, function(index, daia_available) {
			if (This.daia_service(daia_available) == 'presentation') {
				no_pres++;
			}
		});
	ret = 	no_pres;
	return ret;
}

daiaAvailability.prototype.oa_urls = function(daia_item){
	var This = this;
	var ret = '';
	var urls = new Array();
		$jq.each(daia_item.available, function(index, daia_available) {
			if (This.daia_service(daia_available) == 'openaccess') {
				urls.push(This.daia_service_url(daia_available));
			}
		});
	ret = 	urls;
	return ret;
}

daiaAvailability.prototype.availability = function(daia_item){
	var This = this;
	var ret = '';
	var dept = 	daia_item.department.content;
	var dept_id = daia_item.department.id;
	var available_list = dept + '<ul>';
	if (daia_item.available) {
		$jq.each(daia_item.available, function(index, daia_available) {
			available_list += 	'<li>' +
								This.daia_service(daia_available) +
								'</li>';
		});
	}
	available_list += '</ul>';
	ret = 	available_list;		
	return ret;
}

daiaAvailability.prototype.item_href = function(daia_item){
	var ret = '';
	ret = 	daia_item.href;
	return ret;
}

daiaAvailability.prototype.item_label = function(daia_item){
	var ret = '';
	ret = 	daia_item.label;
	return ret;
}

daiaAvailability.prototype.daia_service = function(daia_available){
	var ret = '';
	ret = 	daia_available.service;		
	return ret;
}

daiaAvailability.prototype.daia_service_url = function(daia_available){
	var ret = '';
	ret = 	daia_available.href;		
	return ret;
}

daiaAvailability.prototype.displayDaia = function(daia_div, id) {
	if(daia_div) {
		this.showInsert(id);
		this.insert = this.getInsertObject(id);
		this.insert.append(daia_div);
	}
}

function toggleAvailability(id, expandIcon, collapseIcon) {
	var collapseIcon = collapseIcon;
	var collapseText = 'Show fewer libraries';
	var collapseHint = '(click arrow to show less availability)';
	var expandIcon = expandIcon;
	var expandText = 'Show more libraries';
	var expandHint = '(click arrow to show more availability)';
	$jq('.' + id).each(function() {
								var $section = $jq(this);
								if ($section.is('.collapsed')) {
									$section.removeClass('collapsed').fadeIn('fast');
									$section.closest('.daia_summary').find('img').attr('src',collapseIcon);
									$section.closest('.daia_summary').find('img').attr('alt',collapseText);
									$section.closest('.daia_summary').find('span[id="toggleAvailability"]').text(collapseHint);
								}
								else {
									$section.addClass('collapsed').fadeOut('fast');
									$section.closest('.daia_summary').find('img').attr('src',expandIcon);
									$section.closest('.daia_summary').find('img').attr('alt',expandText);
									$section.closest('.daia_summary').find('span[id="toggleAvailability"]').text(expandHint);

								}
								});
}

/**
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */

// Included only for purposes of debugging

function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}
