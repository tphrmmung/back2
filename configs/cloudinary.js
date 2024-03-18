const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dvxp8cnjy",
  api_key: "982334487943796",
  api_secret: process.env.CLOUDINARY_SECRET
});
module.exports = cloudinary;
