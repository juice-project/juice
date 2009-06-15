function MTAEmbedJuice(ju,insert,targetDiv){
	id = "MTASel";
	this.targetDiv = targetDiv;
	initFunc = this.startMTA;
	selectFunc = this.runMTA;
	if(arguments.length){
		MTAEmbedJuice.superclass.init.call(this,id,initFunc,selectFunc,insert,ju);
		MTAEmbedJuice.superclass.startup.call(this);
	}

}

MTAEmbedJuice.prototype = new JuiceProcess();
MTAEmbedJuice.prototype.constructor = MTAEmbedJuice;
MTAEmbedJuice.superclass = JuiceProcess.prototype;

MTAEmbedJuice.prototype.startMTA = function(){
	if(juice.hasMeta("isbns")){
		this.isbns = juice.getMeta("isbns");
		this.isbnspos = 0;
		this.searchMTA();
	}
}

MTAEmbedJuice.prototype.searchMTA = function(){
	if(this.isbnspos == this.isbns.length){
		return;
	}
	
	var query = "isbn=" + this.isbns[this.isbnspos++];

    var cmd =  "http://api.talis.com/tx?" +
				"xml-uri=http%3A%2F%2Ftalis-rjw.s3.amazonaws.com%2FPrismDev%2Fmta.xml" +
				"&xsl-uri=http%3A%2F%2Ftalis-rjw.s3.amazonaws.com%2FPrismDev%2Fmta.xsl" +
				"&content-type=text%2Fx-json"+
				"&callbackname=" + this.jsonCallBackPrefix("loadMTA") +
				"&" + query;
	juice.runscript("MTAJuiceScript",cmd);
}

MTAEmbedJuice.prototype.loadMTA = function(info){
	if(info == null){
		this.searchMTA();
	}else{
		this.loadViewer(info);
	}
}

MTAEmbedJuice.prototype.loadViewer = function(info) {
	var stream = this.mtaGetReal(info);
	if(stream != null){
		this.showInsert();
		var h = $jq("#"+this.targetDiv).height();
		var w = $jq("#"+this.targetDiv).width();
		var title = info.authorfirstname + " " + info.authorlastname;
		var tDiv = '<div style="display: block">'+title+'</div>';
		$jq("#"+this.targetDiv).before(tDiv);
		$jq("#"+this.targetDiv).append(this.buildPlayer(stream, h, w));
	}
}

MTAEmbedJuice.prototype.buildPlayer = function(stream,playerH,playerW){
	var player = '<div id="media_player">' +
	            '<object id="rmplayer" classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="'+playerW+'" height="'+playerH+'">' +
	            '<param name="src" value="http://www.meettheauthor.co.uk/asp/playreal.asp?ISBN=748&BW=hb" />' +
	            '<param name="controls" value="imagewindow" />' +
	            '<param name="console" value="one" />' +
	            '<param name="autostart" value="true" />' +
	            '<embed autostart="true" src="' +
				stream +
				'" width="'+playerW+'" height="'+playerH+'" nojava="true" controls="ImageWindow" console="one" type="audio/x-pn-realaudio-plugin"></embed>' +
	            '</object>' +
	            '<br />' +
	            '<object OnRButtonDown="cancelRightClick" id="rmplayer" classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="320" height="36">' +
	            '<param name="src" value="http://www.meettheauthor.co.uk/asp/playreal.asp?ISBN=748&BW=hb" />' +
	            '<param name="controls" value="controlpanel" />' +
	            '<param name="console" value="one" />' +
	            '<param name="autostart" value="true" />' +
	            '<embed autostart="true" src="' +
				stream +
				'" 	width="'+playerW+'" height="36" nojava="true" type="audio/x-pn-realaudio-plugin" controls="ControlPanel" console="one" ></embed>' +
	            '</object>' +
	            '</div>';
	return player;
	
}
MTAEmbedJuice.prototype.mtaGetReal = function(info){
	var streams = info.stream;
	for(var i=0; i < streams.length;i++){
		if(streams[i].type == 'real' &&
		   streams[i].bandwith == 'high'){
			return streams[i].src;
		}
	}
	return null;
}



