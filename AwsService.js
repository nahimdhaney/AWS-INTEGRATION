var callback = require('./indexHTTP');
const AwsObj = {};
var params = {};
var text = "";
const fs = require('fs');
const path = require('path');
// Create name for uploaded object key
//var keyName = 'C:\\Totvs\\MP11BOLOFI\\Protheus_Data\\LGMID.PNG';

const BUCKET_NAME = process.env.BUCKET_NAME;// 
const IAM_USER_KEY = process.env.IAM_USER_KEY; 
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });

function getListBucket(codProduto){
        return new Promise ((resolve, reject) => {
          const s3params = {
            Bucket: BUCKET_NAME, //bucket
            MaxKeys: 1000,
            Delimiter: '/',
            Prefix: codProduto +'/' //folder
          };
          s3.listObjectsV2 (s3params, (err, data) => {
            if (err) {
              reject (err);
            }
            resolve (data); // data.location
          });
        });
}


// function getListBucket(codProduto){
//     return new Promise ((resolve, reject) => {
//       const s3params = {
//         Bucket: bucketName, //bucket
//         MaxKeys: 1000,
//         Delimiter: '/',
//         Prefix: codProduto +'/' //folder
//       };
//       s3.listObjectsV2 (s3params, (err, data) => {
//         if (err) {
//           reject (err);
//         }
//         resolve (data); // data.location
//       });
//     });
// }

function deleteFromBucket(cNomeImg,codProduto){
    return new Promise ((resolve, reject) => {
        var params = {
            Bucket: BUCKET_NAME, //Bucket: bucketName, 
            Delete: { // required
            Objects: [ // required
                {
                Key: codProduto+"/"+cNomeImg // required
                }
            ]
            },
        };
        
        s3.deleteObjects(params, function(err, data) {
            if (err){
                reject (err);
                //console.log(err, err.stack); // an error occurred
            } 
            resolve (data);
        });
    });
}

function putUrl(keyName,folder, callback){
    params = {
        Bucket: BUCKET_NAME, // Bucket: bucketName,
        Body : fs.createReadStream(keyName),
        Key : folder+"/"+path.basename(keyName),
        ACL : "public-read"
    };

    s3.upload(params, function (err, data) {
        if (err) {
            console.log("Error", err);
            
        }
    
        //success
        if (data) {
         //   console.log("Uploaded in:", data.Location);
            return callback( data.Location);
            callback.gogo(data.Location);
        }
    });

}

AwsObj.getListBucket = getListBucket;
AwsObj.putUrl = putUrl;
AwsObj.deleteFromBucket = deleteFromBucket;

module.exports = AwsObj;