/* These functions handle transitions, difficulty and rock paper scissors game*/


/* ----Checks device's orientation------*/

function checkHeight(){
    let orientationdev = window.matchMedia("(orientation: portrait)");
    if (orientationdev.matches){
        document.getElementById("heightCheck").style.display = "block";
        document.getElementById("heightButton").disabled = true;
        return true;
    }

    else {
        document.getElementById("heightButton").disabled = false;
        return false;
    }
}

/*---- check device orientation every half a second-----*/
var timerCheck = setInterval(checkHeight, 500);

function clearTimerCheck(){
    clearInterval(timerCheck);
}

/*---------------- */
/* User clicked on continue button*/
function acceptHeight(){
    clearTimerCheck();
    var tl = gsap.timeline();

    tl.to("#heightCheck", {
        duration: 1,
        y: 300,
        opacity: 0
    })
    tl.set("#heightCheck", {display: 'none'})
    tl.from("#difficultybox", {
        display: 'block',
        duration: 1,
        y: 400,
        opacity: 0

    })
    tl.set("#difficultybox", {display: 'block'});

    return tl;
}

/*------------------- */

function pageIn() {

    checkHeight();  
    if (!checkHeight()){
        clearTimerCheck();

        tl2 = gsap.timeline();
        tl2.from("#difficultybox", {
            display: 'block',
            duration: 1,
            y: 400,
            opacity: 0
    
        })
        tl2.set("#difficultybox", {display: 'block'});
    }/* device is already landscape-oriented, skip to difficulty box*/  

    var tl = gsap.timeline();

    tl.to(".plytransition div", {
        duration: 1.5,
        scaleY: 0,
        transformOrigin: "top left",
        ease: "bounce.out"
    });

}
/* Animated background*/
function difficultybg() {
    var tl = gsap.timeline({repeat:-1});
    tl.to(".difficultypage", {
        duration: 30,
        backgroundPosition: "-2247px 0px",
        ease: Linear.easeNone
    });
}


/* Takes off difficulty page and enters rock paper scissors*/
function difficultyOut(difficulty) {
    if (difficulty){
        console.log("EASY");
    }
    var tl = gsap.timeline();
    tl.to("#difficultybox", {
        duration: 1,
        opacity: 0,
        scaleY: 0

    }).set("#difficultybox", {display: 'none'})
    .from("#rps", {
        display: 'block',
        duration: 1,
        y: 400,
        opacity: 0
    }).set("#rps", {display: 'block'})
    return tl;
}

/* -----Rock Paper Scissors minigame--------*/

const RPSlogic = [
    {
        name: 'rock',
        beats: 'scissors'},

    {
        name: 'paper',
        beats: 'rock'   
    },

    {   
        name: 'scissors',
        beats: 'paper'   
    }

]

const decisionRPS = document.querySelectorAll('[data-rpschoice]');

decisionRPS.forEach(decision => {
    decision.addEventListener('click', e => {
        const thisRPS = decision.dataset.rpschoice;
        console.log(`this RPS = ${thisRPS}`)
        const mychoice = RPSlogic.find(choice => choice.name == thisRPS);
        const otherchoices = RPSlogic.filter((rps) => {
            return rps.name != mychoice.name
        } )
        hideOthers(mychoice);
        checkRPSWinner(mychoice);
    })
})

function hideOthers(chosen){
    decisionRPS.forEach(decision => {
        if(decision.dataset.rpschoice != chosen.name){
            document.querySelector(`[data-rpschoice=${decision.dataset.rpschoice}]`).style.visibility='hidden';
            
        }
    })
}

