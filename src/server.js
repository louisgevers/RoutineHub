
'use strict';

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');

var app = express();

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'RoutineHub',
});

/* var goalObjectExample = {
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
} */


var goalsList = [];

var queryGoals = function(){

    goalsList.length = 0;
    
    var basicGoalQuery = 'SELECT id, name, category, highscore AS highScore FROM goal';

    var testConsole = [];

    var getHabits = function(goalIndex){

        var goal_id = goalIndex + 1;
        var looper = 0;
        
        var basicHabitQuery = 'SELECT id, title AS name, difficulty_id AS difficulty, notes, currentscore AS currentStreak, highScore AS highStreak FROM habit WHERE goal_id = ' + goal_id + ';';
        var accomplishedQuery = function(habit_id){
            return 'SELECT count(*) AS nrAccomplishedToday FROM habit_done WHERE DATE(timestamp) = CURDATE() AND habit_id = ' + habit_id + ';';
        };
        var habitDaysQuery = function(habit_id){    
            return 'SELECT day_of_week_id FROM habit_day_of_week WHERE habit_id = ' + habit_id + ';';
        };

        var toAddHabits = [];

        con.query(basicHabitQuery, function (err, result, fields) {

            if (err) throw err;
    
            result.forEach(function(habitresult){
                habitresult;
                habitresult.difficulty = habitresult.difficulty - 2;

                if(habitresult.notes == null){
                    habitresult.notes = "";
                }

                con.query(accomplishedQuery(habitresult.id), function(err,result,fields){
                    if (err) throw err;

                        if(result[0].nrAccomplishedToday == 0){
                            habitresult.accomplished = false;
                        } else {
                            habitresult.accomplished = true;
                        }
                    
                });

                habitresult.days = [false, false, false, false, false, false, false];

                con.query(habitDaysQuery(habitresult.id), function(err,result,fields){

                    if(err) throw err;

                    var queryDays = result;

                    var days = result.map(function(daypacket){
                        var day_id = daypacket.day_of_week_id;
                        if(day_id == 7){
                            day_id = 0;
                        }
                        return day_id;
                    });

                    days.forEach(function(dayIndex){
                        habitresult.days[dayIndex] = true;
                    });

                    setHabitsFrequency(habitresult);                    

                });


                toAddHabits.push(habitresult);                

            });

        });

        return toAddHabits;

    };

    var setHabitsFrequency = function(habit){

        habit.missScore = 0;

        var queryFinishedRecently = function(day_of_week, habit_id){return "SELECT count(*) AS finished FROM habit_done WHERE DAYOFWEEK(timestamp) = " + day_of_week + " AND habit_id = " + habit_id + " AND DATE(timestamp) > DATE_SUB(NOW(), INTERVAL 3 WEEK);"};

        var habitmapped = habit.days.map(function(value, index){
            if(value === true){
                return index + 1;
            }
        });
        
        var habitdays = habitmapped.filter(function(value){return Number.isInteger(value);})

        for(var i = 0; i < habitdays.length; i++) {
            con.query(queryFinishedRecently(habitdays[i], habit.id), function(error, result, fields){
                if (error) throw error;
                var finished = result[0].finished;
                habit.missScore = habit.missScore + 3 - finished;
            });
        }

    };

    con.query(basicGoalQuery, function (err, result, fields) {

        var toAddGoal;

        if (err) throw err;
        for(var i = 0; i < result.length; i++){
            
            toAddGoal = result[i];
            toAddGoal.habits = getHabits(i);

            goalsList.push(toAddGoal);

        }
    });

};

var versionhash = 0;

app.get("/getdata", function(req, res){
    res.json([versionhash, goalsList]);
});

con.connect(function(err) {

    if (err) throw err;
    console.log('Connected to the database');
    queryGoals();

});

//routing to dashboard
app.get("/dashboard", function(req, res){
   
    res.sendFile(path.join(__dirname + '/client/Analytics.html'))
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
    });

    if(!contains){
        var addGoalQuery = "INSERT INTO goal (name, category) VALUES (" + "\"" + newGoal.name + "\", \"" + newGoal.category + "\");";        
        goalsList.push(newGoal);
        con.query(addGoalQuery, function(error, result, fields){
            if (error) throw error;
        });
    }

    versionhash++;

});

app.post("/deletegoal", function(req, res){

    var deleteGoal = req.body;

    goalsList.forEach(function(goal, i){
        if(goal.id == deleteGoal.id){
            goalsList.splice(i, 1);
        }
    });

    var deleteGoalQuery = "DELETE FROM goal WHERE id = " + deleteGoal.id + ";";
    var deleteCorrespondingHabitsQuery = "DELETE FROM habit WHERE goal_id = " + deleteGoal.id + ";";

    con.query(deleteGoalQuery, function(error, result, fields){
        if (error) throw error;
    });

    con.query(deleteCorrespondingHabitsQuery, function(error, result, fields){
        if (error) throw error;
    });

    versionhash++;

});

app.post("/editgoal", function(req, res){

    var editGoal = req.body;

    goalsList.forEach(function(goal){
        if(goal.id == editGoal.id){
            goal.name = editGoal.name;
            goal.category = editGoal.category;
        }
    });

    var editGoalQuery = "UPDATE goal SET name = \"" + editGoal.name + "\", category = \"" + editGoal.category +"\" WHERE id = " + editGoal.id + ";";

    con.query(editGoalQuery, function(error, result, field){
        if (error) throw error;
    });

    versionhash++;

});

