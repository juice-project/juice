// ==UserScript==
// @name          Aspire GM Script
// @namespace     http://www.talis.com
// @description   Juice embed in Talis Aspire
// @include       http://life.lists.talis.stage/*.html
// @include       http://lists.lib.plymouth.ac.uk/*.html
// @include       http://liblists.sussex.ac.uk/*.html
// ==/UserScript==


function myloadjs(file){
	var juhead = document.getElementsByTagName('head')[0]; 
	var juins = document.createElement('script'); 
	juins.type = 'text/javascript'; 
	juins.src = file; 
	juhead.appendChild(juins); 
}

myloadjs("http://juice-project.s3.amazonaws.com/jquery-1.3.2.min.js");
myloadjs("http://juice-project.s3.amazonaws.com/juice.js");
myloadjs("http://juice-project.s3.amazonaws.com/examples/talis-aspire/extend-talisaspire.js")

