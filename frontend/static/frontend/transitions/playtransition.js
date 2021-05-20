
/* These functions handle transitions, difficulty and rock paper scissors game*/

let difficultyChoice = "";
let whoplaysfirst = "";

const tiplist = [
    "Pro tip: Carnivorous dinosaurs receive +1 DMG from Flying dinosaurs.",
    "Pro tip: Herbivorous dinosaurs receive +1 DMG from Carnivorous dinosaurs.",
    "Pro tip: Aquatic dinosaurs receive +1 DMG from Herbivorous dinosaurs.",
    "Pro tip: Flying dinosaurs receive +1 DMG from Aquatic dinosaurs.",
    "Pro tip: Agile dinosaurs can attack on their first turn. Watch out !",
    "Pro tip: Scaled dinosaurs are diehard and receive -1 DMG from other dinosaurs.",
    "Pro tip: Fierce dinosaurs deal +1 DMG against medium and large sized dinosaurs.",
    "Pro tip: Poisonous dinosaurs deal 1 DMG to any attacking dinosaur. Keep that in mind!",
    "Pro tip: Predator dinosaurs will destroy two eggs instead of one when attacking.",
    "Pro tip: Think of event cards as magic cards from other cards games.",
    "Pro tip: Keep in mind cards costs. You only have 2 energies per turn.",
    "Pro tip: It's up to you whether to attack your opponent's dinosaurs or eggs.",
    "Pro tip: The first player to destroy all of the opponent's eggs wins!",
    "Pro tip: Event cards have several types of effects that can turn the tide of the battle.",
    "Pro tip: Sometimes is best to save your strongest cards for later turns.",
    "Pro tip: Higher difficulty equals better rewards!",
    "Pro tip: Sometimes you might prefer small sized dinosaurs due to their low energy cost.",
    "Pro tip: Dinosaurs with a ZzZ icon over their heads can no longer attack on that turn.",
    "Pro tip: Dinosaurs with a Swords icon over their heads are ready to attack on that turn.",
    "Pro tip: Any dinosaur whose Life Points reaches Zero is instantly removed from the board.",
    "Pro tip: One of your eggs will be destroyed every turn if your deck has no cards left."
]

function setTiplist (){
    document.getElementById("tipbox").innerHTML = tiplist[Math.floor(Math.random()*21)]; 
}


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
    tl.call(setTiplist)
    tl.set("#difficultybox", {display: 'block'});

    return tl;
}

/*------------------- */

function pageIn() {

    checkHeight();  
    if (!checkHeight()){
        clearTimerCheck();

        tl2 = gsap.timeline();
        tl2.call(setTiplist)
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
    const button = new Audio('/static/frontend/sounds/button1.mp3');
    button.loop = false;
    button.play();
    console.log(difficulty);
    document.getElementById("startbutton").dataset.difficulty = difficulty;
    
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
        const button = new Audio('/static/frontend/sounds/winrps.mp3');
        button.loop = false;
        button.play();

        document.getElementById("startbutton").dataset.firstturn = "ply";

        document.getElementById("rpstitle").innerHTML="YOU WIN!";
        document.getElementById("rps").style.pointerEvents = 'none';
        document.getElementById("chooseOneDiv").innerHTML="";
        boardIn();


    }
    else if (CPUchoice.beats == selection.name) {
        displayCpuChoice(CPUchoice.name);
        console.log("YOU LOSE");
        const button = new Audio('/static/frontend/sounds/loserps.mp3');
        button.loop = false;
        button.play();

        document.getElementById("startbutton").dataset.firstturn = "opp";

        document.getElementById("rpstitle").innerHTML="YOU LOSE!";
        document.getElementById("rps").style.pointerEvents = 'none';
        document.getElementById("chooseOneDiv").innerHTML="";
        boardIn();
    }

    else {
        displayCpuChoice(CPUchoice.name);

        const button = new Audio('/static/frontend/sounds/button1.mp3');
        button.loop = false;
        button.play();
        
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

/* Play some audios on animations*/

function plyanimsound(soundeffect){
    const soundplay = new Audio(`/static/frontend/sounds/cards/${soundeffect}.wav`);
    soundplay.loop = false;
    soundplay.play();
}

/* ----Takes out rps and start game------*/

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
    .call(plyanimsound, ["Bambiraptor"])
    .from("#ply_eggs", {delay: 0.2, duration: 0.3, x: -1000, ease: "back.out(0.3)"})
    .from(".plyeggsCount", {duration: 0.5, opacity: 0})
    .call(plyanimsound, ["Elopteryx"])
    .from("#opp_eggs", {duration: 0.5, x: 2000, ease: "back.out(0.3)" })
    .from("#gameboard", {duration: 1.2, y: -1000, ease: "back.out(0.8)"})
    .from("#startbutton", {opacity: 0, duration: 0.7});

}

/* ----On page load functions-----*/


difficultybg();
pageIn();

/*------------------ */


/*---------Quit button--------*/

function openQuit(){
    var tl = gsap.timeline();
    tl.set("#quitconfirm", {display: 'block'})
    tl.from("#quitconfirm", {opacity: 0, duration: 1})
}

function closeQuit(){
    var tl = gsap.timeline();
    tl.to("#quitconfirm", {opacity: 0, duration: 1})
    tl.set("#quitconfirm", {display: 'none'})
    tl.set("#quitconfirm", {opacity: 1})
}

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