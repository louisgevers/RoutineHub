
//Opens a modal box with a button that opens it and that closes it
function modalBox(boxElementId, openBoxBtnId, closeBoxBtnId){
	
	var boxElement = document.getElementById(boxElementId);
	var openBoxBtn = document.getElementById(openBoxBtnId);
	var closeBoxBtn = document.getElementById(closeBoxBtnId);
	var modalBoxes = document.getElementsByClassName("modalBox");
	var fadeTogle = function(){
		entryBlock.classList.toggle("blackbox-away");
	}
	var modalFade = function(){
		boxElement.classList.toggle("modalBox-here");
	}

	var entryBlock = document.getElementById("TransparentBlackBlock");
	
	//Show box when clicking on the opening button and hide other boxes
	openBoxBtn.onclick = function(event){
		for(i = 0; i < modalBoxes.length; i++){
			modalBoxes[i].style.display = "none";
		}
		
		boxElement.style.display = "block";
		setTimeout(function(){
			modalFade();			
			}, 20);
		fadeTogle();
	}
	
	//Hide box when clicking on the hiding button
	closeBoxBtn.onclick = function(event){
		fadeTogle();
		modalFade();
		setTimeout(function(){
		boxElement.style.display = "none";
		}, 1000);
	}

}


var modalBoxesModule = (function(){

	//Open the modal boxes when clicking on the corresponding buttons
	var loginModalOpen = new modalBox("LoginModalBox", "openLoginBoxButton", "closeLogin");
	var signupModalOpen = new modalBox("SignUpModalBox", "openSignupBoxButton", "closeSignUp");
	
})();
