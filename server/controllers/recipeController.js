
require('../models/database'); 
const Category = require('../models/Category') ;
const Recipe = require('../models/Recipe'); 
//const { search } = require('../routes/recipeRoutes');
/**
 *  aGET / 
 * 
 */
exports.homepage = async (req,res)=>{
    try{

        const limitNumber= 5; 
        const categories= await Category.find({}).limit(limitNumber);
        const latest=await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        const indian = await Recipe.find({'category':'Indian'}).limit(limitNumber);
        const thai=await Recipe.find({'category':'Thai'}).limit(limitNumber);
        const american = await Recipe.find({'category':'American'}).limit(limitNumber);
        const chinese = await Recipe.find({'category':'Chinese'}).limit(limitNumber);
        const food={latest,thai,american,chinese,indian} ;
        res.render('index',{title:'Cooking Blog-HomePage',categories,food}) ;
    }
    catch(error){
         res.status(500).send({message:error.message || 'Error Occured..'})
    }
}

//get all the catefgories: 
exports.exploreCategories = async (req,res)=>{
    try{

        const limitNumber= 20; 
        const categories= await Category.find({}).limit(limitNumber);
        res.render('categories',{title:'Cooking Blog - Categories',categories}) ;
    }
    catch(error){
        res.status(500).send({message:error.message || 'Error Occured..'})
    }
}
//get all the recipes : 
exports.exploreRecipe = async (req,res)=>{
    try {
       let recipeId= req.params.id;
      const recipe= await  Recipe.findById(recipeId) ;
        res.render('recipe',{title:'Cooking Blog - Recipe',recipe}) ;
    }
    catch(error)
    {
        res.status(500).send({message:error.message || 'Error Occured..'})
    }
}
//get products by category : 
exports.exploreCategoriesById = async(req,res)=>{
    try { 
           
        let categoryId= req.params.id;
        const limitNumber =20; 
        const categoryById = await Recipe.find({'category':categoryId}).limit(limitNumber) ;
        res.render('categories',{title:'Cooking Blog - Categories',categoryById});
    }
    catch(err){
        res.status(500).send({message:error.message || 'Error Occured..'})
    }
}


// Search recipe : 
exports.searchRecipe = async(req,res)=>{
    try {

        let  searchTerm =req.body.searchTerm; 
        let recipe= await Recipe.find({$text:{ $search : searchTerm , $diacriticSensitive : true}})
        //res.json(recipe);
      res.render('search',{title:'Cooking Blog- Search',recipe});
    }
    catch(error)
    {
    res.status(500).send({message:error.message || 'Error Occured..'})

    }

}
//explore -latest  route  : >
exports.exploreLatest = async (req,res)=>{
    try {
        const limitNumber=20; 
        const recipe= await Recipe.find({}).sort({_id:-1}).limit(limitNumber);  
          res.render('explore-latest',{title:'Cooking-Blog Explore Latest',recipe}); 
    }
    catch(error){
        res.status(500).send({message:error.message || 'Error Occured..'});
    }
}
//explore - random route : 
exports.exploreRandom = async(req,res)=>{
    try 
    {
          let count= await Recipe.find().countDocuments(); 
         let random =Math.floor(Math.random()*count); 
         let recipe= await Recipe.findOne().skip(random).exec(); 
         res.render('explore-random',{title:'Cooking Blog- Explore Random',recipe}) ;
    }
    catch(error){
        res.status(500).send({message:error.message || 'Error Occured..'});
    }
}

//submit the recipe : 
exports.submitRecipe = async(req,res)=>{
    const infoErrorsObj = req.flash('infoErrors') ;
    const infoSubmitObj = req.flash('infoSubmit') ;
    try {
           await  res.render('submit-recipe',{title:'Cooking Blog- Submit Recipe',infoErrorsObj,infoSubmitObj});
    }
    catch(error){
        res.status(500).send({message:error.message || 'Error Occured..'});
    }
}

//submit the recipe on post : 
exports.submitRecipeOnPost = async(req,res)=>{
    try {

         let imageUploadFile;
         let uploadPath;
         let newImageName; 
         if(!req.files || Object.keys(req.files)==0){
            console.log('No files are uploaded');
         }
         else {

            imageUploadFile = req.files.image;
            newImageName = Date.now()+imageUploadFile.name ;
            uploadPath = require('path').resolve('./') + '/public/uploads/'+newImageName ;
            imageUploadFile.mv(uploadPath,function(err){
                if(err) return res.status(500).send(err) ;
            })
         }


        const newRecipe=  new Recipe({
           name : req.body.name,
            description:req.body.description,
            email:req.body.email, 
            ingredients :req.body.ingredients,
            category:req.body.category,
            image:newImageName 
        })
        await newRecipe.save();
          req.flash('infoSubmit','Recipe has been added')
        res.redirect('/submit-recipe') ;
    }
    catch(error){
        req.flash('infoErrors',error) ;
        res.redirect('/submit-recipe') ;
    }
}


//Contact Page : 
exports.contactPage = async(req,res)=>{
    res.render('contact', {title:'Cooking-Blog Contact Page'})
}













// async function insertDummyCategoryData(){ 
//     try { 
//         await Category.insertMany(
//             [
//                 {
//                     "name":"Thai", 
//                     "image":"thai-food.jpg"
//                 },
//                 {
//                     "name":"American",
//                     "image":"american-food.jpg"
//                 },
//                 {
//                     "name":"Chinese",
//                     "image":"chinese-food.jpg"
//                 },
//                 {
//                     "name":"Mexican",
//                     "image": "mexican-food.jpg"
//                 },
//                 {
//                     "name":"Indian", "image":"indian-food.jpg"
//                 },{
//                     "name":"Spanish",
//                     "image": "spanish-food.jpg"
//                 }
//             ]
//         );
//     } 
//     catch(err)
//     {
//         console.log('error'+err);
//     }
// }
// insertDummyCategoryData(); 
// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Southern Fried Chicken",
//         "description": `Recipe Description Goes Here`,
//         "email": "thisrecipesrinivas@email.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//        { 
//         "name": "Veggie Pad Thai",
//         "description": `Recipe Description Goes Here`,
//         "email": "thisrecipesrinivas@email.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Mexican", 
//         "image": "veggie-apd-thai.jpg"
//       },
//        { 
//             "name": "Spring Rolls",
//             "description": `Recipe Description Goes Here`,
//             "email": "thisrecipesrinivas@email.com",
//             "ingredients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika",
//             ],
//             "category": "Chinese", 
//             "image": "spring-rolls.jpg"
//           },
//      { 
//         "name": "tom-daley",
//         "description": `Recipe Description Goes Here`,
//         "email": "thisrecipesrinivas@email.com",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "tom-daley.jpg"
//       },
// {
// "name": "Paneer Masala",
// "description":
// "Drizzle 1 tablespoon of olive oil into a large roasting tray, then sprinkle over a pinch of sea salt and black pepper, the turmeric and cumin seeds. Finely grate over the lemon zest and squeeze in the juice.",
// "email": "thisrecipesrinivas@email.com",
// "ingredients": [
//   "1 level teaspoon baking powder",
//   "1 level teaspoon cayenne pepper",
//   "1 level teaspoon hot smoked paprika",
// ],
// "category": "American", 
// "image": "thai-inspired-vegetable-broth.jpg"
//    } ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
