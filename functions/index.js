const functions = require("firebase-functions");
const formidable = require("formidable-serverless");
const admin = require("firebase-admin");

admin.initializeApp();

exports.uploadFile = functions.https.onRequest((req,res)=>{
    let form =  new formidable.IncomingForm();
    return new Promise((resolve, reject)=>{
        form.parse(req, async(err,fields,files)=>{
            var file = files.file;
            if(!file){
                reject(new Error("No file to upload"))
            }
            var filepath = file.path;
            console.log(filepath);

            const response = await admin.storage().bucket("uploadImage").upload(filepath, {
                contentType: file.type
            });
            resolve({fileInfo: response[0].metadata});
        });
    }).then((response) => {
        res.status(200).json({ response });
        return null;
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ err });
    });
});