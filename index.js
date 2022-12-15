import app from "./app.js";
import connectwithDb from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

//connect with database
connectwithDb();

/* MONGOOSE SETUP */
app.listen(process.env.PORT, () => {
  console.log(`Server is running at port: ${process.env.PORT}`);
});
