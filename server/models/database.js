const mongoose=require('mongoose') ;
const url= process.env.mongolink; 
mongoose.connect('mongodb+srv://recipe:recipe@cluster0.qjn3mju.mongodb.net/test',{useNewUrlParser:true,useUnifiedTopology:true})
const db= mongoose.connection ; 
db.on('error',console.error.bind(console,'Connection error:'));
db.once('open',function(){
    console.log('Connected to Database')
}) ; 


require('./Category') ;
require('./Recipe'); 