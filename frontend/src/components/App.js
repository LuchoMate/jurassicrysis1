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
let opphand = [];
let currentTurn = "";

/*Class to communicate attacks data between components */

class attackData {

    constructor() {
        this.atkValue = 0;
        this.atkDinoType = "";
    }

    getAttack(attackPoints, dinoType) {
        this.atkValue = attackPoints;
        this.atkDinoType = dinoType;
    }

    returnAttack() {
        return this.atkValue;
    }
    returnDinoType(){
    		return this.atkDinoType;
    }
    showValues(){
    	console.log(this.atkValue);
        console.log(this.atkDinoType);
    }

}

let handleAttacks = new attackData();

/* ----Drag and Drop cards to play on player board----*/
var dragged;
document.addEventListener("drag", function( event ) {
}, false);

document.addEventListener("dragstart", function( event ) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it virtually invisible
    event.target.style.opacity = 0.01;
    if(event.target.className.includes("cardWrapper")){
        console.log("contains cardwrapper");
        document.getElementById("ply_board").classList.add("highlightTarget");
    }
}, false);

document.addEventListener("dragend", function( event ) {
    // reset the transparency
    event.target.style.opacity = "";
    if(event.target.className.includes("cardWrapper")){
        document.getElementById("ply_board").classList.remove("highlightTarget");
    }
}, false);

/*Esto posiblemente haya que ponerlo como global con restriccion
        por ej solo si event.target.classname == cardWrapper */

document.getElementById("ply_board").addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
    
}, false);

document.getElementById("ply_board").addEventListener("dragenter", function( event ) {
    
    /* document.getElementById("ply_board").style.background = "red";*/

}, false);

document.getElementById("ply_board").addEventListener("dragleave", function( event ) {
    
    // reset background of potential drop target when the draggable element leaves it
    document.getElementById("ply_board").style.background = "";
}, false);

document.getElementById("ply_board").addEventListener("drop", function( event ) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    document.getElementById("ply_board").classList.remove("highlightTarget");
    /* Allows only cards from hand*/
    if(dragged.className.includes("cardWrapper")){
        dragged.parentNode.removeChild(dragged);
        let appenddiv = document.createElement("div");
        document.getElementById("ply_board").appendChild(appenddiv);
        let lastplychild = document.getElementById("ply_board").lastElementChild;
     
        ReactDOM.render(<SketchPlayerCard name={dragged.dataset.name}
            atk={dragged.dataset.atk} lifepoints={dragged.dataset.lifepoints} 
        />, lastplychild);
    
        sortCards("ply");
    }
    
    
    
}, false);

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
        console.log(`turn handler opphand: ${opphand}`);

        const turn2 = new Audio('/static/frontend/sounds/turn2.wav');
        turn2.loop = false;
        turn2.play();

        tl.set("#opp_turn", {display: 'block', opacity: 0})
        tl.from("#opp_turn", {y: 1000, duration: 0.5, opacity: 1})
        tl.to("#opp_turn", {top: "50%", duration: 1.3})
        tl.to("#opp_turn", {y: -1000, duration: 0.5, opacity: 0})
        tl.set("#opp_turn", {display: 'none'});

        setTimeout(function(){ drawCard("opp")}, 3000);
        setTimeout(function(){ cpuAi()}, 3500);
        /* Restaurar energías opp*/
        /* llamar cpuAi*/
       
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
async function drawCard(who){/* call destroyegg if plydeck.length==0*/

    if(who == "ply"){
        
        /*ifplydeck.length==0 call destroy egg and dont fetch */
        let response = await fetch(`/api/get_card/${plydeck.pop()}`);
        let card = await response.json();
        /* Adds wrapper to cards to achieve nice hidden effect in hand*/
        var parentEl = document.getElementById("ply_hand");
        var div1 = document.createElement("div");
        div1.classList.add("cardWrapper");
        /* ACA PONERLE OTRA CLASE PARA LAS EVENT CARDS Y NO RESALTAR PLYBOARD*/
        div1.draggable = true;

        div1.dataset.name=card.name;
        div1.dataset.atk=card.attack;
        div1.dataset.lifepoints=card.life_points;
        
        parentEl.appendChild(div1);
        const lastchild = document.getElementById("ply_hand").lastElementChild;
        drawDeck("ply");

        ReactDOM.render(<SketchHandCard name={card.name}/>, lastchild);

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
        
        /*adds card to opp hand*/

        let cardToAdd = {};
        cardToAdd.name = card.name;
        cardToAdd.atk = card.attack;
        cardToAdd.lifepoints = card.life_points;
        cardToAdd.cost = card.cost;
        cardToAdd.type = card.card_type;
        cardToAdd.rarity = card.rarity;
        cardToAdd.size = card.size;
        cardToAdd.condition = card.condition_text;
        console.log(cardToAdd);
        opphand.push(cardToAdd);

        drawDeck("opp");
        ReactDOM.render(<SketchHandOpp />, lastchild);
        sortCards("opp");
 
    }
}

