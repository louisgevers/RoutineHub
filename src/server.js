
'use strict';

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var goalOne = {
    "name":"Become better at drawing",
    "category":"Art",
    "highScore":25,
    "habits":[
        {
            "name":"Draw",
            "difficulty":"1",
            "days":[false, true, true, true, true, true, false],
            "notes":"Obviously.",
            "currentStreak":0,
            "highStreak":0,
            "accomplished":false
        },
        {
            "name":"Watch TV",
            "difficulty":"-1",
            "days":[false, false, false, false, false, false, false],
            "notes":"Obviously not.",
            "currentStreak":0,
            "highStreak":0,
            "accomplished":false
        }
    ]
}
var goalTwo = {
    "name":"Get good grades",
    "category":"Study",
    "highScore":100,
    "habits":[
        {
            "name":"Study",
            "difficulty":"2",
            "days":[true, true, true, true, true, true, true],
            "notes":"Keep going.",
            "currentStreak":0,
            "highStreak":0,
            "accomplished":false
        }
    ]
}


var goalsList = [];
goalsList.push(goalOne);
goalsList.push(goalTwo);

var versionhash = 0;

app.get("/getdata", function(req, res){
    res.json([versionhash, goalsList]);
    console.log("sent succesfully");
});

app.post("/addgoal", function(req, res){

    var newGoal = req.body;
    newGoal.habits = [];
    var contains = false;
    goalsList.forEach(function(goal){
        if(newGoal.name == goal.name){
            contains = true;
        }
    })

    if(!contains){
        goalsList.push(newGoal);
    }

    versionhash++;

});

app.post("/deletegoal", function(req, res){

    var deleteGoal = req.body;

    goalsList.forEach(function(goal){
        if(deleteGoal.name == goal.name){
            console.log(goal.name);
            goalsList.splice(goalsList.indexOf(goal), 1);
        }
    })

    versionhash++;

});

app.post("/editgoal", function(req, res){

    var toEditGoal;

    goalsList.forEach(function(goal){
        if(goal.name == req.body.toEdit){
            toEditGoal = goal;
        }
    })

    toEditGoal.name = req.body.name;
    toEditGoal.category = req.body.category;

    versionhash++;

});

app.post("/habitcheck", function(req, res){

    goalsList.forEach(function(goal){
        goal.habits.forEach(function(habit){
            if(habit.name == req.body.checkedHabit){
                habit.currentStreak = req.body.currentStreak;
                habit.highStreak = req.body.highStreak;
                habit.accomplished = !habit.accomplished;
            }
        })
    })

    versionhash++;

});

app.post("/addhabit", function(req, res){

    var toAddGoal = req.body.goalName;
    var newHabit = {};

    newHabit.name = req.body.name;
    newHabit.difficulty = req.body.difficulty;
    newHabit.days = req.body.days;
    newHabit.notes = req.body.notes;
    newHabit.currentStreak = 0;
    newHabit.highStreak = 0;
    newHabit.accomplished = false;

    goalsList.forEach(function(goal){
        if(goal.name == toAddGoal){
            goal.habits.push(newHabit);
        }
    })

    versionhash++;

});

app.post("/edithabit", function(req, res){

    goalsList.forEach(function(goal){
        goal.habits.forEach(function(habit){
            if(habit.name == req.body.toEdit){
                habit.name = req.body.name;
                habit.difficulty = req.body.difficulty;
                habit.days = req.body.days;
                habit.notes = req.body.notes;
            }
        });
    });

    versionhash++;

});

app.post("/deletehabit", function(req, res){

    goalsList.forEach(function(goal){
        var toEditGoal = goal;
        toEditGoal.habits.forEach(function(habit){
            if(habit.name == req.body.toDelete){
                toEditGoal.habits.splice(goal.habits.indexOf(habit), 1);
            }
        });
    });

    versionhash++;

});

const port = process.env.PORT || 8080;
http.createServer(app).listen(port);