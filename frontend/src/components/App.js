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
let oppEnergies = 2;
let plyEnergies = 2;
let currentTurn = "";
let turnNumber = 1;

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
    if(event.target.className.includes("cardWrapper")){/* poner condicion enrgy*/
        document.getElementById("ply_board").classList.add("highlightTarget");
        /*plyEnergies*/
        if(plyEnergies == 2){
            if(event.target.dataset.cost == 1){
                document.getElementById("plyEng2").classList.add("highlightEnergy");
            }
            if(event.target.dataset.cost == 2){
                document.getElementById("plyEng2").classList.add("highlightEnergy");
                document.getElementById("plyEng1").classList.add("highlightEnergy");
            }
        }
        if(plyEnergies == 1){
            if(event.target.dataset.cost == 1){
                document.getElementById("plyEng1").classList.add("highlightEnergy");
            }
            if(event.target.dataset.cost == 2){
                document.getElementById("plyEng1").classList.add("invalidBorder");
            }
        }

        
    }
}, false);

document.addEventListener("dragend", function( event ) {
    // reset the transparency
    event.target.style.opacity = "";
    if(event.target.className.includes("cardWrapper")){
        document.getElementById("ply_board").classList.remove("highlightTarget");
        document.getElementById("plyEng1").classList.remove("highlightEnergy");
        document.getElementById("plyEng2").classList.remove("highlightEnergy");
        document.getElementById("plyEng1").classList.remove("invalidBorder");
        document.getElementById("plyEng2").classList.remove("invalidBorder");
    }
}, false);

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
        if(dragged.dataset.cost <= plyEnergies){/* Allow*/
            document.getElementById("plyEng1").classList.remove("highlightEnergy");
            document.getElementById("plyEng2").classList.remove("highlightEnergy");
            if(plyEnergies == 2){
                if(dragged.dataset.cost == 1){
                    document.getElementById("plyEng2").style.visibility = 'hidden';
    
                }
                if(dragged.dataset.cost == 2){
                    document.getElementById("plyEng2").style.visibility = 'hidden';
                    document.getElementById("plyEng1").style.visibility = 'hidden';
                }
            }

            if(plyEnergies == 1){
                document.getElementById("plyEng1").style.visibility = 'hidden';

            }
            
            dragged.parentNode.removeChild(dragged);
            let appenddiv = document.createElement("div");
            document.getElementById("ply_board").appendChild(appenddiv);
            let lastplychild = document.getElementById("ply_board").lastElementChild;
        
            ReactDOM.render(<SketchPlayerCard name={dragged.dataset.name}
                atk={dragged.dataset.atk} lifepoints={dragged.dataset.lifepoints}
                condition={dragged.dataset.condition} 
            />, lastplychild); /* pasar condition*/


        
            sortCards("ply");
            plyEnergies--;
            console.log(`Energy left: ${plyEnergies}`);

        }
        else{/* Now allow*/
            const wrong = new Audio('/static/frontend/sounds/wrong.wav');
            wrong.loop = false;
            wrong.play();
            console.log("No energy!")
        }
        
        
    }
  
}, false);

/*------Start button calls startGame------ */

