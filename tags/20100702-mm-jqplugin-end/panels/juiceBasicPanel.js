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
function JuiceBasicPanel(insertDiv, panelId, startClass, liveClass, showFunc){
	JuiceBasicPanel.superclass.init.call(this,insertDiv, panelId, startClass, liveClass, showFunc);
}

JuiceBasicPanel.prototype = juice.panel();
JuiceBasicPanel.prototype.constructor = JuiceBasicPanel;
JuiceBasicPanel.superclass = JuicePanel.prototype;