function checkRPSWinner(selection){
    
    const CPUchoice = CpuRPS();
    if (selection.beats == CPUchoice.name){
        displayCpuChoice(CPUchoice.name);
        console.log("YOU WIN");
        document.getElementById("rpstitle").innerHTML="YOU WIN!";
        document.getElementById("rps").style.pointerEvents = 'none';
        document.getElementById("chooseOneDiv").innerHTML="";
        boardIn();


    }
    else if (CPUchoice.beats == selection.name) {
        displayCpuChoice(CPUchoice.name);
        console.log("YOU LOSE");
        document.getElementById("rpstitle").innerHTML="YOU LOSE!";
        document.getElementById("rps").style.pointerEvents = 'none';
        document.getElementById("chooseOneDiv").innerHTML="";
        boardIn();
    }

    else {
        displayCpuChoice(CPUchoice.name);
        console.log("DRAW");
        document.getElementById("rpstitle").innerHTML="DRAW!";
        document.getElementById("chooseOneDiv").innerHTML="";
        document.getElementById("rps").style.pointerEvents ='none';
       
        setTimeout(function(){ 
            document.getElementById("rps").style.pointerEvents ='auto';
            document.getElementById("rpsOppImg").src = "/static/frontend/images/icons/qmark.png";
            document.getElementById("rpsImgDiv").classList.add("opacityAnim");
            document.getElementById("rpsOppImg").classList.remove("rotate90");
            document.getElementById("rpstitle").innerHTML="Try again!";
            document.getElementById("chooseOneDiv").innerHTML="Choose one!";
        }, 2000);

        decisionRPS.forEach(element => {
            gsap.to(`[data-rpschoice=${element.dataset.rpschoice}]`, {visibility: 'visible', delay: 2});
            
        })

    }
}

function CpuRPS() {
    const random3 = Math.floor(Math.random()*3);
    return RPSlogic[random3]
}

function displayCpuChoice(cpuchoice){

    if (cpuchoice == "rock"){
        document.getElementById("rpsOppImg").src = "/static/frontend/images/icons/rock.png";
        document.getElementById("rpsOppImg").className += " rotate90";
        document.getElementById("rpsImgDiv").classList.remove("opacityAnim");

    }

    else if (cpuchoice == "paper"){
        document.getElementById("rpsOppImg").src = "/static/frontend/images/icons/paper.png";
        document.getElementById("rpsOppImg").className += " rotate90";
        document.getElementById("rpsImgDiv").classList.remove("opacityAnim");

    }

    else {
        document.getElementById("rpsOppImg").src = "/static/frontend/images/icons/scissors.png";
        document.getElementById("rpsOppImg").className += " rotate90";
        document.getElementById("rpsImgDiv").classList.remove("opacityAnim");

    }

}

/*-------------- */

/*-----Remove element from dom--- */
function removeElement(element) {
    if (typeof(element) === "string") {
      element = document.querySelector(element);
    }
    return function() {
        element.parentNode.removeChild(element);
    };
  }

/* ----Takes out rps and shows board------*/

function boardIn(){
    var tl = gsap.timeline();
    tl.to("#rps", {
        delay: 2.5,
        duration: 1,
        y: 400,
        opacity: 0
    })
    .set("#rps", {
        display: 'none'
    })
    .to(".difficultypage", {
        delay: 1,
        scaleY: 0,
        duration: 1,
    })
    .set(".difficultypage", {
        display: 'none'
    })
    .call(removeElement(".difficultypage"))
    .from("#ply_eggs", {delay: 0.2, duration: 1, x: -1000, ease: "back.out(0.3)"})
    .from(".plyeggsCount", {duration: 1, opacity: 0})
    .from("#opp_eggs", {duration: 1, x: 2000, ease: "back.out(0.3)" })
    .from("#gameboard", {duration: 2, y: -1000, ease: "back.out(1.7)"});
}

/* ----On page load functions-----*/

difficultybg();
pageIn();

/*------------------ */


/*---------Quit button--------*/
function pageOut() {
    var tl = gsap.timeline();    

    tl.to(".plytransition div", {
        duration: 1.5,
        scaleY: 1,
        transformOrigin: "bottom left",
        ease: "bounce.out"
    });

}

function redirectHome(){
    pageOut();
    setTimeout(function(){ window.location.href = "/jurassicrysis/home";}, 2000);
}

/* -------------------------*/