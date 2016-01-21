var fs = require('fs');
var parseString = require('xml2js').parseString;
var http = require('http');
var body = '';
var filename = '';
var links = [];

/*
Author:  Damien Beard
Date:    21st January, 2016

Purpose: This module reads in a file 'xmls.txt' that contains a single URL on each line,
         where each URL points to an XML document. It converts each XML document to a JSON
         file, and outputs them to the 'jsons' directory. 
         
To run:  Make sure you have node installed, and include the xml2js library:
             $ npm install xml2js
         To run:
             $ node run_me.js
*/

// Put an '@' symbol before attribute names to identify them
function addAt(name){
	return "@"+name;
}

//Get the domain name of the URL for file naming
function extractDomain(url) {
    var domain, domainParts;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //Remove the sub-domain and top-level domain
    domainParts = domain.split('.');
    domain = domainParts[domainParts.length - 2]

    return domain;
}

function writeJSON(link, i, arr){
	
	// Do a HTTP 'GET' request for the given link
	http.get(link, (res) => {
	      // Concat body chunks, essentially reconstructing the body.
		  res.on("data", function(chunk) {
			console.log("BODY: " + chunk); body += chunk;
		  });

		  res.on("end", function () {
		     // Parse the XML through to a Javascript object
			 parseString(body, {
				 attrNameProcessors: [addAt],
				 mergeAttrs: true,
				 explicitArray: false,
				 charkey: "#text"
			 }, function (err, result) {
               if (err) console.log("Error!!!"+err); 
			   console.dir(JSON.stringify(result));
               
			   filename = "jsons/" + i + "_" + extractDomain(link) + ".json";
			   // Write the Javascript object to file, by turning it into a JSON object
			   fs.writeFile(filename, JSON.stringify(result), function(err) {
				   if(err) {
						return console.log(err);
					}
					console.log("The file "+ filename + " was saved! ");
					body = '';  //Reset body variable
					
					//Write the next file, if appropriate
					if (i+1 < arr.length) writeJSON(arr[i + 1], i + 1, arr);
				}); 
            });
		  })
	});
};


// Read in 'xmls.txt', and create a JSON file for the XML found at each URL
fs.readFile('xmls.txt', 'utf8', function (error ,data) {
  links = data.split("\n");
  
  if (links.length > 0) {
  	writeJSON(links[0], 0, links);
  } else {
  	console.log("No data found in file");
  }
  
});