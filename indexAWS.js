const AWSOBJ = {};

var AWS = require('aws-sdk');

var s3 = new AWS.S3();

// Los nombres de buckets deben ser únicos entre todos los usuarios de S3

var myBucket = 'erick.prueba.bucket';

var myKey = 'text.txt';

function runAws(){

s3.createBucket({Bucket: myBucket}, function(err, data) {

if (err) {

   console.log(err);

   } else {

     params = {Bucket: myBucket, Key: myKey, Body: 'Como va'};

     s3.putObject(params, function(err, data) {

         if (err) {

             console.log(err)

         } else {

             console.log("Successfully uploaded data to myBucket/myKey");

         }

      });

   }

});
}
AWSOBJ.runAws = runAws;
module.exports = AWSOBJ;