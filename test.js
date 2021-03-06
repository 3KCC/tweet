var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    events = require("events");
 
function load_static_file(uri, response) {
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHeader(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }
         
        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHeader(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }
             
            response.writeHeader(200);
            response.write(file, "binary");
            response.end();
        });
    });
}

 
var tweet_emitter = new events.EventEmitter();
 
function get_tweets() {
    var request = http.request({port: 80, host: "api.twitter.com", method: "GET", path: "/1/statuses/public_timeline.json"}, function(response){
        var body = "";
        response.on("data", function(data) {
            body += data;
        });
         
        response.on("end", function() {
            var tweets = JSON.parse(body);
            if(tweets.length > 0) {
                tweet_emitter.emit("tweets", tweets);
            }
        });
    });
     
    request.end();
}
 
setInterval(get_tweets, 5000);
http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    if(uri === "/stream") {
        var listener = tweet_emitter.on("tweets", function(tweets) {
            response.writeHeader(200, { "Content-Type" : "text/plain" });
            response.write(JSON.stringify(tweets));
            response.end();
             
            clearTimeout(timeout);
        });
         
        var timeout = setTimeout(function() {
            response.writeHeader(200, { "Content-Type" : "text/plain" });
            response.write(JSON.stringify([]));
            response.end();
             
            //tweet_emitter.removeListener("tweets", listener);
        }, 10000);
         
    }
    else {
        load_static_file(uri, response);
    }
}).listen(8080);
 
console.log("Server running at http://localhost:8080/");