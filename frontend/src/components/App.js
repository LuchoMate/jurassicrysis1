import React from 'react';
import ReactDOM from 'react-dom';
/* import gsap from 'gsap';*/

/*---------Utilities----------*/
/*Removes element from dom*/
function removeElement(element) {
    if (typeof(element) === "string") {
      element = document.querySelector(element);
    }
    
    return function() {
        element.parentNode.removeChild(element);
    };
}

/*Adds a delay when needed*/
function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
}

/*------global variables------- */

let oppdeck = [];
let plydeck = [];
let currentTurn = "";
/*------Start button calls startGame------ */

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startbutton').addEventListener('click', function() {
        const button = new Audio('/static/frontend/sounds/button2.mp3');
        button.loop = false;
        button.play();

        var tl = gsap.timeline();
        tl.to("#startbutton", {scaleY: 0, scaleX: 0, duration: 1})
        tl.set("#startbutton", {display: 'none'})
        .call(startGame);

    });
});

/* Animates cards being shuffled into deck*/
function placeDeck(who){

    const shuffle = new Audio('/static/frontend/sounds/shuffle.mp3');
    shuffle.loop = false;
    shuffle.play();

    if(who=="opp"){
        var tl = gsap.timeline();
        tl.from("#opp_deck div", {left: "200%", stagger: 0.1});
    }

    else{
        var tl = gsap.timeline();
        tl.from("#ply_deck div", {left: "200%", stagger: 0.1});
    }
   
}

/* Animates drawing from deck*/
function drawDeck(who){
    const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
    drawsound.loop = false;
    drawsound.play();

    if(who=="ply"){
        var tl = gsap.timeline();
        const lastchild = document.getElementById("ply_deck").lastElementChild;
        tl.to(lastchild, {x: -400, y: 200, duration: 0.5})
        .to(lastchild, {opacity: 0, duration: 0.1})
        .call(removeElement(lastchild));

    }

    else{
        const lastchild = document.getElementById("opp_deck").lastElementChild;
        var tl = gsap.timeline();
        tl.to(lastchild, {x: -400, y: -200, duration: 0.5})
        .to(lastchild, {opacity: 0, duration: 0.1})
        .call(removeElement(lastchild));

    }

}

/*---Each player draw 5 cards to begin. */
async function startGame() {
    /* 
    placeDeck("opp");
    await sleep(2500);
    placeDeck("ply");
    await sleep(2500);*/

    const diff_chosen = document.getElementById("startbutton").dataset.difficulty;
    console.log(`gonna fetch oppdeck ${diff_chosen}`);
    currentTurn = document.getElementById("startbutton").dataset.firstturn;
     
    fetch(`/api/opp_deck/${diff_chosen}`)
    .then(response => response.json())
    .then(oppdata => {
        oppdata.shuffled.forEach(element => {
            oppdeck.push(element);
        });
        for (let i = 1; i < 6; i++) {
            setTimeout(function timer() {
                drawCard("opp");
            }, i * 1000);
        }
        
    })
    .then(console.log(oppdeck));

    console.log("gonna fetch players deck");

    fetch('/api/shuffled_deck')
    .then(response => response.json())
    .then(plydata => {
        plydata.shuffled.forEach(element => {
            plydeck.push(element);
        });
        for (let i = 1; i < 6; i++) {
            setTimeout(function timer() {
                drawCard("ply");
            }, i * 1000);
        }
    })
    .then(console.log(plydeck));

    setTimeout(function(){ showEnergy("ply"); showEnergy("opp")}, 8000);
    setTimeout(function(){ console.log("FIRST TURN"); turnHandler(currentTurn); }, 8500);
}

/* ---Handles players turns----*/

