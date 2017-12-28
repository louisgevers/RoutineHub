/**
 * Opens a modal box with a button that opens it and that closes it
 */
function modalBox(boxElementId, openBoxBtnId, closeBoxBtnId){
	
	var boxElement = document.getElementById(boxElementId);
	var openBoxBtn = document.getElementById(openBoxBtnId);
	var closeBoxBtn = document.getElementById(closeBoxBtnId);
    var modalBoxes = document.getElementsByClassName("modalBox");
	
	//Show box when clicking on the opening button and hide other boxes
	openBoxBtn.onclick = function(event){
		for(i = 0; i < modalBoxes.length; i++){
            modalBoxes[i].style.display = "none";
            modalBoxes[i].classList.remove("modalBox-here");                    
		}
        boxElement.style.display = "block";
        setTimeout(function(){boxElement.classList.add("modalBox-here");}, 20);
	}
	
	//Hide box when clicking on the hiding button
	closeBoxBtn.onclick = function(event){
        setTimeout(function(){boxElement.style.display = "none";}, 1100);
        boxElement.classList.remove("modalBox-here");    
    }

    boxElement.onclick = function(event){
        if(event.target === this){
            return closeBoxBtn.onclick();
        }
    }
}


/**
 * Contains all the infobuttons and creates a modal box for them
 */
var infoButtonsModule = (function(){

    var showGoalsInfo = new modalBox("goalsInfoBox", "goalsInfoBtn", "closeGoalsInfo");
    var showHabitsInfo = new modalBox("habitsInfoBox","habitsInfoBtn","closeHabitsInfo");

})();

/**
 * Goal object
 * @param {*} name Name of the goal
 * @param {*} category Category of the goal
 */
function Goal(name, category){
    this.name = name;
    this.category = category;
    this.highScore = 0;
    this.missScore = 0;
    this.habits = [];

    this.setName = function(na){this.name = na};
    this.getName = function(){return this.name;};

    this.setCategory = function(ca){this.category = ca;};
    this.getCategory = function(){return this.category;};

    this.getCurrentScore = function(){
        var currSco = 0
        for(i = 0; i < this.habits.length; i++){
            currSco += this.habits[i].getCurrentStreak();
        }
        return currSco;
    };

    this.getHighScore = function(){
        if(this.highScore < this.getCurrentScore()){
            this.highScore = this.getCurrentScore();
        }
        return this.highScore;
    };
    this.setHighScore = function(hs){this.highScore = hs};
    
    this.addHabit = function(ha){this.habits.push(ha)};
    this.getHabits = function(){return this.habits};

    this.todoToday = function(){
        var todo = false;
        this.habits.forEach(function(habit){
            if(habit.getTaskToday()){
                todo = true;
            }
        })
        return todo;
    };

}

/**
 * Habit object
 */
function Habit(name, difficulty, days, notes){
    this.name = name;
    this.difficulty = difficulty;
    this.days = days;
    this.notes = notes;
    this.currentStreak = 0;
    this.highStreak = 0;
    this.totalFinish = 0;
    this.accomplished = false;

    this.difficultyScore = function(){
        switch(this.difficulty){
            case -1: return -15;
            case 0: return 10;
            case 1: return 25;
            case 2: return 50;
        }
    }

    var d = new Date();
    this.getTaskToday = function(){if(!this.accomplished){return this.days[d.getDay()];}}

    this.setName = function(nam){this.name = nam;}
    this.getName = function(){return this.name;}

    this.setDifficulty = function(dif){this.difficulty = dif;}
    this.getDifficulty = function(){return this.difficulty}

    this.setDays = function(days){this.days = days;}
    this.getDays = function(){return this.days;}

    this.setNotes = function(not){this.notes = not;}
    this.getNotes = function(){return this.notes;}

    this.finishHabit = function(){
            if(this.accomplished == false){
                this.totalFinish++;
                this.currentStreak += this.difficultyScore();
                if(this.currentStreak > this.highStreak && this.difficulty>-1 || this.currentStreak < this.highStreak && this.difficulty === -1){
                    this.highStreak = this.currentStreak;
                }
                this.accomplished = true;
            } else{
                this.totalFinish --;
                this.currentStreak -= this.difficultyScore();
                this.highStreak -= this.difficultyScore();
                this.accomplished = false;
            }        
        }

    this.getTotalFinish = function(){return this.totalFinish;}
    this.getCurrentStreak = function(){return this.currentStreak;}
    this.getHighStreak = function(){return this.highStreak;}

    this.isAccomplished = function(){return this.accomplished;}

    }


