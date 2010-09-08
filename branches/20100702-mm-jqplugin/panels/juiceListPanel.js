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

JuiceListPanel.prototype = new juice.panel();
JuiceListPanel.prototype.constructor = JuiceListPanel;
JuiceListPanel.superclass = juice.panel.prototype;

JuiceListPanel.prototype.add = function(sel){
	this.insert();
	this.show();
	if(!this.added){
		$jq("#"+this.getPanelId()).append('<ul class="JuiceList"></ul>');
		this.added = true;
	}
	var id = this.makeId(sel);
	var htm = '<li title="'+ sel.selText() + '" id="' + id +  '" class="' + this.startClass() + '" >';
	htm += '<a href="javascript:void(0)" title="'+ sel.selText() + '">';
	htm += sel.selText() + '</a></li>';
	
	
	$jq("#"+this.getPanelId()+" ul").append(htm);
}