document.addEventListener('DOMContentLoaded', function() {

     
    document.getElementById("turnButton").addEventListener('click', 
    function(){
        turnHandler("opp");
    })
    
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
    setTimeout(function(){ 
        console.log("FIRST TURN");
        turnHandler(currentTurn);
        document.getElementById("turnButton").style.display = 'block';
        }
    , 8500);
    
}

async function turnHandler(who){
    
    if(who == "ply"){
        await(turnTransition("ply"));
        const turn = new Audio('/static/frontend/sounds/turn1.mp3');
        turn.loop = false;
        turn.play();

        plyEnergies = 2;
        document.getElementById("plyEng1").style.visibility = 'visible';
        document.getElementById("plyEng2").style.visibility = 'visible';

        if(turnNumber != 1){
            document.getElementById("turnButton").classList.toggle('hover');
            document.getElementById("turnButton").style.pointerEvents = "auto";
            document.getElementById("turnButton").style.cursor = 'pointer';
            
        }
        turnNumber++; 
        setTimeout(function(){ drawCard("ply")}, 3000);
        setTimeout(function(){ draggableHand("on")}, 4200);
        setTimeout(function(){cardsReady("ply")}, 4300);
    }

    else{
        sleepPlyCard();
        await(turnTransition("opp"));
        document.getElementById("turnButton").classList.toggle('hover');
        document.getElementById("turnButton").style.pointerEvents = "none";
        draggableHand("off");

        oppEnergies = 2;
        document.getElementById("oppEng1").style.visibility = 'visible';
        document.getElementById("oppEng2").style.visibility = 'visible';

        const turn2 = new Audio('/static/frontend/sounds/turn2.wav');
        turn2.loop = false;
        turn2.play();

        turnNumber++;
        setTimeout(function(){ drawCard("opp")}, 2000);
        setTimeout(function(){ cardsReady("opp")}, 3000);
        setTimeout(function(){ cpuAi()}, 3500);
      
    }

}
/* Unorthodox/hacky way to signal certain events to components*/
/* Set cards so they are ready to attack again*/
function cardsReady(who){
    
    var event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

	let cards = document.getElementsByClassName(`inputTurn${who}`);
    for(let i = 0; i<cards.length; i++){
	    cards[i].dispatchEvent(event);
    }
}

function sleepPlyCard(){
    var event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

	let cards = document.getElementsByClassName("inputsleepply");
    for(let i = 0; i<cards.length; i++){
	    cards[i].dispatchEvent(event);
    }
}

function turnTransition(who){
    gsap.globalTimeline.clear();
    var tl = gsap.timeline();
   
    tl.set(`#${who}_turn`, {display: 'block'})
    tl.to(`#${who}_turn`, {duration: 0.5, opacity: 1})
    tl.to(`#${who}_turn`, {delay: 1, duration: 1, opacity: 0})
    tl.set(`#${who}_turn`, {display: 'none'});
    
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
        div1.dataset.cost=card.cost;
        div1.dataset.condition = card.condition_text;
        
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
        console.log(`hand.length after push: ${opphand.length}`);

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
            condition: "",
            classes: "cardplayedPly",
            can_attack: false
        }
        this.handleDragStart = this.handleDragStart.bind(this);
        this.attack1Turn = this.attack1Turn.bind(this);
        this.handleturnStart = this.handleturnStart.bind(this);
        this.handlesleepcard = this.handlesleepcard.bind(this);
    }

    componentDidMount(){
    	this.setState({life_points: this.props.lifepoints});
        this.setState({atk: this.props.atk});
        this.setState({cardname: this.props.name});
        this.setState({condition: this.props.condition}, function(){this.attack1Turn()});

        gsap.fromTo(ReactDOM.findDOMNode(this), {scaleX: 1.2, scaleY: 1.2},{duration: 1, scaleY: 1, scaleX: 1})
    }

    /* Passes attacking info to data handler*/
    handleDragStart(){
        handleAttacks.getAttack(this.state.atk, "ca");
        handleAttacks.showValues();

    }

    /* Checks if card can attack on its first turn*/
    attack1Turn(){
        if(this.state.condition.includes("Agile")){/* first turn attack*/
            this.setState({can_attack: true});
        }
      
    }

    /* Set cards ready to attack at the beginning of turn */
    handleturnStart(){
        this.setState({can_attack: true});
        console.log("Ready to Attack")
    }

    /*Set cards unable to attack at the end of turn  */
    handlesleepcard(){
        this.setState({can_attack: false});
    }

    render(){
    	return(
            <React.Fragment>
            <div className={this.state.classes} 
            onDragStart={this.handleDragStart}
            draggable={this.state.can_attack ? true : false}
            >
                <div>{this.state.can_attack ? 'Go' : 'zZzZ'}</div>
                <div>Atk:{this.state.atk} -------- LP:{this.state.life_points}</div>
                <div><b>{this.state.cardname}</b></div>
                <div>{this.state.condition}</div>
                <input className="inputTurnply" onInput={this.handleturnStart} />
                <input className="inputsleepply" onInput={this.handlesleepcard} />

            </div>
        </React.Fragment>
      );
    }
}