/**
 * Collection of goals, habits and categories
 */
var goalsArray = [];
var habitsArray = [];


var categoriesArray = [];
var fillCategories = function(array){
    array.length = 0;
    goalsArray.forEach(function(element){
        if(array.indexOf(element.getCategory()) < 0){        
            array.push(element.getCategory());
        }
    })
}
fillCategories(categoriesArray);

/**
 * Determines which goal we are focusing on -> determines habits view
 */
var contextGoal;

var contextHabit = habitsArray[0];

/**
 * Create a new goal and add it to DOM
*/
var CreateGoalModule = (function(){

    //Start the modal
    var createGoalModal = new modalBox("addGoalBox", "addGoalBtn", "cancelCreateGoalBtn");
    
    //Form for input for new goal
    var createGoalForm = document.getElementById("newGoalInput");
    var createGoalBtn = document.getElementById("createGoalBtn");
    // Public appendgoal function that allows to add a goal to DOM

    var addNewGoal = function(){
        //Input cannot be empty
    if(createGoalForm[0].value != "" && createGoalForm[1].value != ""){

        var name = createGoalForm[0].value;
        var category = createGoalForm[1].value;

            var newGoal = {
                "name":name,
                "category":category,
                "highScore":0,
                "habits":[]
            }

            $.post("/addgoal", newGoal);

            //Clear form values                
            $("input:text").val("");
        }
    }

    //React on create goal button
    createGoalBtn.onclick = function(event){
        addNewGoal();
        //Hide modal
        setTimeout(function(){document.getElementById("addGoalBox").style.display = "none";}, 1100);
        document.getElementById("addGoalBox").classList.remove("modalBox-here");
    }

    //Public function to add goal to the DOM
    return{
        appendGoal: function(newGoal){
                var goalBlock = "<div id=\"" + newGoal.getName() + "\" class=\"goalBlock columnBlock\" data-todotoday=\"" + newGoal.todoToday() +"\">"
                                + "<div id=\"progressColor\"></div><strong>" + newGoal.getName() + "<div id=\"todotodayIcon\"></div></strong>" + ""
                                + "<div class=\"goalInfoBlock columnBlockContent\" id=\"" + newGoal.getName() + "GoalInfoBlock\">"
                                + "<div>Category: <b class=\"goalValue categoryValue\">" + newGoal.getCategory()  + "</b></div>"
                                + "<div id=\"" + newGoal.getName() + "_currSco\">Current score: <b class=\"goalValue scoreValue\" data-score=\"" + newGoal.getCurrentScore() + "\">" + newGoal.getCurrentScore() + "</b></div>"
                                + "<div id=\"" + newGoal.getName() + "_highSco\">High score: <b class=\"goalValue scoreValue\" data-score=\"" + newGoal.getHighScore() + "\">" + newGoal.getHighScore() +"</b></div><br>"
                                + "<button id=\"" + newGoal.getName() + "_editBtn\"" + "\" class=\"goalEditBtn\">Edit</button>"                                
                                + "</div></div>";
                $('#goalsList').append(goalBlock);
        }
    }

})();

/**
 * Everything related to the infoboxes per goal
 */
