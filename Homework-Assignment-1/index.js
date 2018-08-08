// ------------------------
// Primary file for the API
//-------------------------

// Dependencies
const http = require('http');
const url = require('url');

// The HTTP server should respond to all requests with a string
const httpServer = http.createServer((req, res) => {
  
  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true);

  // Get the path
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');  // Trims off the slashes from both sides
                                                            // (Helps us to handle requests to /foo and /foo/ equally.)

  // Get the HTTP method
  const method = req.method.toUpperCase();
  
  // Send the response
  res.end(`Hello World!\n`);

  // Log the request path
  console.log(`A ${method} request was received on path: ${trimmedPath}`);

});


// Start the HTTP server and have it listen on port 3000
httpServer.listen(3000, () => console.log(`The HTTP server is listening on port 3000...`));
