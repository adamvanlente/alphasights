/**
 * This script takes a list of websites (siteList), pings each one, and
 * fetches json detailing the response time/success of the ping.  It then
 * creates dom elements to represent how long the pings took in milliseconds.
 * The page then repeats the process every 60 seconds.
 */

// Create a namespace for this project, rt for ResponseTime.
var rt = {

  // Base url for requesting response time of a url.
  responseTimeRequestUrl: '/responseTime/',

  // List of sites for which to check response time.
  siteList: [
    'hardgraft.com',
    'theverge.com',
    'retroduck.com',
    'houseind.com'
  ],

  // Colors that will indicate length of reponse time.
  colorIndex: [
    '#97CA51', // Intentionally giving 0 & 1 indexes the same value.
    '#97CA51',
    '#A5BC4F',
    '#D2C652',
    '#D1AD52',
    '#CD9654',
    '#CB7255',
    '#CC5A58',
    '#B84445',
    '#A33333',
    '#772020'
  ],

  // Max radius of a svg circle.
  MAX_RADIUS: 100,

  // Constants for animating a svg circle.
  ANIMATE_CIRCLE_DURATION: 2000,
  ANIMATE_CIRCLE_DELAY: 100,

  /**
   * Initialzing function
   * @function that creates some dom elements and loads site information.
   * @param createElements BOOL true/false create dom elements.
   *
   */
  init: function(createElements) {

    // Iterate over the siteList array.
    for (var i = 0; i < rt.siteList.length; i++) {

      // Site name.
      var site = rt.siteList[i];

      // Create a dom element for each site.
      if (createElements) {
        var selector = site.replace('.', '');
        $('.responseTimes')
          .append($('<span>')
            .attr('class', 'responseTimes--siteDetails')
            .attr('id', selector));
      }

      // Make a request to the site and get the response time.
      rt.getSiteResponseTime(site);
    }

  },

  /**
   * Get site response time.
   * @function that iterates over all urls in the siteList, and renders a
   *           response time dom element for each.
   * @param site String domain name of website to ping for a response.
   *
   */
  getSiteResponseTime: function(site) {

    // Define the request url.
    var requestUrl = rt.responseTimeRequestUrl + site;

    // Get the response time of the site.
    $.ajax({
      url: requestUrl,
      success: function(json) {

        // Send the json to a function that will render the information.
        rt.renderResponseTimeElement(json);
      },
      error: function(e) {

        // Log an error - something is very wrong.
        console.log('something is wrong with our server', e);
      }
    });
  },

  /**
   * Render an element in the DOM that shows how long a site's response time is.
   * @function that renders an element on the page showing how long it took to
   *           receive a response from a site.
   * @param siteDetails Object json data returned from site request.
   *
   */
   renderResponseTimeElement: function(siteDetails) {

     // Create a selector string.  Eg, takes retroduck.com, turns it into
     // retroduckcom and uses it as the id for an element.
     var selector = siteDetails.site.replace('.', '');

     // See if a dom element for the current site exists.
     var el = $('#' + selector);

     // If no element exists, append one and recursively run this function.
     // TODO the intention of this if statement is to accomodate the addition
     //      of new sites after the page has loaded. No funcitonality has
     //      been added to allow this in the UI; but it would be nice to add it.
     if (el.length == 0) {
       $('.responseTimes')
         .append($('<span>')
           .attr('class', 'responseTimes--siteDetails')
           .attr('id', selector));

       rt.renderResponseTimeElement(siteDetails);
     } else {

       // Set a label with the name of the site.
       rt.setSiteDetailsLabel(el, siteDetails);

       // Set a svg circle representing the load time of the site.
       rt.createSvgCircleForResponseTime(selector, siteDetails.response_time);

       // Indicate the response time length and last time it was checked.
       rt.showResponseTimeAndLastUpdate(selector, siteDetails.response_time);
     }
   },

   /**
    * Set a label with the site name.
    * @function that grabs the site name from the json response and appends
    *           a label to the site's dom element.
    * @param el Object dom element to append to.
    * @param siteDetails Object json response from server.
    *
    */
   setSiteDetailsLabel: function(el, siteDetails) {

     // Empty the holder of any existing content.
     el.html('')

      // Append a label for the site name.
      .append($('<label>')
        .attr('class', 'responseTimes--siteDetails__siteName')
        .html(siteDetails.site));
   },

   /**
    * Create an SVG circle to represent response time.
    * @function that creates and svg holder, an svg circle, and kicks off a
    *           helper function that animates the circle to show response time.
    * @param selector String id of dom element to select & append to.
    * @param ms Int response time in milliseconds.
    *
    */
   createSvgCircleForResponseTime: function(selector, ms) {

      // Create a container for the svg.
      var svgContainer =
          d3.select('#' + selector).append('svg')
            .attr('width', (rt.MAX_RADIUS * 2))
            .attr('height', (rt.MAX_RADIUS * 2));

      // Create a small circle that we can animate.
      var circle =
          svgContainer.append('circle')
            .attr('cx', rt.MAX_RADIUS)
            .attr('cy', rt.MAX_RADIUS)
            .attr('r', 2)
            .attr('fill', '#DCDCDC');

      // Now that circle exists, animate it show response time.
      rt.animateSvgCircle(circle, ms);
   },

   /**
    * Animate an SVG circle.
    * @function that accepts a circle and response time in milliseconds, then
    *           updates the size of the circle based on response time.
    * @param circle Object svg dom element for a circle
    * @param ms Int response time in milliseconds.
    *
    */
   animateSvgCircle: function(circle, ms) {

     // Get response time and create a radius.  Radius is somewhat arbitrary,
     // and has been tweaked based on the limitation of a 100px max radius
     // represented in the UI.  The radius cannot be larger than 100px, so
     // some measurements will simply say "greater than 1 second".
     var newRadius = ms / 4;
     newRadius = newRadius > rt.MAX_RADIUS ? rt.MAX_RADIUS : newRadius;

     // Create a color to indicate how long it took.
     var responseTimeColorIndex = parseInt(newRadius / 10);
     var fillColor = rt.colorIndex[responseTimeColorIndex];

     // Apply changes to the circle.
     circle
      .transition()
      .duration(rt.ANIMATE_CIRCLE_DURATION)
      .delay(rt.ANIMATE_CIRCLE_DELAY)
      .attr('r', newRadius)
      .attr('fill', fillColor);
   },

   /**
    * Create two labels that display response time and last update.
    * @function that appends two labels to a site's dom element; one that shows
    *           the response time, and one that shows the last time response
    *           time was fetched.
    * @param selector String id of dom element to append labels to
    * @param ms Int response time in milliseconds
    *
    */
   showResponseTimeAndLastUpdate: function(selector, ms) {

     // Create a string for the elapsed time.
     var responseString = ms + ' milliseconds';
     if (parseInt(ms) >= 1000) {
       responseString = 'more that 1 second';
     }
     responseString = 'Response: ' + responseString;

     // Create a string for the last updated time.
     var lastUpdate = String(new Date()).split('GMT')[0];
     var lastUpdateString = 'last updated ' + lastUpdate;

     // Append the two labels to the site element.
     $('#' + selector)
       .append($('<label>')
         .attr('class', 'responseTimes--siteDetails__responseTime')
         .html(responseString))
       .append($('<label>')
         .attr('class', 'responseTimes--siteDetails__lastUpdate')
         .html(lastUpdateString));
   }
};

// Kick off the init function when this script loads.
rt.init(true);

// Run the initializing function again every 60 seconds.
setInterval(function() {
  rt.init();
}, 60000)
