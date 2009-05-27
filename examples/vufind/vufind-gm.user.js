// ==UserScript==
// @name          VuFind GM Script
// @namespace     http://www.talis.com
// @description   Juice embed in VuFind
// @include       http://vufind.org/demo/*
// ==/UserScript==


function myloadjs(file){
	var juhead = document.getElementsByTagName('head')[0]; 
	var juins = document.createElement('script'); 
	juins.type = 'text/javascript'; 
	juins.src = file; 
	juhead.appendChild(juins); 
}

myloadjs("http://juice-project.s3.amazonaws.com/jquery-1.3.2.js");
myloadjs("http://juice-project.s3.amazonaws.com/juice.js");
myloadjs("http://juice-project.s3.amazonaws.com/examples/vufind/extend-vufind.js")

