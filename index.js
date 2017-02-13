//require statements
var path = require('path');
var express = require('express');
var Bing = require('node-bing-api')({ accKey: '8d8182771d424acca6c1a4571b435c84' });
var mongo = require('mongodb').MongoClient;
//var util = require('util');

//initialize
var app = express();
var port = process.env.PORT || 8080;
app.set('view engine','pug');
app.set('views',path.join(__dirname+'/views/'));
//routes
app.get('/',function(req,res){
	res.render('index');
})

app.get('/api/imagesearch/*',function(req,res){
	var searchString = req.params[0];
	var offset = req.query.offset || 1;
	Bing.images("searchString",{top: offset},function(error,resp,body){
		res.json(body);
		mongo.connect("mongodb://server:server123@ds149329.mlab.com:49329/urlsh",function(err,db){
			var collection = db.collection('searches');
			collection.insert(
				{
		    		url: searchString
	    		},
	    		function(error,data){
	   						console.log(data);
	    				})	    			
	    		}
    		)
		})
	})
app.get('/api/latest/imagesearch/',function(req,res){
	mongo.connect("mongodb://server:server123@ds149329.mlab.com:49329/urlsh",function(err,db){
			var collection = db.collection('searches');
			collection.find().toArray(function(err,results){
				res.json(results);
			})
		})
})
//listen
app.listen(port);