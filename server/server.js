const express = require('express');
const app = express();
//const cors = require("cors");
const cors=require('cors');
const main=require("./db");
const teacherRoute = require("./routes/teacherRoute");
const adminRoute = require("./routes/adminRoute");
const studentRoute = require("./routes/studentRoute");
const feedbackFormRoute=require("./routes/feedbackFormRoute");
const questionRoute = require("./routes/questionRoute");
const feedbackResponse=require("./routes/feedbackResponseRoute");
const feedbackStatsRoute = require("./routes/feedbackCountRoute");


const admin = require('./models/admin');
require('dotenv').config();
const cookieParser = require("cookie-parser");

const allowedOrigins = [

  "http://localhost:3000","https://feedbacker-student.vercel.app/"
];
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser()); 
app.use(express.json()); 
app.use("/teacher",teacherRoute);
app.use("/student",studentRoute);
app.use("/admin",adminRoute);
app.use("/feedbackForm",feedbackFormRoute);
app.use("/question",questionRoute);
app.use("/feedbackResponse",feedbackResponse);
app.use("/stats", feedbackStatsRoute);

// app.get("/admin", async(req,res)=>{
//     let r= await admin.find();
//     res.send("fetched"+r);
// })



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});


main()
.then(async()=>{
    console.log("connect to db");
    app.listen(process.env.PORT,()=>{
    console.log("listening at port 3001");
    })
})
.catch(err =>console.log(err));