var SeeGoalInfo = (function(){

    //Clicking on a goal opens it's info and hides others
    var seeInfo = function(infoBoxId){
        this.infoBox = document.getElementById(infoBoxId + "GoalInfoBlock");
        var selectedGoal = document.getElementById(infoBoxId);
        var infoBoxes = document.getElementsByClassName("goalInfoBlock");
        var goalBoxes = document.getElementsByClassName("goalBlock");

        for(i = 0; i < goalBoxes.length; i++) {
            goalBoxes[i].classList.remove("selectedGoal");
        }
        
        setTimeout(function(){selectedGoal.classList.add("selectedGoal");}, 20);

        this.infoBox.style.display = "block";     

        for(i = 0; i < infoBoxes.length; i++){
            if(infoBoxes[i].id != infoBox.id){
                var toHide = infoBoxes[i];
                setTimeout(function(){toHide.style.display = "none";}, 1000);
            }
        }   
    }

    //Everything related to editing a goal
    var editInfoModal = function(){

        //Declaring all kind of relevant elements
        var editInfoBtn = document.getElementsByClassName("goalEditBtn");
        var editForm = document.getElementById("editGoalInput")
        var saveChangesBtn = document.getElementById("saveGoalEditsBtn");
        var modalBoxes = document.getElementsByClassName("modalBox");
        var deleteBtn = document.getElementById("deleteGoalBtn");
        var editingGoal;     
        
         //Hide other modalBoxes cause this is a modalbox
        var hideBoxes = function(){
                setTimeout(function(){document.getElementById("editGoalBox").style.display = "none";}, 1100);
                document.getElementById("editGoalBox").classList.remove("modalBox-here");                            
        }

        //The actual edit for all edit buttons
        for(i = 0; i < editInfoBtn.length; i++){

            //Find which goal we are editing
            editInfoBtn[i].onclick = function(event){
                var editBtn = event.target;
                goalsArray.forEach(function(goal){
                    if(editBtn.id.substring(0, editBtn.id.length - 8) == goal.getName()){
                        editingGoal = goal;
                    }
                });

                //Fill the form with the values of the current goal
                editForm[0].value = editingGoal.getName();
                editForm[1].value = editingGoal.getCategory();

                //Show this modal box
                document.getElementById("editGoalBox").style.display = "block";
                setTimeout(function(){document.getElementById("editGoalBox").classList.add("modalBox-here");}, 20);
                document.getElementById("editGoalBox").onclick = function(event) {
                    if(event.target === this) {
                        hideBoxes();
                    }
                }                                         
            
                //Update changes in array, clear the DOM to refill it with the new array values
                saveChangesBtn.onclick = function(){
                    var toEdit = editingGoal.getName();
                    var name = editForm[0].value;
                    var category = editForm[1].value;
                    
                    $.post("/editgoal", {"toEdit":toEdit, "name":name, "category":category});

                    //Hide the modal box
                    hideBoxes();        
                    
                }

                //Hide edit box
                document.getElementById("cancelEditGoalBtn").onclick = function(){
                    hideBoxes();
                };

                //Remove element from array and DOM
                deleteBtn.onclick = function(){
                    var name = editingGoal.getName();
                    $.post("/deletegoal", {"name":name});
                    hideBoxes();
                }

            }
        }

        
    }
    
    //Public method that assigns the listeners to each goal of the array
    return{
        setGoalListener: function(){
            goalsArray.forEach(function(goal){
                var goalBlock = document.getElementById(goal.getName());
                //See info and be able to edit it
                goalBlock.onclick = function(event){
                    contextGoal = goal;
                    refreshHabits();
                    seeInfo(goal.getName());
                    editInfoModal();
                }
            })
        }
    }

})();

/**
 * Everything related to the filter goals button and drop down menu
 */
var FilterGoals = (function(){
    //Relevant elements
    var dropDownBtn = document.getElementById("dropdown");
    var btnList = document.getElementById("goalsFilterBtns");
    var filterBtns = document.getElementsByClassName("categBtn");

    var mousein = false;

    dropDownBtn.onmouseleave = function(){
            while(btnList.hasChildNodes()){
                btnList.removeChild(btnList.lastChild);
            }
    }

    //What to do when the filter button is clicked
    dropDownBtn.onmouseenter = function(){
        
                $(btnList).append("<button id=\"allcategs\">All goals</button>")
            categoriesArray.forEach(function(categ){
                var categBtnEl = "<button class=\"categBtn\" id=\"" + categ + "_categBtn\">" + categ + "</button>";
                $(btnList).append(categBtnEl);
                filter();
            });
    }

    //Function that filters the visible goals when a filter is clicked
    var filter = function() {
        
        //All goal elements
        var goalEl = document.getElementsByClassName("goalBlock");
        
        //If choosing for all categories
        document.getElementById("allcategs").onclick = function(){
            for(i = 0; i < goalEl.length; i++){
                goalEl[i].style.display = "block";
            }

            //Close filter buttons
            while(btnList.hasChildNodes()){
                btnList.removeChild(btnList.lastChild);
            }
            openList = false;

        }

        //Filter goals
        for(i = 0; i < filterBtns.length; i++){
            filterBtns[i].onclick = function(event){

                //Hide all goals
                for(i = 0; i < goalEl.length; i++){
                    goalEl[i].style.display = "none";
                }

                //Which filter has been clicked?
                var filterBtn = event.target;
                //Make all goals corresponding to selected category visible
                goalsArray.forEach(function(goal){
                    if(goal.getCategory() == filterBtn.id.substring(0, filterBtn.id.length - 9)){
                        document.getElementById(goal.getName()).style.display = "block";
                    }
                })

                //Close filterlist
                while(btnList.hasChildNodes()){
                    btnList.removeChild(btnList.lastChild);
                }
                openList = false;
            }
    }
    }

})();

