const express=require('express') ;
const expressLayouts=require('express-ejs-layouts');
const fileUpload= require('express-fileupload');
const session = require('express-session');
const cookieParser= require('cookie-parser'); 
const flash= require('connect-flash') ;
const { default: mongoose } = require('mongoose');

const app=express();
const port=process.env.Portnum||3000 ;

require('dotenv').config(); 
const url = process.env.mongolink ; 

app.use(express.urlencoded({extended:true}));
app.use(express.static('public')) ;
app.use(expressLayouts) ;
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret:process.env.sessionsecret,
    saveUninitialized:true,
    resave:true
}))
app.use(flash()) ;
app.use(fileUpload()) ;

app.set('layout','./layouts/main') ;
app.set('view engine','ejs') ;

const routes=require('./server/routes/recipeRoutes.js');
app.use('/',routes); 

app.listen(port, (req,res)=>{
    console.log('Server started on port 3000');
})