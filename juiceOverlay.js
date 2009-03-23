/*
 * JuiceOverlay 0.2 - Javascript User Interface Framework for Extension
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

var juiceOverlayMask = null;
var juiceOverlay = null;


function juiceOverlayDisplay(content,hdrContent){
	var maskhtml = '<div id="juiceOverlayMask" class="juiceOverlay-Mask" />';
	juiceOverlayMask = new JuiceInsert(maskhtml,"body","append");
	juiceOverlayMask.show();
	var overlayhtml = '<div id="juiceOverlay" class="juiceOverlay" />';
	juiceOverlay = new JuiceInsert(overlayhtml,"body","append");
	juiceOverlay.show();
	var target = juiceOverlay.getInsertObject();

	var head = '<div id="juiceovTitle" class="juiceOverlayTitle"/>';
	target.append(head);
	if(hdrContent){
		$("#juiceovTitle").append(hdrContent);
	}
	var icon = "<img id='juiceovExitClick' src='http://talis-rjw.s3.amazonaws.com/PrismDev/close_icon.png' class='juiceovOverlayExitClick'/>";
	$("#juiceovTitle").append(icon);
	$("#juiceovExitClick").click(juiceOverlayRemove);
	var contentObj = jQuery(content);
	target.append(contentObj);
	
	return contentObj;
}

function juiceOverlayRemove(){
	if(juiceOverlayMask){
		juiceOverlay.remove();
		juiceOverlayMask.remove();
		juiceOverlayMask = null;
		juiceOverlay = null;
	}
}
