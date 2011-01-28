// QuickLink.js
// ------------
// Version: 1.0
// Author: mm
// Last Edit: 29/11/2010 - db

// Quick links for account pages in Prism etc

/*
 * Constructor arguments:
 * arg: items - An array of objects [{link:'', linktext:''}] to set links
 * arg: opts - An object containing options to override default settings
 */

function quickLink(selector, items, opts){
	
	var settings=jQuery.extend({id:0,type:'append', text:''}, opts);	
	var div=jQuery('#quickLinkActions'+settings.id);
	
	function template(i){
		return '<a href="'+ i.link+ '">' +i.title+ '</a>';
	}
	
	if(div.length==0){
		var divhtml='<div id="quickLinkActions'+settings.id+'"><p>'+settings.text+' </p></div>';
		if(settings.type=='append'){
			jQuery(selector).append(divhtml);
		}
		if(settings.type=='after'){
			jQuery(selector).after(divhtml);
		}
	}
	var html='';
	
	if(items.length==1){
		html=template(items[0]);
	}
	else {
		var end=items.pop();
		
		for(var count=0;count<items.length;count++){
			html=html + template(items[count]);
		}
		
		html=html+' and '+ template(end);
	}	
	
	jQuery('#quickLinkActions'+settings.id+' p').append(html+'.');
	
}

