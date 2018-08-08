// ------------------------
// Primary file for the API
//-------------------------

// Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

// The HTTP server should respond to all requests with a string
const httpServer = http.createServer((req, res) => {
  
  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true);

  // Get the path
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');  // Trims off the slashes from both sides
                                                            // (Helps us to handle requests to /foo and /foo/ equally.)

  // Get the query string as an object
  const queryStringObject = parsedURL.query;

  // Get the HTTP method
  const method = req.method.toUpperCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get payload, if any exists
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => buffer += decoder.write(data));
  
  req.on('end', () => {
    buffer += decoder.end()

    // Send the response
    res.end(`Hello World!\n`);

    // Log the request payload
    console.log(`Request recieved with this payload: ${buffer}`);
  });

});


// Start the HTTP server and have it listen on port 3000
httpServer.listen(3000, () => console.log(`The HTTP server is listening on port 3000...`));
