const express=require("express");
const mongoose=require("mongoose");
const cors=require('cors');
require("dotenv").config();
const app=express();
const port=5000;
app.use(cors());
app.use(express.json());

const URI=process.env.URI;
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true });
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("mongoDB connected");
});
const postRouter=require('./routes/post');
const userRouter=require('./routes/users');
app.use('/posts',postRouter);
app.use('/users',userRouter);

app.listen(port,()=>{
    console.log(`Server is running on port:${port}`);
});
