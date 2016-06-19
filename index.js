var path = require('path')
var express = require('express')
var app = express()

var port = process.env.PORT || 5000

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var havenondemand = require('havenondemand')
var client = new havenondemand.HODClient('c6dddca6-0ef3-4e34-a1bb-828bce59eb55')

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
	debugger
  var filePath = req.file.path;
  var data1 = {file: path.join(__dirname, filePath)};
  client.call('extractconcepts', data1, function(err1, resp1, body1) {
    if (err1) {
      throw err1;
    } else {
			debugger
      console.log("------------------------")
      console.log('Extracted concepts')
      var concepts = resp1.body.concepts // array
      for (var i=0; i<concepts.length; i++) {
        var concept = concepts[i].concept
        console.log("~~~~~~~~~~~~~~")
        console.log(concept)
					res.render('index', {storm: 'BrainStorm', links: concept}, function(err){
						if(err)
							throw err;
					});
      }
    }
  })
})


//Return brainstormed ideas
//Filter ideas into categories


app.listen(port, function() {
  console.log('Listening on port: ' + port)
})
