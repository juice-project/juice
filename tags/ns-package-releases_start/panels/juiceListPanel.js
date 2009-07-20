/*
 * JuiceBasicPanel 0.1 - Javascript User Interface Componentised Extension
 * http://juice-project.googlecode.com
 *
 * Copyright (c) 2009 Talis (talis.com)
 * Originator: Richard Wallis
 * Under GPL (gpl-2.0.txt) license.
 *
 * $Author$
 * $Date$
 * $Rev$
 */
function JuiceListPanel(insertDiv, panelId, startClass, liveClass, showFunc){
	JuiceListPanel.superclass.init.call(this,insertDiv, panelId, startClass, liveClass, showFunc);
	this.added = false;
}

JuiceListPanel.prototype = new JuicePanel();
JuiceListPanel.prototype.constructor = JuiceListPanel;
JuiceListPanel.superclass = JuicePanel.prototype;

JuiceListPanel.prototype.add = function(sel){
	this.insert();
	this.show();
	if(!this.added){
		this.buildlist();
		this.added = true;
	}
//	var htm = '<li title="'+ sel.selText() + '" id="' + this.getPanelId() + sel.processId() + '" class="' + this.startClass() + '" >';
//	htm += sel.selText() + '</li>';
	var id = this.makeId(sel);
	var htm = '<li title="'+ sel.selText() + '" id="' + id +  '" class="' + this.startClass() + '" >';
	htm += '<a href="javascript:void(0)" title="'+ sel.selText() + '">';
	htm += sel.selText() + '</a></li>';
	
	
	$jq("#"+this.getPanelId()+" ul").append(htm);
}

JuiceListPanel.prototype.buildlist = function(){
	var htm = '<ul class="JuiceList"></ul>';
	$jq("#"+this.getPanelId()).append(htm);
}
