var fs = require("fs");
var host = "127.0.0.1";
var port = 8080;
var express = require("express");
var path = require("path");

var app = express();

app.use(express.static(__dirname + "/public")); // use static files in ROOT/public folder

app.get('/showroom',function(req,res){
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get("/images", function(request, res){
	var images = { "images": [
		'/assets/images/vw/vw1.jpg',
		'/assets/images/vw/vw2.jpg',
		'/assets/images/vw/vw3.jpg',
		'/assets/images/vw/vw4.jpg',
		'/assets/images/vw/vw5.jpg',
		'/assets/images/vw/vw6.jpg',
		'/assets/images/vw/vw7.jpg',
		'/assets/images/vw/vw8.jpg',
		'/assets/images/vw/vw9.jpg',
		'/assets/images/vw/vw10.jpg',
		'/assets/images/vw/vw11.jpg',
		'/assets/images/vw/vw12.jpg',
		'/assets/images/vw/vw13.jpg',
		'/assets/images/vw/vw14.jpg',
		'/assets/images/vw/vw15.jpg',
		'/assets/images/vw/vw16.jpg',
		'/assets/images/vw/vw17.jpg',
		'/assets/images/vw/vw18.jpg',
		'/assets/images/vw/vw19.jpg',
		'/assets/images/vw/vw20.jpg',
		'/assets/images/vw/vw21.jpg',
		'/assets/images/vw/vw22.jpg'
	]};
    //res.json(images);
    res.jsonp(images);
});

console.log('localhst:',port);

app.listen(port, host);