/* Sketches card played by opponent on board*/
class SketchOppCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            life_points: 0,
            atk: 0,
            cardname: "",
            classes: "border cardplayed transform10 navbarcolor blackbg font1w",
            condition: "",
            can_attack: false
        }
        this.attack1Turn = this.attack1Turn.bind(this);
        this.handleturnStart = this.handleturnStart.bind(this);
    }

    componentDidMount(){
    	this.setState({life_points: this.props.lifepoints});
        this.setState({atk: this.props.atk});
        this.setState({cardname: this.props.name});
        this.setState({condition: this.props.condition}, function(){this.attack1Turn()});

        gsap.fromTo(ReactDOM.findDOMNode(this), {scaleX: 1.2, scaleY: 1.2},{duration: 1, scaleY: 1, scaleX: 1});
    }

    attack1Turn(){
        if(this.state.condition.includes("Agile")){/* first turn attack*/
            this.setState({can_attack: true});
        }
      
    }

    handleturnStart(){
        this.setState({can_attack: true});
        console.log("Ready to Attack")
    }

    render(){
    	return(
            <React.Fragment>
                <div className={this.state.classes} 
                /* handlers drag enter drag end DROP*/
            
                >
                    <div>{this.state.can_attack ? 'Go' : 'zZzZ'}</div>
                    Atk: {this.state.atk} LP: {this.state.life_points}
                    <b>{this.state.cardname}</b>
                    <input className="inputTurnopp" onInput={this.handleturnStart} /> 
                </div>
            </React.Fragment>
      );
    }

}

/* Manages opponent's turn*/
async function cpuAi(){

    let pickrandom = 0;
    let cardtoPlay = [];
    
    await(sleep(1500));

    for(let i=0; i<2;i++){/* Attempts to play 2 cards*/
        if(opphand.length > 0){
            console.log(`cards in hand: ${opphand.length}`)
            pickrandom = Math.floor(Math.random()*opphand.length);
            if(opphand[pickrandom].cost <= oppEnergies){/* Card can be played*/
                cardtoPlay = opphand.splice(pickrandom, 1);
                console.log(cardtoPlay[0]);
                let cardDiscard = document.getElementById("opp_hand").lastElementChild;
                document.getElementById("opp_hand").removeChild(cardDiscard);
                sortCards("opp");
                
                let divCreate = document.createElement("div");
                divCreate.classList.add('border', 'cardinHand', 'blackbg', 'position');
                document.getElementById("boarddiv").appendChild(divCreate);
                
                /* simulates playing a card*/
                gsap.fromTo(divCreate, {top: '0%', left: '50%'},{xPercent:-50, yPercent:-50, left:"50%", top:"38%", duration: 0.8, ease: "power1.out"});
                await(sleep(2200));
                divCreate.parentNode.removeChild(divCreate);

                /*to mount component here */
                let appenddiv = document.createElement("div");
                document.getElementById("opp_board").appendChild(appenddiv);
                let lastoppchild = document.getElementById("opp_board").lastElementChild;
                
                ReactDOM.render(<SketchOppCard name={cardtoPlay[0].name}
                    atk={cardtoPlay[0].atk} lifepoints={cardtoPlay[0].lifepoints}
                     condition={cardtoPlay[0].condition} 
                />, lastoppchild);

                

                if(oppEnergies == 1){
                    if(cardtoPlay[0].cost == 1){
                        document.getElementById("oppEng1").style.visibility = 'hidden';
                        oppEnergies--;
                    }  
                }

                if(oppEnergies == 2){
                    if(cardtoPlay[0].cost == 1){
                        document.getElementById("oppEng2").style.visibility = 'hidden';
                        oppEnergies--;
                    }
                    if(cardtoPlay[0].cost == 2){
                        oppEnergies--;
                        oppEnergies--;
                        document.getElementById("oppEng2").style.visibility = 'hidden';
                        document.getElementById("oppEng1").style.visibility = 'hidden';
                    }
                }  
                await(sleep(1500));
            }
        }
        
    }
     
    await(sleep(1000));
    turnHandler("ply");
    return;
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

/* Allow/prevents player to play cards from hand*/
function draggableHand(onoff){

    if(onoff == "on"){
        var cards = document.getElementsByClassName("cardWrapper");
        for (var i = 0; i < cards.length; i++) {
            cards[i].draggable = true;
            cards[i].style.cursor = 'grab';
        }
    }
    
    else{
        var cards = document.getElementsByClassName("cardWrapper");
        for (var i = 0; i < cards.length; i++) {
            cards[i].draggable = false;
            cards[i].style.cursor = 'auto';
        }
    }
  
}
