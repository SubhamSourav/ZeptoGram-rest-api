import app from "./app.js";
import connectwithDb from "./config/db.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();

//connect with database
connectwithDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* MONGOOSE SETUP */
app.listen(process.env.PORT, () => {
  console.log(`Server is running at port: ${process.env.PORT}`);
});
