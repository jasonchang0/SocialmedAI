//AMAZING INSTAGRAM SCRAPER
(function ($){
  $.fn.igjs = function(options) {
    let t = this;
    let settings = $.extend({
      // These are the default settings
        user: 'instagram',
        posts: 12,
        perRow: 4,
        info: true,
        bootstrap: false
    }, options );

    // Scrapes the html from user page via cors proxy and parses it into meaningful json (currently hardcoded to append bootstrap formatted images)
    function getPosts(user, postCount, perRow, el) {
      let $this = {
        posts: []
      }
      columns = 12 / perRow;
      $.getJSON('https://allorigins.me/get?url=' + encodeURIComponent('https://instagram.com/' + user + '/'), function (data) { // get the html
      let posts = JSON.parse(data.contents.split('window._sharedData = ')[1].split('\;\<\/script>')[0]).entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges //parse the html into array of posts
        posts.forEach(function (e, i) { // cycle through posts and create presentation html for each one
          $this.posts.push(e)
          if (i < postCount) {
          var src = e.node.thumbnail_resources[0].src;
          var likes = e.node.edge_liked_by.count;
          var caption = e.node.edge_media_to_caption.edges[0];
          if(caption == undefined) {
            caption = "";
          } else {
            caption = caption.node.text;
          }
          caption = caption.replace(/(\r\n\t|\n|\r\t)/gm,"");
          caption = caption.replace(/'/g, "&apos;");
          caption = caption.replace(/"/g, "&quot;");
          var cutoffcaption = caption;
          var rank = Math.random()*20-10;

          var clarifai_ranks = ['have', 'passage', 'structure', 'apple', 'unlikely', 'patient', 'spray', 'comedy', 'grain', 'cousin'];
          var hashtag_ranks = ['#have', '#passage', '#structure', '#apple', '#unlikely', '#patient', '#spray', '#comedy', '#grain', '#cousin'];

          var success = "success";
          if(rank < 0) {
            success = "poor";
          }

          tempRank = rank;
          if(Math.abs(rank) < 3) {
            tempRank = 3;
            if(rank < 0) {
              tempRank*=-1;
            }
          }

          if(caption.length > 400) {
            cutoffcaption = caption.substr(0, 400) + "...";
          }
          var comments = e.node.edge_media_to_comment.count;
          // var date = e.node.taken_at_timestamp;
          el.append("<div class='col-md-3 ig-img-wrap ig-post-outer'\
                      onclick=\"showMoreInfo('"+e.node.thumbnail_resources[4].src+"', '"+comments+"', '"+cutoffcaption+"', '"+likes+"', '"+rank+"', '"+clarifai_ranks+"', '"+hashtag_ranks+"');\">\
                      <img alt='Instagram Photo " + (i + 1) + "' class='img-responsive ig-img ig-img-" + (i + 1) + "' src='" + e.node.thumbnail_src + "'>\
                      <h2>"+likes+" likes | "+comments+" comments</h2>\
                      <div class='ranking-outer'>\
                      <div class='bar-outer'>\
                        <div class='bar "+success+" inactive' style='transform: scaleX("+((tempRank)/10).toPrecision(2)+");'><p style='transform: scaleX("+1/(((tempRank)/10).toPrecision(2))+");'>"+rank.toPrecision(2)+"</p></div>\
                      </div>\
                      </div>\
                      <p>"+cutoffcaption+"</p>\
                      </div>");
          }
          $(".inactive").removeClass("inactive");
        });
      });
      return $this.posts
    }
    getPosts(settings.user, settings.posts, settings.perRow, t);
    return t;
  }
}(jQuery));

var startLoading = function() {
  $(".initial-stats, #instafeed").addClass("loading");
  $("#loading").removeClass("loading");
}
var finishLoading = function() {
  $(".initial-stats, #instafeed").removeClass("loading");
  $("#loading").addClass("loading");
}

var xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200];
var yAxis = [1, 0, 1, 0, 1, 2, 1, 0, 1, 2, 3, 4, 5, 4, 5, 6, 7, 6, 7, 6, 7, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 25, 26, 27, 26, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 36, 35, 36, 37, 38, 37, 38, 39, 38, 39, 40, 39, 38, 37, 38, 39, 40, 41, 40, 39, 38, 37, 38, 37, 38, 39, 40, 41, 42, 43, 44, 45, 44, 45, 44, 43, 44, 45, 46, 47, 46, 45, 46, 47, 48, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 57, 58, 59, 60, 61, 62, 61, 62, 63, 64, 65, 66, 65, 66, 67, 68, 69, 70, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 78, 79, 80, 81, 82, 83, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 93, 92, 93, 92, 91, 92, 93, 94, 95, 94, 95, 96, 97, 96, 97, 98, 97, 98, 99, 100, 101, 100, 101, 100, 101, 102, 103, 104, 103, 102, 101, 102, 103, 104, 103, 103];
var currSentiment = "cats";

var showGraph = function(sentiment, xData, yData) {
  $("#myChart").remove();

  $("#post-outer").prepend('<canvas id="myChart" width="'+$("#post-outer").width()+'px" height="'+$("#post-outer").height()+'px" class="invisible"></canvas>');
  $("#myChart").removeClass("invisible");

  var ctx = document.getElementById("myChart").getContext('2d');

  $("#post-left, #post-right").addClass("invisible");
  $("#post-display-outer, #myChart").removeClass("invisible");

  var currSentiment = sentiment;

  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
      labels: xData,
      datasets: [{
          data: yData,
          label: currSentiment,
          borderColor: "#51B2B2",
          backgroundColor: "#59C3C3",
          fill: true
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Cumulative sentiment of '+currSentiment,
        defaultFontFamily: "'Futura', 'helvetica', 'Arial', 'sans-serif'",
        fontFamily: "'Futura', 'helvetica', 'Arial', 'sans-serif'",
        fontColor: '#59C3C3'
      },
      legend: {
        display: false,
        labels: {
            defaultFontFamily: "'Futura', 'helvetica', 'Arial', 'sans-serif'",
            fontFamily: "'Futura', 'helvetica', 'Arial', 'sans-serif'",
            fontColor: '#59C3C3'
          }
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            defaultFontFamily: "'Futura', 'helvetica', 'Arial', 'sans-serif'",
            fontFamily: "'Futura', 'helvetica', 'Arial', 'sans-serif'",
            fontColor: '#59C3C3',
            labelString: 'cumulative sentiment'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            defaultFontFamily: "'Futura', 'helvetica', 'Arial', 'sans-serif'",
            fontFamily: "'Futura', 'helvetica', 'Arial', 'sans-serif'",
            fontColor: '#59C3C3',
            labelString: 'post number (out of last 200)'
          },
          ticks: {
            min: 0,
            max: 200,
            autoSkip: true,
            maxTicksLimit: 3
          }
        }]
      },
      responsive: false
    }
  });
}

