function AmazonJackets(ju,insert,targetDiv,opts){
	id = "AmazonJackets";
	var defOpts = {
		location : "01",
		collection : "images",
		command: "_SCMZZZZZZZ_"
	};
	this.opts = juice.updateArray(defOpts,opts);
	
	this.targetDiv = targetDiv;
	this.targetIsbn = null;
	initFunc = this.start;
	if(arguments.length){
		AmazonJackets.superclass.init.call(this,id,initFunc,null,insert,ju);
		AmazonJackets.superclass.startup.call(this);
	}

}

AmazonJackets.prototype = new JuiceProcess();
AmazonJackets.prototype.constructor = AmazonJackets;
AmazonJackets.superclass = JuiceProcess.prototype;

AmazonJackets.prototype.start = function(){
	if(juice.hasMeta("isbns")){
		this.isbns = juice.getMeta("isbns");
		for(var i=0;i < this.isbns.length;i++){
			if(this.isbns[i].length == 10){
				this.targetIsbn = this.isbns[i];
				break
			}
		}
		if(this.targetIsbn){
			this.insertImage();
		}
	}
}

AmazonJackets.prototype.insertImage = function(){
    var src =  "http://" + this.opts.collection +
		".amazon.com/images/P/" + this.targetIsbn + "." +
		this.opts.location + "." + this.opts.command + ".jpg";
		
	var cont = '<img src="' + src + '" />';
	this.showInsert();
	var insert = new JuiceInsert(cont,"#"+this.targetDiv,"append");
	insert.show();	
}