/* Sketches player's hand card inside wrapper div*/

function SketchHandCard(props){
        const classes = 'border cardinHand navbarcolor blackbg font1w';
        return <React.Fragment>
                <div className={classes}>
                    {props.name}
                </div>
            </React.Fragment>
}
/* Sketches opp's hand card inside wrapper div*/
function SketchHandOpp() {
    
    const classes = 'border cardinHand navbarcolor blackbg font1w';
    return <React.Fragment>
            <div className={classes}>
            </div>
        </React.Fragment>
}

/* Sketches card played by Player on board*/
class SketchPlayerCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            life_points: 0,
            atk: 0,
            cardname: "",
            classes: "border cardplayed transform10 navbarcolor blackbg font1w"

        }
        this.handleDragStart = this.handleDragStart.bind(this);

    }

    componentDidMount(){
    	this.setState({life_points: this.props.lifepoints});
        this.setState({atk: this.props.atk});
        this.setState({cardname: this.props.name});
    }

    handleDragStart(){
        handleAttacks.getAttack(this.state.atk, "ca");
        handleAttacks.showValues();
      }

    render(){
    	return(
            <React.Fragment>
                <div className={this.state.classes} 
                onDragStart={this.handleDragStart}
                draggable="true"
                >
                    Atk: {this.state.atk} LP: {this.state.life_points}
                    {this.state.cardname} 
                </div>
            </React.Fragment>
      );
    }

}

class SketchOppCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            life_points: 0,
            atk: 0,
            cardname: "",
            classes: "border cardplayed transform10 navbarcolor blackbg font1w"

        }
    }

    componentDidMount(){
    	this.setState({life_points: this.props.lifepoints});
        this.setState({atk: this.props.atk});
        this.setState({cardname: this.props.name});
    }

    render(){
    	return(
            <React.Fragment>
                <div className={this.state.classes} 
                /* handlers drag enter drag end DROP*/
            
                >
                    Atk: {this.state.atk} LP: {this.state.life_points}
                    {this.state.cardname} 
                </div>
            </React.Fragment>
      );
    }

}

async function cpuAi(){
    var cards = document.getElementsByClassName("cardWrapperOpp");
    await sleep(1000);

    if (cards.length > 0){
        const pickrandom = Math.floor(Math.random()*cards.length);
        console.log(`pickrandom: ${pickrandom}`);
        console.log(`opphand previa: ${opphand}`)
        let cardtoPlay = opphand.splice(pickrandom, 1);

        let appenddiv = document.createElement("div");
        document.getElementById("opp_board").appendChild(appenddiv);
        let lastoppchild = document.getElementById("opp_board").lastElementChild;

        ReactDOM.render(<SketchOppCard name={cardtoPlay[0].name}
            atk={cardtoPlay[0].atk} lifepoints={cardtoPlay[0].lifepoints} 
        />, lastoppchild);

        console.log(`card is: ${cardtoPlay.name}`);
        console.log(`opphand ahora: ${opphand}`);

    }

    else {
        turnHandler("opp"); /*finishes turn AÑADIR SI TIENE DINOS ATACAR*/
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