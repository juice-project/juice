//TwitterFeed.js
//Extension to embed a Twitter feed in to the page
//Constructor arguments:
//arg: ju - instance of juice
//arg: insert - JuiceInsert for page
//arg: targetDiv - id of element within insert to contain control<br/>
//arg: feeds - RSS feed(s) URLs to display within control
//arg: opts - options passed to control
//arg: css - css file to override default css

function TwitterFeedJuice(ju,insert,targetDiv,query,opts,css){
	id = "TwitterFeed";
	this.targetDiv = targetDiv;
	this.query = query;
	this.count = 10;
	this.showAvatar = true;
	this.showId = true;
	this.showLink = true;
	this.opts = opts;
	this.css = css;
	initFunc = this.startFeed;
	if(arguments.length){
		TwitterFeedJuice.superclass.init.call(this,id,initFunc,null,insert,ju);
		TwitterFeedJuice.superclass.startup.call(this);
	}

}

TwitterFeedJuice.prototype = new JuiceProcess();
TwitterFeedJuice.prototype.constructor = TwitterFeedJuice;
TwitterFeedJuice.superclass = JuiceProcess.prototype;

TwitterFeedJuice.prototype.startFeed = function(){
	var This = this;
	if(this.css){
		juice.loadCss(this.css);		
	}
    juice.ready(function(){This.getTweets();});
}


TwitterFeedJuice.prototype.buildQuery = function(){
	var url = 'http://search.twitter.com/search.json?q=' + escape(this.query) + '&rpp=' + this.opts.count + '&callback=?';
	return url;
}

TwitterFeedJuice.prototype.getTweets = function(){
	var This = this;
	var url = this.buildQuery();
	var list = null;

	$jq.getJSON(url, function(data){
		if(data && data.results && data.results.length > 0){
			list = '<ul class="tweet_list">';
			$jq.each(data.results, function(i, item){
				var row = '<li>' +
				This.avatar(item) +
				This.twitterId(item) +
				'<span class="tweet_text">' + 
				This.formatTweet(item.text)  +
				' <span class="tweet_date">' + This.relativeTime(item.created_at) + ' </span>' +
				This.twitterLink(item) +
				'</span></li>';
				list += row;
			});
			list +='</ul>';			
		}
		This.displayFeed(list);
		$jq("#tweet_list").children('li:first').addClass('tweet_first');
        $jq("#tweet_list").children('li:odd').addClass('tweet_even');
        $jq("#tweet_list").children('li:even').addClass('tweet_odd');
        
	});

}

TwitterFeedJuice.prototype.displayFeed = function(list){
	
	if(list){
		var cont = '<div id="' + this.processId() + '" ' + 'class="juice_tweet" ' +
			'style="display: block; background-color: transparent; ' +
			'padding: 0; border: 0; margin-left: auto; margin-right: auto; ' +
			'width: ' +  this.opts.width + '; ' +
			'height: ' +  this.opts.height + '"/>';
		this.showInsert();
		var insert = new JuiceInsert(cont,"#"+this.targetDiv,"append");
		insert.show();
		$jq("#"+this.processId()).append(list);
	}
}

TwitterFeedJuice.prototype.formatTweet = function(tweet){
	var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
    var tmp = tweet.replace(regexp,"<a href=\"$1\">$1</a>");
	
	regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
	tmp = tmp.replace(regexp,"<a href=\"http://twitter.com/$1\">@$1</a>");
	
	regexp = / [\#]+([A-Za-z0-9-_]+)/gi;
	tmp = tmp.replace(regexp, ' <a href="http://search.twitter.com/search?q=&tag=$1&lang=all">#$1</a>');
	
	return tmp;
}

TwitterFeedJuice.prototype.avatar = function(item){
	var ret = "";
	if(this.opts.showAvatar){
		ret = '<a class="tweet_avatar" href="http://twitter.com/"' +
		item.from_user + '">' + '<img src="' + item.profile_image_url + '" ' +
		'alt="' + item.from_user +'"/>' + '</a>';		
	}
	return ret;
}
TwitterFeedJuice.prototype.twitterId = function(item){
	var ret = "";
	if(this.opts.showId){
		ret = '<a class="tweet_id" href="http://twitter.com/' +
		item.from_user + '">' + item.from_user + ' </a>';		
	}
	return ret;
}
TwitterFeedJuice.prototype.twitterLink = function(item){
	var ret = "";
	if(this.opts.showLink){
		ret = '<a class="tweet_link" href="http://twitter.com/' +
		item.from_user + '/statuses/' + item.id + '" title="View Tweet on Twitter">View Tweet </a>';		
	}
	return ret;
}

TwitterFeedJuice.prototype.relativeTime = function(time_value) {
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
  if(delta < 60) {
  return 'less than a minute ago';
  } else if(delta < 120) {
  return 'about a minute ago';
  } else if(delta < (45*60)) {
  return (parseInt(delta / 60)).toString() + ' minutes ago';
  } else if(delta < (90*60)) {
  return 'about an hour ago';
  } else if(delta < (24*60*60)) {
  return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
  } else if(delta < (48*60*60)) {
  return '1 day ago';
  } else {
  return (parseInt(delta / 86400)).toString() + ' days ago';
  }
}



