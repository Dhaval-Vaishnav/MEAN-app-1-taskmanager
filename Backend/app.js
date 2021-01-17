// express library for creating server
const express = require('express');
const app = express();

// to pass data on json format
app.use(express.json());

// mongoose library for connect mongoDB database
const mongoose = require('./database/mongoose');

// import models on Task & List
const Task = require('./database/models/task');
const List = require('./database/models/list');

// allow cors (corss origin request security multiple url allow like localhost:3000 for backend and localhost:4200 for frontend )
app.use( (req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header();
    next();
});


/*
List : CRUD
Task : CRUD
*/

// ################# URLs For lists #################

// Create new list
app.post('/list', (req,res) => {
    (new List({title: req.body.title}))
    .save()
    .then((list) => res.send(list))
    .catch((error) => console.log(error));
});

// Get All Lists
app.get('/lists',(req,res) => {
    List.find({})
        .then(lists => res.send(lists))
        .catch((error) => console.log(error));
});

// Get specified one Lists
app.get('/list/:listId',(req,res) => {
    List.find({ _id:req.params.listId})
        .then(lists => res.send(lists))
        .catch((error) => console.log(error));
});

// Update specified one Lists
app.patch('/list/:listId',(req,res) => {
    List.findOneAndUpdate({ '_id': req.params.listId }, { $set: req.body } )
        .then(lists => res.send(lists))
        .catch((error) => console.log(error));
});

// Delete specified one Lists
app.delete('/list/:listId',(req,res) => {
    const deleteTask = (list) => {
        Task.deleteMany( {_listId: list._id} )
            .then( () => list )
            .catch( (error) => console.log(error) );

    };
    
    List.findByIdAndDelete(req.params.listId)
        .then((list) => res.send(deleteTask(list)))
        .catch((error) => console.log(error));
});


// ################# URLs For Tasks #################

// Create new Task
app.post('/list/:listId/task', (req,res) => {
    (new Task({ title: req.body.title, _listId: req.params.listId }))
    .save()
    .then((task) => res.send(task))
    .catch((error) => console.log(error));
});

// Get All Task
app.get('/list/:listId/tasks',(req,res) => {
    Task.find({ _listId:req.params.listId})
        .then(task => res.send(task))
        .catch((error) => console.log(error));
});

// Get specified One Task
app.get('/list/:listId/tasks/:taskId',(req,res) => {
    Task.findOne({ _listId: req.params.listId, _id: req.params.taskId })
        .then( task => res.send(task) )
        .catch( (error) => console.log(error) );
});

// Update Task
app.patch('/list/:listId/tasks/:taskId', (req,res)=>{
    Task.findOneAndUpdate( { _listId: req.params.listId, _id:req.params.taskId }, { $set : req.body } )
        .then( task => res.send(task))
        .catch( (error) => console.log(error) );
});

// Delete Task
app.delete('/list/:listId/tasks/:taskId', (req,res)=>{
    Task.findOneAndDelete( { _listId: req.params.listId, _id:req.params.taskId } )
        .then( task => res.send(task))
        .catch( (error) => console.log(error) );
});

// to set port and create server
app.listen(3000, ()=> console.log('server is running on port 3000...'));