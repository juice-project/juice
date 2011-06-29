function Carousel (ju, insert, targetDiv, opts) {
  this.id = 'Carousel';
  this.targetDiv = targetDiv;

  var defOpts = {
    width:              550,                    // total width in px of carousel including any prev/next links
    height:             120,                    // total height in px of carousel
    loadingImage:       null,                   // url of loading image
    spacing:            10,                     // space in px between each item
    fadeItems:          true,                   // whether to fade items to highlight the hovered item
    fadeItemsTo:        0.8,                    // opacity to set faded items to
    displayInfo:        true,                   // whether to display an item's info when hovered over
    customInfoElement:  null,                   // id of custom element to display the item's info, overrides default
    auto:               false,                  // whether to auto-scroll
    interval:           2000,                   // interval in ms for auto-scroll
    direction:          'right',                // direction for auto-scroll
    prevLinkText:       'Prev',                 // text / HTML for default "prev" scroll link
    nextLinkText:       'Next',                 // text / HTML for default "next" scroll link
    customPrevLink:     'carousel-prev',        // id of custom "prev" link <a> element (other link settings will be discarded)
    customNextLink:     'carousel-next',        // id of custom "next" link <a> element (other link settings will be discarded)
    items:              [],                     // array of JSON objects with item info
    feedUrl:            null,                   // URL of item feed
    maxEntries:         20                      // max number of items to download from feed
  };

  this.opts = juice.updateArray(defOpts, opts);
  this.items = [];                              // array of JQuery objects generated from this.opts.items
  this.loadedItems = 0;
  this.prevLink = null;
  this.nextLink = null;
  this.infoElement = null;
  this.infoElementDefault = '';
  this.loadingElement = null;
  this.hover = false;
  this.leftPositions = [0];
  this.leftPositionIndex = 0;
  this.carouselContainer = null;
  this.carouselElement = null;
  this.carouselWrapper = null;

  if (arguments.length) {
    if (this.opts.feedUrl) {
      juice.loadGoogleApi ('feeds', '1');
    }

    Carousel.superclass.init.call(this, this.id, this.start, null, insert, ju);
    Carousel.superclass.startup.call(this);
  }
}


Carousel.prototype = new JuiceProcess ();
Carousel.prototype.constructor = Carousel;
Carousel.superclass = JuiceProcess.prototype;


Carousel.prototype.start = function () {
  var This = this;

  juice.ready (function () {
    if (This.opts.feedUrl) {
      This.getItemsFromFeed (This.opts.feedUrl);
    }
    else if (This.opts.items.length > 0) {
      This.initCarousel ();
    }
  });
}