var hideGraph = function() {
  $("#myChart, #post-display-outer, #post-left, #post-right").addClass("invisible");
}


var addContent = function() {
  // startLoading();
  // $("#instafeed").html("");
  // $('#instafeed').igjs({
  //     user: username.toLowerCase()
  // });
  // setTimeout(function() {
  //   finishLoading();
  // }, 2000);

  console.log("loading...");

  $("#instafeed, .canvas").html("");
  username = $("input[name='account']").val().toLowerCase();
  if(username[0] == "@") {
    username = username.substr(1);
  }
  startLoading();
  $.get( "http://35.237.80.248/analyze/"+username, function( data ) {
    finishLoading();
    console.log("done loading!")
    console.log(data);

    var posts = data.image_analysis;

    function shadeColor2(color, percent) {
      var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
      return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }

    var trending_hash_length = Math.floor(data.trending_hashtag_image.length/2);
    if(trending_hash_length > 10) {
      trending_hash_length = 10;
    }
    for(var i = 0; i < trending_hash_length; i++) {
      var weight = 10-i;
      $(".clarifai-canvas").append("<p class='data' style='\
                  transform: scale("+(1+Math.abs(weight)/(trending_hash_length+4)).toPrecision(2)+");\
                  color: "+shadeColor2("#59C3C3", -((weight-trending_hash_length)/15))+";\
                  top: "+(90-Math.pow(weight, 1.2)*5.5)+"%;\
                  left: "+5+"%;'>\
                  "+data.trending_hashtag_image[i]+"</p>");
    }
    var clarifaiSize = data.trending_hashtag_image.length;
    for(var i = 0; i < trending_hash_length; i++) {
      var weight = 10-i;
      $(".clarifai-canvas").append("<p class='data' style='\
                  transform: scale("+(1+Math.abs(weight)/(trending_hash_length+4)).toPrecision(2)+");\
                  color: "+shadeColor2("#F45B69", ((trending_hash_length-weight)/15))+";\
                  top: "+(90-Math.pow(weight, 1.2)*5.5)+"%;\
                  left: "+55+"%;'>\
                  "+data.trending_hashtag_image[clarifaiSize - i - 1]+"</p>");
    }

    var trending_text_length = Math.floor(data.trending_hashtag.length/2);
    if(trending_text_length > 10) {
      trending_text_length = 10;
    }
    for(var i = 0; i < trending_text_length; i++) {
      if(data.trending_hashtag[i] == "n't") data.trending_hashtag[i] = "nt";
      var weight = 10-i;
      $(".tags-canvas").append("<p class='data' style='\
                  transform: scale("+(1+Math.abs(weight)/(trending_text_length+4)).toPrecision(2)+");\
                  color: "+shadeColor2("#59C3C3", -((weight-trending_text_length)/15))+";\
                  top: "+(90-Math.pow(weight, 1.2)*5.5)+"%;\
                  left: "+5+"%;'>\
                  "+data.trending_hashtag[i]+"</p>");
    }
    var tagsSize = data.trending_hashtag.length;
    for(var i = 0; i < trending_text_length; i++) {
      var weight = 10-i;
      if(data.trending_hashtag[i] == "n't") data.trending_hashtag[i] = "nt";
      $(".tags-canvas").append("<p class='data' style='\
                  transform: scale("+(1+Math.abs(weight)/(trending_text_length+4)).toPrecision(2)+");\
                  color: "+shadeColor2("#F45B69", ((trending_text_length-weight)/15))+";\
                  top: "+(90-Math.pow(weight, 1.2)*5.5)+"%;\
                  left: "+55+"%;'>\
                  "+data.trending_hashtag[tagsSize - i - 1]+"</p>");
    }


    for (var key in posts) { // cycle through posts and create presentation html for each one
      var post = posts[key];
      var src = post.image_url;
      var likes = post.likes;
      var caption = post.text;

      var misalignment = post.misalignment;

      console.log(post.misalignment);

      if(caption == undefined) {
        caption = "";
      }

      var cutoffcaption = caption;
      if(caption.length > 400) {
        cutoffcaption = caption.substr(0, 400) + "...";
      }

      cutoffcaption = cutoffcaption.replace(/(\r\n\t|\n|\r\t)/gm,"");
      cutoffcaption = cutoffcaption.replace(/"/g, "&quot;");
      cutoffcaption = cutoffcaption.replace(/'/g, "\\\'");
      var rank = post.score;

      var clarifai_ranks = post.image_keywords;
      var hashtag_ranks = post.text_keywords;

      var success = "success";
      if(rank < 0) {
        success = "poor";
      }

      tempRank = rank;
      if(Math.abs(rank) < 3) {
        tempRank = 3;
        if(rank < 0) {
          tempRank*=-1;
        }
      }
      var comments = post.comments;

      if(hashtag_ranks.length > 2) {
        console.log(hashtag_ranks);
        hashtag_ranks = hashtag_ranks.join(", ");
        hashtag_ranks.replace("n't", "");
        hashtag_ranks = hashtag_ranks.split(", ");
        console.log(hashtag_ranks);
      }

      console.log(hashtag_ranks);
      // var date = e.node.taken_at_timestamp;
      $("#instafeed").prepend("<div class='col-md-3 ig-img-wrap ig-post-outer'\
                  onclick=\"showMoreInfo('"+src+"', '"+comments+"', '"+cutoffcaption+"', '"+likes+"', '"+rank+"', '"+clarifai_ranks+"', '"+hashtag_ranks+"', '"+misalignment+"');\">\
                  <img alt='Instagram Photo "+key+"' class='img-responsive ig-img ig-img-"+key+"' src='" + src + "'>\
                  <h2>"+likes+" likes | "+comments+" comments</h2>\
                  <div class='ranking-outer'>\
                  <div class='bar-outer'>\
                    <div class='bar "+success+" inactive' style='transform: scaleX("+((tempRank)/10).toPrecision(2)+");'><p style='transform: scaleX("+1/(((tempRank)/10).toPrecision(2))+");'>"+rank.toPrecision(2)+"</p></div>\
                  </div>\
                  </div>\
                  <p>"+cutoffcaption.replace(/\\\'/g, "\'")+"</p>\
                  </div>");
      }
      $(".inactive").removeClass("inactive");
    });
}


$(document).ready(function() {
  if (window.location.protocol == 'https:') {
    alert("You're currently on https:// protocol. Please use http:// (yes, we know) to analyze posts.");
    // window.location = 'http://' + window.location.hostname + window.location.pathname + window.location.hash;
  }

  $(window).resize(hideGraph);
  for(var i = 0; i < 15; i++) {
    $(".cool-divs").append("<div class='cool-div'\
                            style='transform: rotate("+Math.random()*360+"deg) scaleX(1);\
                                  animation-delay: "+Math.random()*2+"s;\
                                  top: "+Math.random()*70+"%;\
                                  left: "+Math.random()*100+"%;\
                                  height: "+(Math.random()*150+100)+"px;\
                                  width: "+(Math.random()*500+100)+"px'></div>");
  }

  $(".inactive").removeClass("inactive");

  // $('#instafeed').igjs({
  //     user: 'noahfiner'
  // });

  $("#hamburger-outer").click(function() {
    $("#hamburger-outer, #header-right").toggleClass("expanded");
  });

  $(window).scroll(function() {
    if(window.scrollX > 0) {
      window.scrollTo(0, $(window).scrollTop());
    }
    $("#hamburger-outer, #header-right").removeClass("expanded");
  });

  $(window).resize(function() {
    $("#hamburger-outer, #header-right").removeClass("expanded");
  });

  $("input[name='instagram-search']").click(function() {
    addContent();
  })

  $("input[name='account']").keypress(function (e) {
    if (e.which == 13) {
      addContent();
      return false;
    }
  });

  function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }
  //
  // var updateData = function(data) {
  //   data = {
  //        'clarifai': ['ignorance', 'welfare', 'hear', 'negligence', 'art', 'factor', 'sister', 'conflict', 'ray', 'corpse', 'crowd', 'entertainment', 'litigation', 'pile', 'wound', 'session', 'witch', 'curriculum', 'disappear', 'invite', 'motorcycle', 'century', 'willpower', 'squash', 'consensus', 'deny', 'discover', 'earthwax', 'cow', 'kick', 'flat', 'pavement', 'bell', 'taste', 'rise', 'hardware', 'disposition', 'salesperson', 'make'],
  //        'tags': ['#fisherman', '#knock', '#emergency', '#systematic', '#comment', '#fear', '#steel', '#tract', '#soul', '#elaborate', '#margin', '#culture', '#continuation', '#turn', '#warrant', '#climate', '#agenda', '#stamp', '#shake', '#ring', '#freedom', '#tissue', '#suburb', '#dirty', '#habit', '#hypnothize', '#violation', '#twitch', '#noble', '#wheel', '#yard', '#basic', '#stride', '#sunshine', '#paint', '#respect', '#bland', '#linear', '#guard', '#unique']
  //     }
  //
  //
  // }
  //
  // updateData();

  $("#post-display-outer, #post-close").click(function() {
    $("#post-display-outer").addClass("invisible");
  });

  $('#post-outer:not(#post-close)').click(function(event){
    event.stopPropagation();
  });

  //client ID: 57f248212b774817a5fc69380cc19db2
  //client secret: 64f78eae0ca44734be6bb1f8d69e6f9f

});

var showMoreInfo = function(src, comments, caption, likes, rank, clarifai_ranks, hashtag_ranks, misalignment) {
  $("#post-img").attr("src", src);
  $("#post-comments").html(comments);
  $("#post-caption").html(caption.substr(0, 150)+"...");
  $("#post-likes").html(likes);

  var cutoff = 2;
  if(window.innerWidth < 991) {
    cutoff = 3.5;
  }

  tempRank = rank;
  if(Math.abs(rank) < cutoff) {
    tempRank = cutoff;
    if(rank < 0) {
      tempRank *= -1;
    }
  }

  $("#analysis-info > .ranking-outer > .bar-outer > .bar").css("transform", "scaleX("+((tempRank)/10).toPrecision(2)+")");
  $("#analysis-info > .ranking-outer > .bar-outer > .bar > p").css("transform", "scaleX("+1/((tempRank)/10).toPrecision(2)+")");
  $("#analysis-info > .ranking-outer > .bar-outer > .bar > p").html(parseFloat(rank).toPrecision(2));

  hashtag_ranks = hashtag_ranks.replace(/'/g, "");
  hashtag_ranks = hashtag_ranks.replace(/\'/g, "");

  clarifai_ranks = clarifai_ranks.replace(/'/g, "");
  clarifai_ranks = clarifai_ranks.replace(/\'/g, "");

  var clarifai_length = clarifai_ranks.length;
  var hashtag_length = hashtag_ranks.length;
  var clarifai_split = 5;
  var hashtag_split = 5;
  if(clarifai_length < 5) {
    clarifai_split = clarifai_length;
  }
  if(hashtag_length < 5) {
    hashtag_split = hashtag_length;
  }

  if(rank < 0) {
    $("#analysis-info > .ranking-outer > .bar-outer > .bar, #analysis-info > .ranking-outer > h5").removeClass("success").addClass("poor");
    $("#analysis-info").removeClass("success").addClass("poor");

    $("#post-header").html("most negatively influential photo attributes (with Clarifai)");
    $("#hash-header").html("most negatively influential keywords in caption");

    clarifai_ranks = clarifai_ranks.split(",").reverse().slice(0, clarifai_split);
    hashtag_ranks = hashtag_ranks.split(",").reverse().slice(0, hashtag_split);

    for(var i = 0; i < hashtag_ranks.length; i++) {
      hashtag_ranks[i] = hashtag_ranks[i].replace(/'/g, "");
      hashtag_ranks[i] = hashtag_ranks[i].replace(/\'/g, "");
    }

    console.log(misalignment);
    if(misalignment == "true" && misalignment !== "false") {
      $("#misaligned-header").html("caption theme IS NOT aligned with photo content");
    } else {
      $("#misaligned-header").html("caption theme IS aligned with photo content");
    }

    $("#post-success").html("");
    $("#hash-success").html("");
    if(clarifai_ranks.length > 1) {
      $("#post-success").html("<strong>MOST</strong> - "+clarifai_ranks.join(" | ")+" - <strong>LEAST</strong>");
    }
    if(hashtag_ranks.length > 1) {
      $("#hash-success").html("<strong>MOST</strong> - "+hashtag_ranks.join(" | ").replace(/'/g, "")+" - <strong>LEAST</strong>");
    }
  } else {
    $("#analysis-info > .ranking-outer > .bar-outer > .bar, #analysis-info > .ranking-outer > h5").addClass("success").removeClass("poor");
    $("#analysis-info").addClass("success").removeClass("poor");

    $("#post-header").html("most positively influential photo attributes (with Clarifai)");
    $("#hash-header").html("most positively influential keywords in caption");

    clarifai_ranks = clarifai_ranks.split(",").slice(0, clarifai_split);
    hashtag_ranks = hashtag_ranks.split(",").slice(0, hashtag_split);

    for(var i = 0; i < hashtag_ranks.length; i++) {
      hashtag_ranks[i] = hashtag_ranks[i].replace(/'/g, "");
      hashtag_ranks[i] = hashtag_ranks[i].replace(/\'/g, "");
    }

    $("#post-success").html("");
    $("#hash-success").html("");
    if(clarifai_ranks.length > 1) {
      $("#post-success").html("<strong>MOST</strong> - "+clarifai_ranks.join(" | ")+" - <strong>LEAST</strong>");
    }
    if(hashtag_ranks.length > 1) {
      $("#hash-success").html("<strong>MOST</strong> - "+hashtag_ranks.join(" | ").replace(/'/g, "")+" - <strong>LEAST</strong>");
    }
  }

  $("#myChart").addClass("invisible");
  $("#post-display-outer, #post-left, #post-right").removeClass("invisible");
}