app.post("/habitcheck", function(req, res){

    var addAccomplishmentQuery = "INSERT INTO habit_done VALUES (" + req.body.id + ", NOW());";
    var updateScoreQuery = "UPDATE habit SET currentscore = " + req.body.currentStreak + ", highscore = " + req.body.highStreak + " WHERE id = " + req.body.id + ";";
    var removeAccomplishmentQuery = "DELETE FROM habit_done WHERE habit_id = " + req.body.id + " AND DATE(timestamp) = CURDATE();"

    var checkedHabit;

    goalsList.forEach(function(goal){
        goal.habits.forEach(function(habit){
            if(habit.id == req.body.id){
                checkedHabit = habit;
                checkedHabit.currentStreak = req.body.currentStreak;
                checkedHabit.highStreak = req.body.highStreak;
                checkedHabit.accomplished = !habit.accomplished;
            }
        })
    })

    if(checkedHabit.accomplished){
        con.query(addAccomplishmentQuery, function(error, result, fields){
            if (error) throw error;
        });
    } else {
        con.query(removeAccomplishmentQuery, function(error, result, fields){
            if (error) throw error;
        });
    }

    con.query(updateScoreQuery, function(error, result, fields){
        if (error) throw error;
    });

    versionhash++;

});

app.post("/addhabit", function(req, res){

    var difficulty_id = parseInt(req.body.difficulty) + 2;
    var addHabitQuery = "INSERT INTO habit (title, notes, difficulty_id, goal_id) VALUES (\"" + req.body.name + "\", \"" + req.body.notes + "\", " + difficulty_id + ", " + req.body.goal_id + ");";
    var addHabitWithoutNotesQuery = "INSERT INTO habit (title, difficulty_id, goal_id) VALUES (\"" + req.body.name + "\", " + difficulty_id + ", " + req.body.goal_id + ");";
    var addDayQuery = function(day_id){return "INSERT INTO habit_day_of_week VALUES((SELECT max(id) FROM habit), " + day_id + ");";};
    
    var toAddGoal = req.body.goal_id;
    var newHabit = {};

    newHabit.name = req.body.name;
    newHabit.difficulty = req.body.difficulty;
    newHabit.days = req.body.days.map(function(currValue){
        if(currValue === "true"){
            return true;
        } else {
            return false;
        }
    });
    newHabit.notes = req.body.notes;
    newHabit.currentStreak = 0;
    newHabit.highStreak = 0;
    newHabit.accomplished = false;

    goalsList.forEach(function(goal){
        if(goal.id == toAddGoal){
            goal.habits.push(newHabit);
        }
    });

    if(!req.body.notes == ""){
        con.query(addHabitQuery, function(error, result, fields){
            if (error) throw error;
        });
    } else {
        con.query(addHabitWithoutNotesQuery, function(error, result, fields){
            if (error) throw error;
        });
    }

    for(var i = 0; i < newHabit.days.length; i++){
        var today = newHabit.days[i];
        if(today === true){
            if(i == 0){
                con.query(addDayQuery(7), function(error, result, fields){if (error) throw error;});
            } else {
                con.query(addDayQuery(i), function(error, result, fields){if (error) throw error;});                
            }
        }
    }

    versionhash++;

});

app.post("/edithabit", function(req, res){

    var difficulty_id = parseInt(req.body.difficulty) + 2;

    var editHabitQuery = "UPDATE habit SET title = \"" + req.body.name + "\", notes = \"" + req.body.notes + "\", difficulty_id = " + difficulty_id + " WHERE id = " + req.body.id + ";";
    var resetDayQuery = "DELETE FROM habit_day_of_week WHERE habit_id = " + req.body.id + ";";
    var addDayQuery = function(day_id){return "INSERT INTO habit_day_of_week VALUES((SELECT max(id) FROM habit), " + day_id + ");";};

    var editHabit;

    goalsList.forEach(function(goal){
        goal.habits.forEach(function(habit){
            if(habit.id == req.body.id){
                editHabit = habit;
                habit.name = req.body.name;
                habit.difficulty = req.body.difficulty;
                habit.days = req.body.days.map(function(currValue){
                    if(currValue === "true"){
                        return true;
                    } else {
                        return false;
                    }
                });
                habit.notes = req.body.notes;
            }
        });
    });

    con.query(resetDayQuery, function(error, result, fields){if (error) throw error;});
    con.query(editHabitQuery, function(error, result, fields){if (error) throw error;});
    
    for(var i = 0; i < editHabit.days.length; i++){
        var today = editHabit.days[i];
        if(today === true){
            if(i == 0){
                con.query(addDayQuery(7), function(error, result, fields){if (error) throw error;});
            } else {
                con.query(addDayQuery(i), function(error, result, fields){if (error) throw error;});                
            }
        }
    }
    

    versionhash++;

});

app.post("/deletehabit", function(req, res){

    var deleteHabitQuery = "DELETE FROM habit WHERE id = " + req.body.id + ";";

    goalsList.forEach(function(goal){
        var toEditGoal = goal;
        toEditGoal.habits.forEach(function(habit){
            if(habit.id == req.body.id){
                toEditGoal.habits.splice(goal.habits.indexOf(habit), 1);
            }
        });
    });

    con.query(deleteHabitQuery, function(error, result, fields) {if (error) throw error;});

    versionhash++;

});


http.createServer(app).listen(3000);