/**
 * Function that adds a habit to the DOM
 */
var appendHabbit = function(habit){

    //Adds text if task needs to be completed that day
    var habitTodo = function(){
        if(habit.getTaskToday()){
            return "<b>Needs to be completed today</b><br><br>"
        } else {
            return "";
        }
    }

    //Description of difficulty of the habit
    var habitDifficulty = function(){
        switch(habit.getDifficulty()){
            case -1: return "bad habit (-15pts)";
            case 0: return "easy (+10pts)";
            case 1: return "medium (+25pts)";
            case 2: return "hard (+50pts)";
            default: return "undefined (?pts)";
        }
    }

    //Description of which days the habit needs to be completed
    var repeats = function(){
        var daysOfWeek = ["su", "mo", "tu", "we", "th", "fr", "sa"]
        var habitDays = habit.getDays();
        console.log(habit.getName() + habitDays);
        var dayString = "";

        for(i = 0; i < 7; i++){
            if(habitDays[i]){
                dayString = dayString + daysOfWeek[i] + " - ";
            }
        }

        if(dayString){
            dayString = dayString.substring(0, dayString.length - 3);
        }

        return dayString;

    }

    //The whole habit DOM element
    var habitBlock = "<div class=\"habitBlock columnBlock\" id=\"" + habit.getName() + "_hab\" data-todotoday=\"" + habit.getTaskToday() + "\">"
                    + "<button id=\"" + habit.getName() + "_habFin\" class=\"habFinBtn\" data-accomplished=\"" + habit.accomplished + "\"><span>Check</span></button>" 
                    + "<strong>" + habit.getName() + "<div id=\"todotodayIcon\"></div></strong>"
                    + "<div class=\"habitInfoBlock columnBlockContent\" id=\"" + habit.getName() + "_habInfo\">" 
                    + habitTodo()
                    + "<p>Difficulty:  " + habitDifficulty() + "</p>"
                    + "<div id=\"" + habit.getName() + "_currStr\">Current streak score: " + habit.getCurrentStreak() + "</div><br>"
                    + "<div id =\"" + habit.getName() + "_highStr\">Highest streak score: " + habit.getHighStreak() + "</div><br><br>"
                    + "<p>Repeats: " + repeats() + "<br></p>"
                    + "<p>Notes:<br><i>" + habit.getNotes() + "</i><br></p>"
                    + "<button id=\"" + habit.getName() + "_habEdBtn\" class=\"habitEditBtn\">Edit</button>"
                    + "</div></div>";

    $('#habitsList').append(habitBlock);
}

/**
 * Function that shows the habits matching the selected goal
 */
