// qrcode_juice.js

/* Extension to create QR Code
 * Can create text or URL QR Codes of different sizes
 * Uses Google chart API to generate QR code
 * You can specify which juice meta field(s) to use
 *
 * Constructor arguments:
 * arg: ju - instance of juice
 * arg: insert - JuiceInsert to use
 * arg: targetDiv - id of element to place qrcode in
 * arg: fieldstr - string containing comma-separated list of Juice meta fields
 * arg: fieldsep - separator for multiple fields (will appear in QR code string)
 *                 default is null string
 * arg: imgsize - size of qr code PNG image (note: this is size of image in pixels,
 *                not the amount of info in the QR code)
 *                Valid values are: s (120x120 - default)
 *                                  m (230x230)
 *                                  l (350x350)
 *
 * Written by Andy Bussey
 * Version 0.1, August 2009
 * Copyright 2009 University of Sheffield
 * Under GPL (gpl-2.0.txt) license.
 */

 
var qrcodeJuice_count = 0;

function qrcodeJuice(ju, insert, targetDiv, fieldstr, fieldsep, imgsize){
    id = "QRCode" + qrcodeJuice_count++;
    this.targetDiv = targetDiv;
    this.fields = fieldstr.split(",");
    if(fieldsep != undefined) {
        this.fieldsep = fieldsep;
    }
    else {
        this.fieldsep = ""
    }
    switch(imgsize){
	case 'm': 
            this.imgsize = '230x230';
            break;
	        case 'l':
	            this.imgsize = '350x350';
	            break;
	        case 's':
	            this.imgsize = '200x200';
	            break;
        default:
            this.imgsize = '120x120';
    }
    initFunc = this.qrcodeInit;
    if(arguments.length){
        qrcodeJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
        qrcodeJuice.superclass.startup.call(this);
    }
    // debug stuff
//    juice.debugOutln("*** qrcodeJuice constructor: targetDiv "+this.targetDiv+" ; fields "+this.fields+" ; size "+this.imgsize+"***");
}

qrcodeJuice.prototype = new JuiceProcess();
qrcodeJuice.prototype.constructor = qrcodeJuice;
qrcodeJuice.superclass = JuiceProcess.prototype;

qrcodeJuice.prototype.qrcodeInit = function(){
    var This = this;
    juice.ready(function(){This.displayQrCode();});
}

qrcodeJuice.prototype.displayQrCode = function(){
    var got_qrtext = 0;
    var qrtext = "";
    for(fieldnum in this.fields) {
        var field = this.fields[fieldnum];
        // debug stuff
//        juice.debugOutln("*** qrcodeJuice display: field " + field);
        if(juice.hasMeta(field)){
            // debug stuff
//            juice.debugOutln(" qrcodeJuice display: we have field!");
            //
            if(got_qrtext) {
	        qrtext += this.fieldsep;
            }
            qrtext += juice.getMeta(field, this.metanum);
            got_qrtext = 1;
        }
    }
    // debug stuff
//    juice.debugOutln(" qrcodeJuice display: qrtext "+qrtext+" ; got_qrtext "+got_qrtext.toString());
    if(got_qrtext) {
        var base = 'http://chart.apis.google.com/chart?cht=qr&';
        var size = 'chs=' + this.imgsize + '&';
        var text = 'chl=' + escape(qrtext);
        var qrimage = '<div id="qrcode"><image alt="QR Code: ' + qrtext + '" src="' + base +
                size + text + '"></div>';
        // debug stuff
//        juice.debugOutln(" qrcodeJuice display: qrimage "+qrimage+" ***");
        //
        this.showInsert();
        var insert = new JuiceInsert(qrimage, "#"+this.targetDiv,"append");
        insert.show();
    }
}