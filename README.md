# online-xml-to-local-json
This is a simple node script that reads in a list of URLs that point to XML documents, and converts each to JSON and stores them locally.

As with all node scripts, to get the environment set up, run
```
$ npm install
```

To run the script:

1. Put all URLs in `xmls.txt`, with one URL on each line.
2. Run the following command
```
$ node run_me.js
```

The JSON files produced will be in the `jsons/` directory. 

This script makes 2 assumptions:

1. URLs are well formed and do not need to be redirected
2. Files are accessible via HTTP
  - This can be updated by using `https` rather than `http` in the script, both come baked into node.  