function turnHandler(who){
    var tl = gsap.timeline();
    if(who == "ply"){
        const turn = new Audio('/static/frontend/sounds/turn1.mp3');
        turn.loop = false;
        turn.play();

        tl.set("#ply_turn", {display: 'block', opacity: 0})
        tl.from("#ply_turn", {y: 1000, duration: 0.5, opacity: 1})
        tl.to("#ply_turn", {top: "50%", duration: 1.3})
        tl.to("#ply_turn", {y: -1000, duration: 0.5, opacity: 0})
        tl.set("#ply_turn", {display: 'none'})
        
        setTimeout(function(){ drawCard("ply")}, 3000);
        setTimeout(function(){ draggableHand("on")}, 3200);
        
        /* Restaurar energías*/


    }

    else{
        draggableHand("off");

        const turn2 = new Audio('/static/frontend/sounds/turn2.wav');
        turn2.loop = false;
        turn2.play();

        tl.set("#opp_turn", {display: 'block', opacity: 0})
        tl.from("#opp_turn", {y: 1000, duration: 0.5, opacity: 1})
        tl.to("#opp_turn", {top: "50%", duration: 1.3})
        tl.to("#opp_turn", {y: -1000, duration: 0.5, opacity: 0})
        tl.set("#opp_turn", {display: 'none'});

        setTimeout(function(){ drawCard("opp")}, 3000);
        /* Restaurar energías*/
       
    }

}

function showEnergy(who){
    
    if(who == "ply"){
        gsap.to(".plyEnergy", {opacity: 1, duration: 1});
    }
    else{
        gsap.to(".oppEnergy", {opacity: 1, duration: 1});
    }
}

/* ----Fetch and draw a card----*/
async function drawCard(who){/* call destroyegg if pop == undefined*/

    if(who == "ply"){
        
        let response = await fetch(`/api/get_card/${plydeck.pop()}`);
        let card = await response.json();
        
        var parentEl = document.getElementById("ply_hand");
        var div1 = document.createElement("div");
        div1.classList.add("cardWrapper");
        div1.draggable = false;
        parentEl.appendChild(div1);
        const lastchild = document.getElementById("ply_hand").lastElementChild;

        drawDeck("ply");
        ReactDOM.render(<SketchHandCard name={card.name} player="ply" />, lastchild);

        sortCards("ply");
        console.log(`ply: ${card.name}`);
    }
    else {
        
        let response = await fetch(`/api/get_card/${oppdeck.pop()}`);
        let card = await response.json();

        var parentEl = document.getElementById("opp_hand");
        var div1 = document.createElement("div");
        div1.classList.add("cardWrapperOpp");
        parentEl.appendChild(div1);
        const lastchild = document.getElementById("opp_hand").lastElementChild;
        
        drawDeck("opp");
        ReactDOM.render(<SketchHandCard name={card.name} player="opp" />, lastchild);
        sortCards("opp");
        console.log(`opp: ${card.name}`);
    }
}

/* Sketches hand's card inside wrapper div*/

function SketchHandCard(props){
    if(props.player == "ply"){
        const classes = 'border cardinHand navbarcolor blackbg font1w';
        return <React.Fragment>
                <div className={classes}>
                    {props.name}
                </div>
            </React.Fragment>

    }
    else{
        console.log("sketch opp")
        const classes = 'border cardinHand navbarcolor blackbg font1w';
        return <React.Fragment>
                <div className={classes}>
                    card card card
                </div>
            </React.Fragment>

    }
    
}

/* Arrange cards in players hand*/

function sortCards(who) {

    if(who=="ply"){

        var cards = document.getElementsByClassName("cardWrapper");
        
        if(cards.length > 2 ){
            for (var i = 0; i < cards.length; i++) {
            cards[i].style.transform = "rotate(" + (i-2)*4 +"deg)";
            }
        }
        
        else {
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.transform = "rotate(0)";
            }
        }

    }

    else{
        var cards = document.getElementsByClassName("cardWrapperOpp");
     
        if(cards.length > 2 ){
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.transform = "rotate(" + (10-(i*4)) +"deg)";
                }
        }
        
        else {
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.transform = "rotate(0)";
                }
        }
        
    }
   
}

/* Makes cards in player's hand draggable or undraggable*/
function draggableHand(onoff){

    if(onoff == "on"){
        var cards = document.getElementsByClassName("cardWrapper");
        for (var i = 0; i < cards.length; i++) {
            cards[i].draggable = true;
        }
    }
    
    else{
        var cards = document.getElementsByClassName("cardWrapper");
        for (var i = 0; i < cards.length; i++) {
            cards[i].draggable = false;
        }
    }
  
}

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            height : window.innerHeight,
            width : window.innerWidth
        }

    }

    componentDidMount() {
        console.log(this.state.height);
        console.log(this.state.width);
        console.log("cmp did mount");
    }

    render() {
        return <h1>React App</h1>
    }
}

/* ReactDOM.render(<App />, document.getElementById('root'))*/