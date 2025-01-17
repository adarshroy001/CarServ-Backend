const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
const SCOPE = process.env.SCOPE;

async function getAccessToken() {
    const tokenResponse = await axios.post(
        `https://login.microsoftonline.com/${TENANT_ID}/oauth2/token`,
        new URLSearchParams({
            grant_type: "client_credentials",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: SCOPE,
        })
    );
    return tokenResponse.data.access_token;
}

async function uploadToOneDrive(accessToken, filePath, fileName) {
    try {
        let uploadedDetials = [];
        for(let i=0; i<filePath.length; i++){
            const fileContent = fs.readFileSync(path.join(__dirname , '../..' , '/public/', filePath[i]));
            const uploadResponse = await axios.put(
                `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`,
                fileContent,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "image/jpeg", // Adjust if file is not JPEG
                    },
                }
            );
            uploadedDetials.push(uploadResponse);
        }
        return uploadedDetials;
    } catch (error) {
        console.error("Error uploading file to OneDrive:", error);
        return [];
    }
}

// function to reduce imagesize and upload photo to oneDrive and return path

async function reduceAndUploadToOneDrive(filePath , fileName) {
    try {
        const accessToken = await getAccessToken();
        console.log(accessToken);
        const uploadedFile = await uploadToOneDrive(accessToken, filePath, fileName);
        console.log("Uploaded file:", uploadedFile); 
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    reduceAndUploadToOneDrive
};