Carousel.prototype.initCarousel = function () {
  var This = this;

  // add loading image if required
  if (this.opts.loadingImage) {
    this.loadingElement = $('<div>').css ({
      height:     this.opts.height + 'px',
      background: 'url(' + this.opts.loadingImage + ') center center no-repeat'
    }).appendTo ($('#' + this.targetDiv));
  }

  // contains carousel plus any default links & info element
  this.carouselContainer = $('<div>').attr('id', 'carousel-container').css ({
    position:   'relative',
    width:      this.opts.width + 'px',
    height:     this.opts.height + 'px',
    margin:     '0 auto',
    overflow:   'hidden'
  });

  // add our links if needed
  if (this.opts.customPrevLink == 'carousel-prev' && this.opts.customNextLink == 'carousel-next') // we're using default links
  {
    this.prevLink = $('<div>').attr('id', 'carousel-prev-wrapper').css ({
      float:          'left',
      height:         this.opts.height + 'px',
      lineHeight:     this.opts.height + 'px',
      paddingRight:   '5px'
    }).append ($('<a>').attr({
      id:     'carousel-prev',
      href:   '#'
    }).click (function (e) {
      e.preventDefault ();
      This.scrollItems ('left');
    }).append (this.opts.prevLinkText));

    this.nextLink = $('<div>').attr('id', 'carousel-next-wrapper').css ({
      float:          'left',
      height:         this.opts.height + 'px',
      lineHeight:     this.opts.height + 'px',
      paddingLeft:   '5px'
    }).append ($('<a>').attr({
      id:     'carousel-next',
      href:   '#'
    }).click (function (e) {
      e.preventDefault ();
      This.scrollItems ('right');
    }).append (this.opts.nextLinkText));
  }
  else
  {
    // bind prev/next links
    $('a#' + this.opts.customPrevLink).click(function (e) {
      e.preventDefault ();
      This.scrollItems ('left');
    });

    $('a#' + this.opts.customNextLink).click(function (e) {
      e.preventDefault ();
      This.scrollItems ('right');
    });
  }

  // our wrapper div
  this.carouselWrapper = $('<div>').attr('id', 'carousel-wrapper').css ({
    position:   'relative',                 // for IE
    height:     this.opts.height + 'px',
    margin:     '0 auto',
    overflow:   'hidden'
  }).appendTo (this.carouselContainer);

  // if we have default links then add them before & after the wrapper div and float them all left
  // this is the only way to line everything up if we're gonna make it work in IE6...
  if (this.prevLink && this.nextLink) {
    this.carouselWrapper.css ('float', 'left');
    this.carouselContainer.prepend (this.prevLink);
    this.carouselContainer.append (this.nextLink);
  }

  // add our info element if needed
  if (this.opts.displayInfo) {
    if (this.opts.customInfoElement) {
      this.infoElement = $('#' + this.opts.customInfoElement);
    }
    else {
      this.infoElement = $('<div>').attr('id', 'carousel-item-info').css({
        'clear':        'left',
        'margin':       'auto',
        'padding-top':  '10px',
        'height':       '60px'
      }).appendTo (this.carouselContainer.css ('height', this.opts.height + 80 + 'px'));
    }
  }

  // add the empty <ul>
  this.carouselElement = $('<ul>').css({
    position:   'relative',
    width:      '10000%',       // set up initial width before calculating later
    height:     this.opts.height + 'px',
    margin:      0,
    padding:     0,
    overflow:   'hidden'
  }).hover (function () {
    This.hover = true;
  }, function () {
    This.hover = false;
  }).appendTo (this.carouselWrapper);

  // populate with <li> items based on the feed items in our options
  for (var i = 0; i < this.opts.items.length; ++i) {
    this.carouselElement.append (this.items[i] = $('<li>').css ({
      'float':        'left',
      'height':       this.opts.height + 'px',
      'margin':       0,
      'margin-right': i < this.opts.items.length-1 ? this.opts.spacing + 'px' : 0,
      'padding':      0,
      'list-style':   'none',
      'opacity':      (this.opts.fadeItems ? this.opts.fadeItemsTo : 1)
    }).attr ('class', 'carousel-item' + (i == 0 ? ' first' : (i == this.opts.items.length-1 ? ' last' : ''))).append ($('<a>').attr({
      href:   this.opts.items[i].href,
      title:  this.opts.items[i].title
    }).focusin (function (e) {
      $(document).bind ('keydown', {This: This}, This.keyHandler);
    }).focusout (function (e) {
      $(document).unbind ('keydown', This.keyHandler);
    }).append ($('<img>').attr({
      alt:    this.opts.items[i].title
    }).load (function () {
      if (++This.loadedItems == This.opts.items.length) {
        This.itemsLoaded ();
      }
    }).css ({
      width:  'auto'
    }))));
  }

  // to avoid callback clashes (mostly IE... again), we add the img's src attribute here
  for (var i = 0; i < this.items.length; ++i) {
    this.items[i].find('img').attr ('src', this.opts.items[i].src);
  }
}


Carousel.prototype.itemsLoaded = function () {
  var This = this;

  // remove any loading image
  if (this.loadingElement) {
    this.loadingElement.remove ();
  }

  // inject markup now so we don't return 0 widths
  this.showInsert ();
  var insert = new JuiceInsert (this.carouselContainer, '#' + this.targetDiv, 'append');
  insert.show ();

  // now we're all loaded up, calculate our widths & scrolling points
  this.calculateWidths ();

  // add our fancy fading rollover code
  if (this.opts.fadeItems) {
    $('li.carousel-item').hover (function () {
      $(this).animate({'opacity': 1}, 50);
    }, function () {
      $(this).animate({'opacity': This.opts.fadeItemsTo}, 150);
    });
  }

  // add our fancy item information code
  if (this.opts.displayInfo) {
    this.infoElementDefault = this.infoElement.html ();

    $('li.carousel-item').mouseenter (function () {
      var item = This.opts.items[$(this).index()];
      var infoHtml = '<h2>' + item.title + '</h2>';

      if (item.author) {
        infoHtml += '<p>By ' + item.author + '</p>';
      }

      if (item.description) {
        infoHtml += '<p>' + item.description + '</p>';
      }

      This.infoElement.html (infoHtml);
    });

    this.carouselElement.mouseleave (function () {
      This.infoElement.html (This.infoElementDefault);
    });
  }

  // now start auto-scroll if enabled
  if (this.opts.auto) {
    setInterval (function () {
        This.scrollItems (This.opts.direction);
    }, this.opts.interval);
  }
}


