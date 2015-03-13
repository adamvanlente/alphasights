## Coding Challenge for AlphaSights.
https://gist.github.com/davegriffiths/0f9c0cbca64b20c862a5

### Solution
You can view a live demo of my solution here: http://198.199.111.18:3333/

My solution is stored in a github repo: https://github.com/adamvanlente/alphasights.

	// Important Javascript files
	app/routes/route.js
	client-javascripts/script.js

	// All Sass styles
	client-sass/

	// Configuration
	app.js
	gulpfile.js
	package.json


### About My Solution

In order to complete this project, I cloned a node/express app I use for creating quick projects (https://github.com/adamvanlente/basic-express-app/tree/testing).  The first step in making this decision was deciding that I would get response time by making a simple ajax call.  Since cross-domain requests will fail, I decided that using a server was the quickest way to get it done.  One downside is that the app is a bit heavy for performing such a small task.

For the requirements that response time be represented with a shape that can change color and size, SVG shapes seemed like the correct solution.


### How it works

This page takes a hard coded list of websites and pings each one to get a response time.  It does so using an endpoint I've created, which accepts a site url (eg http://198.199.111.18:3333/responseTime/google.com) and returns json that looks like this:

	{
    "site": "google.com",
	  "success": true,
		"response_time": 37
	}
Then, on the front end, the sites are repeatedly pinged every 60 seconds, and the response time is indicated by circles.  These circles are SVG elements that change color and size based on the response time.

### Libraries and technology
I used a node app that I keep handy for small projects or proof-of-concepts.  This app is easily cloned, and has different branches (one simple one, one that includes unit testing setup, and one that has an O-auth flow baked in).  This is my favorite way to get a node app up and running  in a few minutes, especially if I need restful endpoints for displaying json.

My node app uses Sass for compiled css, Jade as a templating engine, and Gulp is my preferred flavor of asset management/task running.

I also use D3.js and Jquery on the front end.  Jquery for the dom manipulation, and D3 for quickly creating SVG elements.

### Stretch goals

I did not spend much time refining how time was represented by the circles.  Had this been a genuine project, of course much time would have been invested into discussing exactly how to best represent the data.

Now that it is complete, I would like to see 12 or so sites.  If I had a bit more time I would rearrange the page elements so that there were more sites listed on the page.

I also wanted to allow the user to edit the list of sites and customize the refresh interval (currently every 60 seconds).