var refreshHabits = function(){
    
    if(contextGoal){
        var habitBlocks = document.getElementsByClassName("habitBlock");

        for(i = 0; i < habitBlocks.length; i++){
            habitBlocks[i].style.display = "none";
        }

        contextGoal.getHabits().forEach(function(element){
            document.getElementById(element.getName() + "_hab").style.display = "block";
        })
    }

    /**
    * Everything linked to show/hide the habit info
    */
    var HabitsInfo = (function(){
        
            var habitsBoxes = document.getElementsByClassName("habitBlock");
            var habitInfoBx = document.getElementsByClassName("habitInfoBlock");
        
            //Set the contexthabit to the clicked habit
            for(i = 0; i < habitsBoxes.length; i++){
                habitsBoxes[i].onclick = function(event){
                    var habitBox = event.currentTarget;
                    habitsArray.forEach(function(habit){
                        if(habit.getName() == habitBox.id.substring(0, habitBox.id.length - 4)){
                            contextHabit = habit;
                        }
                    })
        
                    //Only shows the contexthabit
                    HabitsInfo.hideHabbitBoxes();
                }
                
            }
        
            return {
                
                //Function that hides all infoboxes except the context habit
                hideHabbitBoxes: function(){

                    for(i = 0; i < habitInfoBx.length; i++){
                        if(habitInfoBx.id != contextHabit.getName() + "_habInfo"){
                            habitsBoxes[i].classList.remove("selectedHabit");
                            var infoBx = habitInfoBx[i];
                            infoBx.style.display = "none";
                        }
                        
                    }

                    if(contextHabit){
                        document.getElementById(contextHabit.getName() + "_habInfo").style.display = "block";
                        setTimeout(function(){document.getElementById(contextHabit.getName() + "_hab").classList.add("selectedHabit");}, 20);   
                    }
                }
        
            }
        
        })();
        

        /**
         * Update counters when habit is checked and visuals
         */
        var HabitCheck = (function(){
            
                var habitCheckBtns = document.getElementsByClassName("habFinBtn");
            
                for(i = 0; i < habitCheckBtns.length; i++){
                    habitCheckBtns[i].onclick = function(event){
                        var clickedHabitBtn = event.target;
                        var clickedHabit;
                        habitsArray.forEach(function(hab){
                            if(clickedHabitBtn.id.substring(0, clickedHabitBtn.id.length - 7) === hab.getName()){
                                clickedHabit = hab;
                            }
                        });

                        clickedHabit.finishHabit();

                        var checkedHabit = clickedHabit.getName();
                        var currentStreak = clickedHabit.getCurrentStreak();
                        var highStreak = clickedHabit.getCurrentStreak();

                        $.post("/habitcheck", {"checkedHabit":checkedHabit, "currentStreak":currentStreak, "highStreak":highStreak});

                    }
                }
            
            })();


            /**
             * Everything linked to editing a habit
             */
            var editHabit = (function(){
                
                    //Relevant elements
                    var editHabitModal = document.getElementById("editHabitBox");
                    var editHabitBtns = document.getElementsByClassName("habitEditBtn");
                    var cancelEditHabitBtn = document.getElementById("cancelEditHabitBtn");
                    var saveEditHabitBtn = document.getElementById("saveEditHabitBtn");
                
                    var modalBoxes = document.getElementsByClassName("modalBox");
                
                    var habitEditForm = document.getElementById("editHabitInput");
                    var editDays = document.getElementsByName("habitDayEd");
                    var editNotes = document.getElementById("habitNotesEd");

                    var hideBoxes = function(){
                        setTimeout(function(){editHabitModal.style.display = "none";}, 1100);
                        editHabitModal.classList.remove("modalBox-here");                            
                    }
                
                    //Add click listener to all edit buttons
                    for(i = 0; i < editHabitBtns.length; i++){

                        //Show the edit habit modal
                        editHabitBtns[i].onclick = function(event){

                        editHabitModal.onclick = function(event){
                            if(event.target === this){
                                hideBoxes();
                            }
                        }
                
                        editHabitModal.style.display = "block";
                        setTimeout(function(){editHabitModal.classList.add("modalBox-here");}, 20);                        
                
                        //Get the value for the name
                        habitEditForm[0].value = contextHabit.getName();
                
                        //Get the difficulty
                        switch(contextHabit.getDifficulty()){
                            case -1: document.getElementById("habitDiff-1Ed").checked = true; break;
                            case 0: document.getElementById("habitDiff0Ed").checked = true; break;
                            case 1: document.getElementById("habitDiff1Ed").checked = true; break;
                            case 2: document.getElementById("habitDiff2Ed").checked = true; break;            
                        }
                        
                        //Get the set days
                        for(i = 0; i<contextHabit.getDays().length; i++){
                            editDays[i].checked = contextHabit.getDays()[i];
                        }
                
                        //Get notes
                        document.getElementById("habitNotesEd").value = contextHabit.getNotes();
                
                        }
                
                    }
                
                    //Delete habit in DOM, set new values to the habit, reattach to DOM and refresh the listeners
                    saveEditHabitBtn.onclick = function(){                        var name = habitEditForm[0].value;
                        var difficulty = parseInt($('form input[name=habitDiffEd]:checked').val());
                        var days = [];
                        for(i = 0; i < editDays.length; i++){
                            days.push(editDays[i].checked);
                        }
                        var notes = editNotes.value;
                        var toEdit = contextHabit.getName();
                        
                        $.post("/edithabit", {"toEdit": toEdit,"name":name, "difficulty":difficulty, "days":days, "notes":notes})

                        hideBoxes();
                    }
                
                    //Close modal box
                    cancelEditHabitBtn.onclick = function(){
                        hideBoxes();
                    }
                
                })();

};

/**
 * Everything linked to adding a new habit
 */
