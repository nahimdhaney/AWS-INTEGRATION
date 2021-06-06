require('dotenv').config()
var colors = require('colors');
var AwsObj = require('./AwsService');
const express = require('express');
var bodyParser = require("body-parser");
const server = express();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.listen(3330,function(){
    console.log('Server on port 3330'.green);
    console.log(process.env.BUCKET_NAME);
    console.log(process.env.IAM_USER_KEY);
    console.log(process.env.IAM_USER_SECRET);
});

server.post('/uploadImage',function(req,res){
    var keyname = req.body.url;// url
    var keyfold = req.body.folder;// url
    if (!keyname && !keyfold){
        res.end("No params");
    }else{

            AwsObj.putUrl(keyname,keyfold,function(response){
                // Here you have access to your variable
                var respuesta = response;
                var obj = `{
                    "status" : "Success",
                    "data" : "${respuesta}"
                    }`;
                    console.log(obj);
                    res.status(200).send(obj);    
            })
    }
  });

  var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'folder' }])

  server.post('/imageUpload', upload.single('image'),function(req,res){
    const file = req.file
    console.log(file) ;
    console.log(req.body.folder);
    // req.body 
    var keyname = file;// url
    var keyfold = req.body.folder;// url
    if (!keyname && !keyfold){
        res.end("No params");
    }else{

            AwsObj.uploadFile(keyname,keyfold,function(response){
                // Here you have access to your variable
                var respuesta = response;
                var obj = `{
                    "status" : "Success",
                    "data" : "${respuesta}"
                    }`;
                    console.log(obj);
                    res.status(200).send(obj);    
            })
    }
  });


  server.get('/getImages', function(req, res) {
    var keyname = req.query.codProduto;// codproduto
    if(!keyname) {
        res.end("No params");
    }else{
        AwsObj.getListBucket(keyname).then(function(response) {
            //success
            res.send(response);
          }, function(error) {
              //failed
              res.send(error);
          });
    }
  });

  server.post('/deleteImg', function(req, res) {
    var keyname = req.body.nomeImg;// url
    var codProduto = req.body.codProduto;// url
    
    if(!keyname) {
        res.end("No params");
    }else{
        AwsObj.deleteFromBucket(keyname,codProduto).then(function(response) {
            //success
            res.send(response);
          }, function(error) {
              //failed
              res.send(error);
          });
    }
  });
