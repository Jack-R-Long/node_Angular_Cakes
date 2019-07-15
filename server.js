// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
//mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rate_cakes');
// create the express app
var app = express();
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.json());
// MiddleWare: Session and Flash 
var session = require('express-session');
app.use(session({
	secret: 'cam_god',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
const flash = require('express-flash');
app.use(flash());
// static content
app.use(express.static( __dirname + '/public/dist/public' ));

// app.use(express.static(path.join(__dirname, "./static")));
// // setting up ejs and our views folder
// app.set('views', path.join(__dirname, './views'));
// app.set('view engine', 'ejs');

// // Get sockets
// const server = app.listen(8000);
// const io = require('socket.io')(server);
// var counter = 0;

// io.on('connection', function (socket) { //2
// 	  //Insert SOCKETS 
// });

// Mongoose Schema users 
const RatingSchema = new mongoose.Schema({
	rating: {type: Number, required: [true, "Must provide a rating"]},
	comment: {type: String, required: [true, "Comments must have content"]},
}, {timestamps: true})
const CakeSchema = new mongoose.Schema({
	name: {type: String, required: [true, "Must have title"], minlength: [2, "Title must be longer than 2 characters"]},
	image: {type: String, default:null},
	rating: [RatingSchema],
}, {timestamps: true})
mongoose.model('Rating', RatingSchema); // We are setting this Schema in our Models as 'Task'
mongoose.model('Cake', CakeSchema); // We are setting this Schema in our Models as 'Task'
var Rating = mongoose.model('Rating')
var Cake = mongoose.model('Cake') // We are retrieving this Schema from our Models, named 'User'
// // ...delete all records of the User Model
// User.deleteMany({}, function(err){
// 	// This code will run when the DB has attempted to remove all matching records to {}
//    })

// root route to render the index.ejs view
app.get('/cakes', function(req, res) {
	Cake.find({}, function(err, Cakes_array) {
		if (err) {
			console.log("Error finding Tasks")
			res.json({message: "Error", error: err})
		}else {
			console.log(Cakes_array)
			res.json({message: "Success", data: Cakes_array})
		}
	})
})
// // show Cake
app.get('/cakes/:id', (req, res)=> {
	Cake.findOne({_id: req.params.id}, (err, cake_arr)=> {
		if (err) {
			console.log("Error finding cake")
			res.json({message: "Error", error: err})
		}else {
			console.log(cake_arr)
			res.json({message: "Success", data: cake_arr})
		}
	})
})
// create new cake
app.post('/cakes', (req, res)=> {
	console.log(req.body)
	Cake.create(req.body, (err, new_cake_arr)=> {
		if (err) {
			console.log("Error creating cake")
			res.json({message: "Error", error: err})	
		}else {
			console.log(new_cake_arr)
			res.json({message: "Success", data: new_cake_arr})
		}
	})
})
// PUT updated task by id 
// app.put('/cakes/:id', (req,res)=> {
// 	Task.findOneAndUpdate({_id: req.params.id}, req.body,{new: true}, (err, new_task_arr)=>{
// 		if (err) {
// 			console.log("Error updating task by ID")
// 			res.json({message: "Error", error: err})	
// 		} else {
// 			console.log(new_task_arr)
// 			res.json({message: "Success", data: new_task_arr})
// 		}
// 	})
// })
app.post('/rating', function(req, res) {
	Rating.create({rating: req.body.rating, comment: req.body.comment}, (err, data)=>{
		if (err){
			console.log("Error creating rating")
			res.json({message: "Error", error: err})	
		}else{
			Cake.findOneAndUpdate({_id: req.body.cake_id}, {$push: {rating: data}}, {new: true}, (err, new_cake_arr)=>{
				if (err){
					console.log("Error adding rating to cake")
					res.json({message: "Error", error: err})	
				}else{
					res.json({message: "Success", data: new_cake_arr})
				}
			})
		}
	})
})
// DELETE cake by id 
app.delete('/cakes/:id', (req,res)=> {
	Cake.findByIdAndDelete(req.params.id, (err)=>{
		if (err) {
			console.log("Error deleting cake by ID")
			res.json({message: "Error", error: err})	
		} else {
			res.json({message: "Success : deleted cake!"})
		}
	})
})
// // delete new people 
// app.get('/remove/:name', (req, res)=> {
// 	People.deleteOne({name: req.params.name}, (err) => {
// 		if (err) {
// 			console.log("Error deleting person")
// 			res.json({message: "Error", error: err})	
// 		}else {
// 			res.json({message: "Success"})
// 		}
// 	})
// })


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(request, response){
	response.send("404")
});

// tell the express app to listen on port 8000
app.listen(8000, function() {
 console.log("listening on port 8000");
});