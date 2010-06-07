//extend-talisP2.js
//Author Richard Wallis 13/11/09
//Extension file for Talis Prism 2 installations

jQuery(document).ready(function () {
        juice.setDebug(false);
//      juice.loadCss("http://{mySite}/js/juiceDefault.css");
//      juice.loadJs("http://{mySite}/js/juiceOverlay-0.3.js");
//      juice.loadCss("http://{mySite}/juiceOverlay.css");
        
        
        juice.loadJs("/TalisPrism/Views/Javascript/juice/metadefs/talis_prism2_metadef.js");
        juice.loadJs("/TalisPrism/Views/Javascript/juice/extensions/extendedbyJuice.js");
        juice.loadJs("/TalisPrism/Views/Javascript/juice/extensions/AmazonJackets.js");
        juice.onAllLoaded(runExtensions);
});

function runExtensions(){
        
        new extendedbyJuice(juice);
// Replace UA-XXXXXXX-XX with your Google Analytics ID(s) - comma separated if there is more than one
//      new gasJuice(juice,"UA-XXXXXXX-XX");
        talis_prism2_metadef();
        if(juice.hasMeta('isbns')){
                var div = '<tr><td><div style="float: right; margin-bottom: -200px; margin-right: 10px;" id="jack"></div></td></tr>';

                //Find and label row containg Author detail line
                $jq($jq($jq("b:contains('Author')").parents('table')[0]).parents('tr')[0]).attr("id","jackrow");

                //Create insert before Author row
                var insert = new JuiceInsert(div,"#jackrow","before");
                new AmazonJackets(juice,insert,"jack");
        }
}