var addNewHabit = (function(){
    
    //Opens the modalbox to add a habit
    modalBox("createHabitBox", "addHabitBtn", "cancelCreateHabitBtn");
    
    //Get relevant elements
    var createHabitModal = document.getElementById("createHabitBox");
    var createHabitForm = document.getElementById("newHabitInput");
    var createHabitBtn = document.getElementById("createHabitBtn");
    
    //Adds a new habit to the array and to the DOM
    var addNewHabit = function(){

        if(createHabitForm[0].value != ""){

            //Retrieve form input for habit attributes
            var habitName = createHabitForm[0].value;
            var difficulty = parseInt($('form input[name=habitDiff]:checked').val());
            var daysCheckBxs = document.getElementsByName("habitDay");
            var days = [];
            for(i = 0; i < daysCheckBxs.length; i++){
                days.push(daysCheckBxs[i].checked);
            }
            var notes = document.getElementById("habitNotes").value;
            var toAddGoal = contextGoal.getName();

            $.post("/addhabit", {"goalName":toAddGoal, "name":habitName, "difficulty":difficulty, "days":days, "notes":notes});


            //Reset input boxes
            $("input:text").val("");

        }

        //Hide habit modal
        setTimeout(function(){document.getElementById("createHabitBox").style.display = "none";}, 1100);
        document.getElementById("createHabitBox").classList.remove("modalBox-here");      
    }

    createHabitBtn.onclick = function(){
        addNewHabit();
    }
    
    /**
     * Everything related to deleting a habit
     */
    var deleteHabit = (function(){

        document.getElementById("deleteHabitBtn").onclick = function(event){
            var toDelete = contextHabit.getName();
            $.post("/deletehabit", {"toDelete":toDelete});
            setTimeout(function(){document.getElementById("editHabitBox").style.display = "none";}, 1100);
            document.getElementById("editHabitBox").classList.remove("modalBox-here");        
        }
        
    })();

})();

/**
 * Everything related to searching for a goal
 */
var SearchFilter = (function(){

    //Relevant elements
    var searchBar = document.getElementById("searchBar");
    var allGoals = document.getElementsByClassName("goalBlock");
    var allHabits = document.getElementsByClassName("habitBlock");

        //When a character is typed in the search box
        searchBar.onkeyup = function(){

            //Hide habits if start searching
            if(searchBar.value.length != 0){
                for(i = 0; i < allHabits.length; i++){
                    allHabits[i].style.display = "none";
                }
            }

            //Show only relevant goals
            for(i = 0; i < allGoals.length; i++){
                if(allGoals[i].id.toLowerCase().includes(searchBar.value.toLowerCase())){
                    allGoals[i].style.display = "block";
                } else{
                    allGoals[i].style.display = "none";
                }
        }
        };

})();

var versionhash = -1;

setInterval(function(){

    $.getJSON("getdata", function(jsonList){

        if(versionhash != parseInt(jsonList[0])){

            versionhash = parseInt(jsonList[0]);
            goalsList = jsonList[1];

            goalsArray.length = 0;
            habitsArray.length = 0;

            var goalsInDocument = document.getElementById("goalsList");
            var habitsInDocument = document.getElementById("habitsList");

            while(goalsInDocument.hasChildNodes()){
                goalsInDocument.removeChild(goalsInDocument.lastChild);
            }
            while(habitsInDocument.hasChildNodes()){
                habitsInDocument.removeChild(habitsInDocument.lastChild);
            }

            goalsList.forEach(function(goal){

                var localGoal = new Goal(goal.name, goal.category);
                localGoal.setHighScore(parseInt(goal.highScore));

                if(goal.habits){
                    goal.habits.forEach(function(habit){
                        var localHabit = new Habit(habit.name, parseInt(habit.difficulty), habit.days, habit.notes);
                        localHabit.currentStreak = parseInt(habit.currentStreak);
                        localHabit.highStreak = parseInt(habit.highStreak);
                        localHabit.accomplished = habit.accomplished;
                        if(!habitsArray.indexOf(localHabit) >= 0 && !document.getElementById(localHabit.getName() + "_hab")){
                            habitsArray.push(localHabit);
                            localGoal.addHabit(localHabit);                 
                           appendHabbit(localHabit);
                        }
                    });
                }

            if(!goalsArray.indexOf(localGoal) >= 0){
                goalsArray.push(localGoal);
                if(!document.getElementById(localGoal.getName())){
                    CreateGoalModule.appendGoal(localGoal);
                }
            }
            });

            contextGoal = goalsArray[0];
            contextHabit = goalsArray[0].getHabits()[0];
            console.log(goalsArray);
            console.log(habitsArray);
            SeeGoalInfo.setGoalListener();
            refreshHabits();
            fillCategories(categoriesArray);
            habitsArray.forEach(function(habit){
                document.getElementById(habit.getName() + "_hab").style.display = "none";
            });
        }
        });
    }, 2000);