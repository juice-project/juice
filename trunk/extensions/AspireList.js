//AspireList.js
//Insert a list of reading lists this item appears on in the an Aspire install
// arg : target - target location of page element to be inserted
// arg : service uri - location of the JSON feed to call, no trailing slash
// arg : opt - object containings value changes {title:"title of the panel", style:'styles to apply', classes:'classes to apply', lcn : 'local control id for testing'}


function AspireListJuice(target, service_uri, opt){

		var settings = jQuery.extend({title: 'Aspire Lists', style:'margin-top:1em;', classes:'tagbox', limit:6}, opt);
		var lcn = settings.lcn || juice.getMeta('workid');
		var req = service_uri+'/lcn/'+ lcn +'/lists.json?cb=AspireCallBack';
		
		if(lcn){
			AspireCallBack=function(data){
								
				if(data && data.results.bindings && data.results.bindings.length>0){
					var output='';
					var count=0;
					jQuery.each(data.results.bindings, function(i,item){
						if(count<settings.limit){
							output=output+'<li><a href="'+item.list.value+'">'+item.name.value+'</a></li>';
						}
						count=count+1;
					});
					var cont='<div id="aspireList" class="'+settings.classes+'" style="'+settings.style+'"><h2>'+settings.title+'</h2><ul>'+output+'</ul></div>';
					var insert = new JuiceInsert(cont,target,"append");
					insert.show();	
				}
			}			
			
			juice.loadJs(req);
			
		}
	
}
