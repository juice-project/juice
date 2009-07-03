// ==UserScript==
// @name          Koha GM Script
// @namespace     http://www.talis.com
// @description   Juice embed in Koha
// @include       http://*.kohalibrary.com/*
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
myloadjs("http://juice-project.s3.amazonaws.com/examples/koha/extend-koha.js")
