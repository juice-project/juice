// ==UserScript==
// @name          Aspire GM Script
// @namespace     http://www.talis.com
// @description   Juice embed in Talis Aspire
// @include       http://life.lists.talis.stage/*
// @include       http://lists.lib.plymouth.ac.uk/*
// @include       http://liblists.sussex.ac.uk/*
// ==/UserScript==


function myloadjs(file){
	var juhead = document.getElementsByTagName('head')[0]; 
	var juins = document.createElement('script'); 
	juins.type = 'text/javascript'; 
	juins.src = file; 
	juhead.appendChild(axins); 
}

myloadjs("http://juice-project.s3.amazonaws.com/jquery-1.3.1.js");
myloadjs("http://juice-project.s3.amazonaws.com/juice.js");
myloadjs("http://juice-project.s3.amazonaws.com/examples/talis-apire/extend-talisaspire.js")

