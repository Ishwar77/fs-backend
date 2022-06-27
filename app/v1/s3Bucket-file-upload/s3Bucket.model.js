const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: 'AKIAJQG2Y4KWJ3M2VWSQ',
    secretAccessKey: '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'
});

const fileName = 'csr3.jpg';

const uploadFile = () => {
  fs.readFile(fileName, (err, data) => {
     if (err) throw err;
     const params = {
         Bucket: 'test-fit-socials/users', // pass your bucket name
         Key: 'csr3.jpg', // file will be saved as test-fit-socials/csr3.jpg
         Body: JSON.stringify(data, null, 2)
     };
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         console.log(`File uploaded successfully at ${data.Location}`)
     });
  });
};

uploadFile();