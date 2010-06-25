function LibraryThingCKJuice(ju,src,text,defPanel){
	id = "LibraryThingCKSel";
	
	initFunc = this.searchLibraryThingCK;
	selectFunc = this.runLibraryThingCK;
	if(arguments.length){
		this.init(id,src,text,initFunc,selectFunc,null,ju,defPanel);
	}
}

LibraryThingCKJuice.prototype = new JuiceSelectProcess();
LibraryThingCKJuice.prototype._data = null;
LibraryThingCKJuice.prototype._content = null;

LibraryThingCKJuice.prototype.searchLibraryThingCK = function(){
	if(juice.hasMeta("isbns")){
		var isbns = juice.getMeta("isbns");
		var selString = "";
		for(index = 0;index < isbns.length;index++){
			selString += "%26isbn="+isbns[index];		
		}
	
		var cmd = "http://api.talis.com/tx?" +
						"xml-uri=http%3A%2F%2Fwww.librarything.com%2Fservices%2Frest%2F1.0%2F%3Fmethod%3Dlibrarything.ck.getwork%26apikey%3D16aa4af2dbcf916a559bdd26442b40fc" +
						selString +
						"&xsl-uri=http%3A%2F%2Ftalis-rjw.s3.amazonaws.com%2FPrismDev%2Frjw-xml2json.xsl" +
						"&content-type=text%2Fx-json"+
						"&callbackname=" +
						this.jsonCallBackPrefix("loadLibraryThingCK");
		juice.runscript("LibraryThingCKJuiceScript",cmd);
	}
}

LibraryThingCKJuice.prototype.loadLibraryThingCK = function(info){
	try{
		if(info){
			this._data = info.response.ltml.item.commonknowledge;
			if(this._data){
				this.enable();			
			}
		}		
	}catch(msg){
		juice.debugOutln("loadLibraryThingCK caught: "+msg);
		juice.debugOutln("loadLibraryThingCK recieved: "+info);
	}
}
LibraryThingCKJuice.prototype.runLibraryThingCK = function(){
	var content = "<table id='ltckTable' class='juiceoverlayTable'><tbody>";
	var fields = this._data.fieldList.field;
	var rows = 0;
	for(var i=0; i < fields.length;i++){
		var factCount = 0;
		var fieldName = fields[i].@displayName;
		var fieldType = fields[i].@name;
		var versions = juice.toArray(fields[i].versionList.version);
		for(j=0;j < versions.length;j++){
			var facts = juice.toArray(versions[j].factList.fact);
			for(var k=0;k < facts.length;k++){

				var name = "&nbsp;";
				if(factCount++ == 0){
					name = fieldName;
				}
				row = "<tr><td class='overlayLabel '>" + name + "</td>";
				row += "<td";
				row += ">" + this.wrapFact(fieldType,facts[k]) + "</td></tr>"
				content += row;
			}
		}
	}
	content += "</tbody></table>";
	var titleCont = '<img src="' + this.iconSrc() + '" height="20px"/>';
	juice.launchWin(this._targetUrl,"overlay",content,titleCont);
	var THIS = this;
	$jq(".iframeLaunch").click(LibraryThingCKSelect);
}

function LibraryThingCKSelect(){
	var target = this.target;
	juice.launchWin(target,"new");
	return false;
}

LibraryThingCKJuice.prototype.wrapFact = function(type,fact){
	var ret = "";
	switch(type){
		case 'awards':
			ret += "<a class='iframeLaunch' title='" + fact +"' href='javascript:void(0)' target='http://www.librarything.com/bookaward/"+fact+"'>"+fact+"</a>";
			break;
		case 'placesmentioned':
			ret += "<a class='iframeLaunch' title='" + fact +"' href='javascript:void(0)' target='http://www.librarything.com/place/"+fact+"'>"+fact+"</a>";
			break;
		case 'characternames':
			ret += "<a class='iframeLaunch' title='" + fact +"' href='javascript:void(0)' target='http://www.librarything.com/character/"+fact+"'>"+fact+"</a>";
			break;
		case 'series':
			ret += "<a class='iframeLaunch' title='" + fact +"' href='javascript:void(0)' target='http://www.librarything.com/series/"+fact+"'>"+fact+"</a>";
			break;
		case 'firstwords':
		case 'lastwords':
			ret += "<span class='bookText'>"+fact+"</span>";
			break;
		default:
			ret = fact;
			break;
	}
	
	return ret;
}


