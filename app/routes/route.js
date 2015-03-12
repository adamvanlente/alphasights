// ******************************************
// ******************************************
// Main route handler.
// __________________________________________
// __________________________________________

// Helper library for making ajax requests.
var najax = require('najax');

// Export the following routes to the app.
module.exports = function(app, passport) {

	//-------------------------------------
	//-------------------------------------
	// HOME PAGE ROUTE --------------------
	// ------------------------------------
	//-------------------------------------
	app.get('/', function(req, res) {

			// Render something to a jade template.
			res.render('index.jade');
	});

	//-------------------------------------
	//-------------------------------------
	// RESPONSE TIME JSON ROUTE -----------
	// ------------------------------------
	//-------------------------------------
	app.get('/responseTime/:site', function(req, res) {

			// Get site name from the request params.
			var site = req.params.site;
			var fullUrl = site;

			if (fullUrl.search('http://') == -1) {
				fullUrl = 'http://' + fullUrl;
			}

			// Set a start time to see how response a site is.
			var startTime = (new Date()).getTime();

			// Make a request to the site and then report the response time.
			najax({
				url: fullUrl,
				success: function(html) {
					returnResponseTime(startTime, site, true, res);
				},
				error: function(e) {
					returnResponseTime(startTime, site, false, res);
				}
			});
	});
};

// Helper function for returning response time.
function returnResponseTime(startTime, url, success, res) {

	// Set end and response times.
	var endTime = (new Date()).getTime();
	var responseTime = endTime - startTime;

	// Return json with details.
	res.json({
		site: url,
		success: success,
		response_time: responseTime
	});
}
