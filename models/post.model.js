const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const {ObjectId}=mongoose.Schema.Types;
const postSchema=new Schema({
    post:{type:String,required:true},
    photo:{type:String},
    postedBy:{type:ObjectId,ref:"User"},
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{text:String,postedBy:{type:ObjectId,ref:"User"}
    }],
},
{
        timestamps:true,
});

const Post=mongoose.model('Post',postSchema);
module.exports=Post;