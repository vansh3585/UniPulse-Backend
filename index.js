const express = require("express");
const app = express();
const cors=require('cors')
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

//cookie-parser - what is this and why we need this ?

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const bodyParser = require("body-parser")


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

require("./config/database").connect();

app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

cloudinaryConnect();

//route import and mount
const user = require("./routes/user");
const eventRoutes=require("./routes/event")
const studentRoutes=require("./routes/student")
app.use("/api/v1/verify", user);
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/student", studentRoutes);


//activate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})