Carousel.prototype.calculateWidths = function () {
  var scrollWidth = 0;
  var carouselElementWidth = 0;
  var linkWidths = this.prevLink && this.nextLink ? this.prevLink.outerWidth (true) + this.nextLink.outerWidth (true) : 0;

  this.carouselWrapper.css ('width', (this.opts.width - linkWidths) + 'px');

  if (this.opts.displayInfo && !this.opts.customInfoElement) {
    this.infoElement.css ('width', (this.opts.width - linkWidths) + 'px');
  }

  for (var i = 0; i < this.items.length; ++i) {
    // width is set to auto, so we need to set the height first
    // this is so that the user can add border / padding etc and the images will still display correctly
    var itemImg = this.items[i].find ('img');
    var itemExtraHeight = itemImg.outerHeight(true) - itemImg.height ();
    itemImg.css ('height', (this.opts.height - itemExtraHeight) + 'px');

    // now calculate widths
    var itemWidth = this.items[i].outerWidth (true);
    carouselElementWidth += itemWidth;
    scrollWidth += itemWidth;

    // minus the right margin cos we don't wanna count whitespace
    // won't work if margin/padding is applied to child instead but it just means we'll be 1 item behind, no biggie
    if (scrollWidth - this.opts.spacing > this.carouselWrapper.width ()) {
      this.leftPositions.push (1 - (carouselElementWidth - itemWidth));   // add 1 to avoid potential borders being chopped
      scrollWidth = itemWidth;
    }
  }

  this.carouselElement.css ('width', ++carouselElementWidth + 'px');

  // if last few items are not as wide as the container, restrict the scroll distance
  if (carouselElementWidth + this.leftPositions[this.leftPositions.length-1] < this.carouselWrapper.width ()) {
    this.leftPositions[this.leftPositions.length-1] = 0 - (carouselElementWidth - this.carouselWrapper.width ());
  }
}


Carousel.prototype.scrollItems = function (direction) {
  if (this.opts.auto && this.hover) {
    return;
  }

  if (typeof direction == 'undefined' || (direction != 'left' && direction != 'right')) {
    this.leftPositionIndex = 0;
  }
  else if (direction == 'left') {
    this.leftPositionIndex = (this.leftPositionIndex > 0 ? this.leftPositionIndex - 1 : this.leftPositions.length - 1);
  }
  else if (direction == 'right') {
    this.leftPositionIndex = (this.leftPositionIndex < this.leftPositions.length - 1 ? this.leftPositionIndex + 1 : 0);
  }

  this.carouselElement.animate ({
      left: this.leftPositions[this.leftPositionIndex] + 'px'
  });
}


Carousel.prototype.keyHandler = function (e) {
  var This = e.data.This;

  if (e.keyCode == 37) {
    e.preventDefault ();
    This.scrollItems ('left');
  }
  else if (e.keyCode == 39) {
    e.preventDefault ();
    This.scrollItems ('right');
  }
}


Carousel.prototype.getItemsFromFeed = function (url) {
  var This = this;
  var feed = new google.feeds.Feed (url);

  feed.setResultFormat (google.feeds.Feed.MIXED_FORMAT);
  feed.setNumEntries (this.opts.maxEntries);

  feed.load (function (result) {
    if (!result.error) {
      for (var i = 0; i < result.feed.entries.length; ++i) {
        var entry = result.feed.entries[i];

        This.opts.items.push ({
          title:  entry.title,
          href:   entry.link,
          src:    This.getImageLink (google.feeds.getElementsByTagNameNS (entry.xmlNode, 'http://www.w3.org/2005/Atom', 'link'))
        });
      }
    }
    else {
      juice.debugOutln ('ERROR: ' + result.error);
    }

    This.initCarousel ();
  });
}


Carousel.prototype.getImageLink = function (elements) {
    for (var i = 0 ; i < elements.length; ++i) {
      if (elements[i].getAttribute ('rel') == 'image') {
          return elements[i].getAttribute ('href');
      }
    }

    return '';
}