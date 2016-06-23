require('dotenv').config();
var path = require('path')
var express = require('express')
var app = express()

var port = process.env.PORT || 5000

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var havenondemand = require('havenondemand')
var client = new havenondemand.HODClient(process.env.API_KEY)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');


app.get('/',function(req,res){
	res.render('index', {storm: 'BrainStorm'});
});


//Render variables to html file

/*
client.call('speechrecognition', data1, function(err1, resp1, body1){
  if(err1) {
    throw err1;
  }
  else {
    var speechText = resp1.body.concepts;

  }
})
*/
app.post('/upload_file', upload.single('upload'), function(req, res) {
	// debugger
  var filePath = req.file.path;
  var data1 = {file: path.join(__dirname, filePath)};
  client.call('extractconcepts', data1, function(err1, resp1, body1) {
    if (err1) {
      debugger
      throw err1;
    	}
		else {
      console.log("------------------------")
      console.log('Extracted concepts')
      var concepts = resp1.body.concepts // array
			debugger
			//res.render('showcase', {links: concepts})
			var data2 = {text: concepts[0].concept}
			client.call('findsimilar', data2,function(err2,resp2,body2){
				debugger
				if(err2){
					debugger
					return err2
					}
				else
				{
					var similarities = resp2.body.documents //array
					res.render('showcase', {links: concepts, similar: similarities})
				}
			})
    }
  })
})



//Return brainstormed ideas
//Filter ideas into categories


app.listen(port, function() {
  console.log('Listening on port: ' + port)
})
