/* Author: Luis Balladares
    For the CS50's Web development with Python and Javascript
*/

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
let oppEggs = 10;
let plyEggs = 10;
let currentTurn = "";
let turnNumber = 1;

/*Class to communicate attacks data between components */

class attackData {

    constructor() {
        this.atkValue = 0;
        this.atkDinoType = "";
        this.atkCondition = "";
    }

    getAttack(attackPoints, dinoType, condition) {
        this.atkValue = attackPoints;
        this.atkDinoType = dinoType;
        this.atkCondition = condition;
    }

    returnAttack() {
        return this.atkValue;
    }
    returnDinoType(){
    	return this.atkDinoType;
    }
    returnCondition(){
        return this.atkCondition
    }

    showValues(){
    	console.log(this.atkValue);
        console.log(this.atkDinoType);
        console.log(this.atkCondition);
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
            
            plyEnergies = plyEnergies - dragged.dataset.cost;
            dragged.parentNode.removeChild(dragged);
            let appenddiv = document.createElement("div");
            document.getElementById("ply_board").appendChild(appenddiv);
            let lastplychild = document.getElementById("ply_board").lastElementChild;
        
            ReactDOM.render(<SketchPlayerCard name={dragged.dataset.name}
                atk={dragged.dataset.atk} lifepoints={dragged.dataset.lifepoints}
                condition={dragged.dataset.condition} 
                size = {dragged.dataset.size}
                rarity = {dragged.dataset.rarity}
                type = {dragged.dataset.type}
                weak = {dragged.dataset.weak}
                 /* cost not needed*/
            />, lastplychild);

            sortCards("ply");
            /* plyEnergies--;*/
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

/* ---Enemy eggs----*/

function destroyEgg(who){
    if(who == "opp"){
        oppEggs--;
        if(handleAttacks.atkCondition.includes("Predator")){
            console.log("extra egg destroyed")
            oppEggs--
            const lastegg = document.getElementById("opp_eggs").lastElementChild;
            lastegg.parentNode.removeChild(lastegg);
        }
        const lastegg = document.getElementById("opp_eggs").lastElementChild;
        lastegg.parentNode.removeChild(lastegg);
        console.log(`oppeggs: ${oppEggs}`);

        if(oppEggs <= 0){
            console.log("A winner is you")
        }
        /* if oppeggs <= 0 llamar a you win*/
    }

    else{
        plyEggs--;
        console.log(`plyeggs: ${plyEggs}`);
        document.getElementById("plyEggsCounter").innerHTML = plyEggs;
        if(plyEggs <= 0){
            console.log("You lose !!")
        }
        /* if oppeggs <= 0 llamar a you lose*/
    }
}

document.getElementById("opp_eggs").addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
    
}, false);

document.getElementById("opp_eggs").addEventListener("drop", function(event) {
    event.preventDefault();

    if(dragged.className.includes("cardplayedPly")){
        console.log("dropped over eggs")
        document.getElementById("opp_eggs").classList.remove("highlightTarget");
        /* That card cannot attack again this turn*/
        var evento = new Event('input', {
            bubbles: true,
            cancelable: true,
            });
        dragged.getElementsByClassName("inputsleepply")[0].dispatchEvent(evento);
        destroyEgg("opp");
    }
});

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
        sleepCard("opp");
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
        sleepCard("ply");
        cardsReady("opp");
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

/* Put cards to sleep*/
function sleepCard(who){
    var event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

	let cards = document.getElementsByClassName(`inputsleep${who}`);
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
        gsap.to(".plyEnergy", {visibility: 'visible', duration: 1});
    }
    else{
        gsap.to(".oppEnergy", {visibility: 'visible', duration: 1});
    }
}

/* ----Fetch and draw a card----*/
async function drawCard(who){/* call destroyegg if plydeck.length==0*/

    if(who == "ply"){
        
        /*ifplydeck.length==0 call destroy egg and dont fetch */
        let response = await fetch(`/api/get_card/${plydeck.pop()}`);
        let card = await response.json();
        /* Adds wrapper to cards to achieve hidden effect in hand*/
        var parentEl = document.getElementById("ply_hand");
        var div1 = document.createElement("div");
        div1.classList.add("cardWrapper");
        
        div1.draggable = true;

        div1.dataset.name=card.name;
        div1.dataset.atk=card.attack;
        div1.dataset.lifepoints=card.life_points;
        div1.dataset.cost=card.cost;
        div1.dataset.condition = card.condition_text;
        div1.dataset.size = card.size;
        div1.dataset.rarity = card.rarity;
        div1.dataset.type = card.card_type;
        div1.dataset.weak = card.weak;
        
        parentEl.appendChild(div1);
        const lastchild = document.getElementById("ply_hand").lastElementChild;
        drawDeck("ply");

        ReactDOM.render(<SketchHandCard name={card.name}
             atk={card.attack}
             lifepoints={card.life_points}
             condition={card.condition_text}
             rarity={card.rarity}
             size={card.size}
             type={card.card_type}
             cost={card.cost}

             />, lastchild);

        sortCards("ply");
        
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
        cardToAdd.weak = card.weak;

        /* console.log(cardToAdd);*/
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
                    <div>Atk: {props.atk} Cost: {props.cost} LP: {props.lifepoints}</div>
                    <div><b>{props.name}</b></div>
                    <div>R: {props.rarity}</div>
                    <div>{props.condition}</div>
                    <div>Type: {props.type} Size: {props.size} </div>
                    
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
            can_attack: false,
            rarity: "",
            size: "",
            type: "",
            weak: "",
        }
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);

        this.attack1Turn = this.attack1Turn.bind(this);
        this.handleturnStart = this.handleturnStart.bind(this);
        this.handlesleepcard = this.handlesleepcard.bind(this);
        this.handleDamage = this.handleDamage.bind(this);
        this.handleDestroyed = this.handleDestroyed.bind(this);
        this.take1dmgply = this.take1dmgply.bind(this);
    }

    componentDidMount(){
    	this.setState({life_points: this.props.lifepoints});
        this.setState({atk: this.props.atk});
        this.setState({cardname: this.props.name});
        this.setState({rarity: this.props.rarity});
        this.setState({size: this.props.size});
        this.setState({type: this.props.type});
        this.setState({weak: this.props.weak});
        this.setState({condition: this.props.condition}, function(){this.attack1Turn()});

        gsap.fromTo(ReactDOM.findDOMNode(this), {scaleX: 1.2, scaleY: 1.2},{duration: 1, scaleY: 1, scaleX: 1});
    }

    /* Passes attacking info to data handler*/
    handleDragStart(){
        handleAttacks.getAttack(this.state.atk, this.state.type, this.state.condition);
        handleAttacks.showValues();

        let oppCards = document.getElementsByClassName("cardplayedOpp");
        for(let i=0; i< oppCards.length ; i++){
            oppCards[i].classList.add("highlightTarget");
        }

        document.getElementById("opp_eggs").classList.add("highlightTarget");

    }
    
    handleDragEnd(){
        let oppCards = document.getElementsByClassName("cardplayedOpp");
        for(let i=0; i< oppCards.length ; i++){
            oppCards[i].classList.remove("highlightTarget");
        }
        document.getElementById("opp_eggs").classList.remove("highlightTarget");
    }

    handleDragOver(){
        event.preventDefault();
    }

    handleDestroyed(){
    	console.log(`my hp is now: ${this.state.life_points}`);
        if(this.state.life_points <= 0){
            console.log("Executed with impunity!!");
            const thisNode = ReactDOM.findDOMNode(this);
            const parent = thisNode.parentNode;
            ReactDOM.unmountComponentAtNode(thisNode.parentNode);
            parent.parentNode.removeChild(parent);
        
        }
    }

    handleDamage(){
        let atkCalc = handleAttacks.returnAttack();
        if(handleAttacks.returnDinoType() == this.state.weak){
            atkCalc++;
            console.log("WEAK +1 DMG!")
        }
        if(this.state.condition.includes("Scaled")){
            atkCalc--;
            console.log("Scaled: -1 dmg!")
        }
        if(handleAttacks.atkCondition.includes("Fierce") && (this.state.size == "me" || this.state.size == "la")){
            console.log("Fierce +1 dmg");
            atkCalc++;
        }
        this.setState({ life_points: this.state.life_points - atkCalc}, function(){this.handleDestroyed()});

    }

    handleDrop(){
    	event.preventDefault();
        if(dragged.className.includes("cardplayedOpp")){
            console.log("being attacked!");
             /* That card cannot attack again this turn*/
             var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
                });
            dragged.getElementsByClassName("inputsleepopp")[0].dispatchEvent(evento);

            if(this.state.condition.includes("Poisonous")){
                console.log("poisonous dmg");
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                    });
                dragged.getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);
                
            }
            this.handleDamage();
        }	   
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

    /*Set cards unable to attack at the end of turn or if it attacks(last one is triggered by target card)  */
    handlesleepcard(){
        this.setState({can_attack: false});
    }

    take1dmgply(){
        this.setState({ life_points: this.state.life_points - 1}, function(){this.handleDestroyed()});

    }

    render(){
        
    	return(
            <React.Fragment>
            <div className={this.state.classes} 
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            onDragOver={this.handleDragOver}
            onDrop={this.handleDrop}
            draggable={this.state.can_attack ? true : false}
            data-condition={this.state.condition}
            style={{cursor: this.state.can_attack ? 'grab' : 'none'}}
            >
                <div>{this.state.can_attack ? 'Go' : 'zZzZ'}</div>
                <div>Atk:{this.state.atk} -------- LP:{this.state.life_points}</div>
                <div><b>{this.state.cardname}</b></div>
                <div>{this.state.condition}</div>
                <div>Size: {this.state.size}</div>
                <input className="inputTurnply" onInput={this.handleturnStart} />
                <input className="inputsleepply" onInput={this.handlesleepcard} />
                <input className="inputTake1dmgply" onInput={this.take1dmgply} />

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
            classes: "cardplayedOpp",
            condition: "",
            rarity: "",
            type: "",
            weak: "",
            size: "",
            can_attack: false
        }
        this.attack1Turn = this.attack1Turn.bind(this);
        this.handleturnStart = this.handleturnStart.bind(this);
        this.handlesleepcard = this.handlesleepcard.bind(this);
        this.take1dmgopp = this.take1dmgopp.bind(this);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDamage = this.handleDamage.bind(this);
        this.handleDestroyed = this.handleDestroyed.bind(this);
    }

    componentDidMount(){
    	this.setState({life_points: this.props.lifepoints});
        this.setState({atk: this.props.atk});
        this.setState({cardname: this.props.name});
        this.setState({type: this.props.type});
        this.setState({weak: this.props.weak});
        this.setState({size: this.props.size});
        this.setState({condition: this.props.condition}, function(){this.attack1Turn()});

        gsap.fromTo(ReactDOM.findDOMNode(this), {scaleX: 1.2, scaleY: 1.2},{duration: 1, scaleY: 1, scaleX: 1});
    }

    attack1Turn(){
        if(this.state.condition.includes("Agile")){/* first turn attack*/
            this.setState({can_attack: true});
        }
      
    }

    handlesleepcard(){
        this.setState({can_attack: false});
    }
    handleDragStart(){
        handleAttacks.getAttack(this.state.atk, this.state.type, this.state.condition);
        handleAttacks.showValues();
    }

    take1dmgopp(){
        this.setState({ life_points: this.state.life_points - 1}, function(){this.handleDestroyed()});
    }
    
    handleturnStart(){
        this.setState({can_attack: true});
        console.log("Ready to Attack")
    }

    handleDragOver(){
        event.preventDefault();
    }

    handleDrop(){
    	event.preventDefault();
    	console.log("being attacked!");
        var evento = new Event('input', {
            bubbles: true,
            cancelable: true,
            });
        dragged.getElementsByClassName("inputsleepply")[0].dispatchEvent(evento);

        if(this.state.condition.includes("Poisonous")){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
                });
            dragged.getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);
        }
        /* That card cannot attack again this turn*/
        
        this.handleDamage();
    
    }

    handleDestroyed(){
    	console.log(`my hp is now: ${this.state.life_points}`);
        if(this.state.life_points <= 0){
            console.log("Executed with impunity!!");
            const thisNode = ReactDOM.findDOMNode(this);
            const parent = thisNode.parentNode;
            ReactDOM.unmountComponentAtNode(thisNode.parentNode);
            parent.parentNode.removeChild(parent);
        
        }
    }

    handleDamage(){
        let atkCalc = handleAttacks.returnAttack();
        if(handleAttacks.returnDinoType() == this.state.weak){
            atkCalc++;
            console.log("WEAK +1 DMG!");
        }
        if(handleAttacks.atkCondition.includes("Fierce") && (this.state.size == "me" || this.state.size == "la")){
            console.log("Fierce atk+1");
            atkCalc++;
        }
        if(this.state.condition.includes("Scaled")){
            atkCalc--;
            console.log("Scaled: -1 dmg!")
        }
        this.setState({ life_points: this.state.life_points - atkCalc}, function(){this.handleDestroyed()});

    }

    render(){
    	return(
            <React.Fragment>
                <div className={this.state.classes} 
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                onDragStart={this.handleDragStart}
                data-can_attack={this.state.can_attack}
                data-condition={this.state.condition}
                >
                    <div>{this.state.can_attack ? 'Go' : 'zZzZ'}</div>
                    Atk: {this.state.atk} LP: {this.state.life_points}
                    <b>{this.state.cardname}</b>
                    <div>Type:{this.state.type}</div>
                    <div>{this.state.condition}</div>
                    <div>{this.state.size}</div>
                    <input className="inputTurnopp" onInput={this.handleturnStart} />
                    <input className="inputsleepopp" onInput={this.handlesleepcard} />
                    <input className="inputTake1dmgopp" onInput={this.take1dmgopp} />  
  
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
                     condition={cardtoPlay[0].condition} type={cardtoPlay[0].type}
                     size = {cardtoPlay[0].size} weak ={cardtoPlay[0].weak}
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
                await(sleep(1800));
            }
        }
        
    }

    /* Attemps to attack player's cards or eggs*/

    let oppDinos = document.getElementsByClassName("cardplayedOpp");
    let plyDinos = document.getElementsByClassName("cardplayedPly");
  
    if(oppDinos.length > 0){
        for(let i=0; i<oppDinos.length; i++){
            console.log(`checking dino ${i}`);
            if(oppDinos[i].dataset.can_attack == "true"){/* Ready to attack*/
                console.log(`dino ${i} can attack`);
                await(sleep(1500));
                if(Math.random() > 0.5){/* Attack a player's dino */
                    if(plyDinos.length > 0){

                        oppDinos[i].draggable = true;
                        gsap.fromTo(oppDinos[i], {scaleX: 1.4, scaleY: 1.4},{duration: 1.3, scaleY: 1, scaleX: 1});
                        await(sleep(1700))
                        triggerDragAndDrop(oppDinos[i], plyDinos[Math.floor(Math.random()*plyDinos.length)]);
                        oppDinos[i].draggable = false;
                    }
                    else{
                        gsap.fromTo(oppDinos[i], {scaleX: 1.4, scaleY: 1.4},{duration: 1.3, scaleY: 1, scaleX: 1});
                        await(sleep(1700))
                        destroyEgg("ply");
                        if(oppDinos[i].dataset.condition.includes("Predator")){
                            destroyEgg("ply");
                        }
                    }
                } 
                else{
                    gsap.fromTo(oppDinos[i], {scaleX: 1.4, scaleY: 1.4},{duration: 1.3, scaleY: 1, scaleX: 1});
                    await(sleep(1700))
                    destroyEgg("ply");
                    if(oppDinos[i].dataset.condition.includes("Predator")){
                        destroyEgg("ply");
                    } 
                }
             
            }

        }
    }

    await(sleep(1000));
    turnHandler("ply");
    return;
}
/* function for triggering drag and drop event*/
function triggerDragAndDrop(selectorDrag, selectorDrop) {
	console.log("enterd d&d fn");
    
    var fireMouseEvent = function (type, elem, centerX, centerY) {
        var evt = document.createEvent('MouseEvents')
        evt.initMouseEvent(
            type,
            true,
            true,
            window,
            1,
            1,
            1,
            centerX,
            centerY,
            false,
            false,
            false,
            false,
            0,
            elem
        )
        elem.dispatchEvent(evt)
  }

  if (!selectorDrop || !selectorDrag) return false

  // calculate positions
  var pos = selectorDrag.getBoundingClientRect();
  var center1X = Math.floor((pos.left + pos.right) / 2)
  var center1Y = Math.floor((pos.top + pos.bottom) / 2)
  pos = selectorDrop.getBoundingClientRect()
  var center2X = Math.floor((pos.left + pos.right) / 2)
  var center2Y = Math.floor((pos.top + pos.bottom) / 2)

  // mouse over dragged element and mousedown
  fireMouseEvent('mousemove', selectorDrag, center1X, center1Y)
  fireMouseEvent('mouseenter', selectorDrag, center1X, center1Y)
  fireMouseEvent('mouseover', selectorDrag, center1X, center1Y)
  fireMouseEvent('mousedown', selectorDrag, center1X, center1Y)

  // start dragging process over to drop target
  fireMouseEvent('dragstart', selectorDrag, center1X, center1Y)
  fireMouseEvent('drag', selectorDrag, center1X, center1Y)
  fireMouseEvent('mousemove', selectorDrag, center1X, center1Y)
  fireMouseEvent('drag', selectorDrag, center2X, center2Y)
  fireMouseEvent('mousemove', selectorDrop, center2X, center2Y)

  // trigger dragging process on top of drop target
  fireMouseEvent('mouseenter', selectorDrop, center2X, center2Y)
  fireMouseEvent('dragenter', selectorDrop, center2X, center2Y)
  fireMouseEvent('mouseover', selectorDrop, center2X, center2Y)
  fireMouseEvent('dragover', selectorDrop, center2X, center2Y)

  // release dragged element on top of drop target
  fireMouseEvent('drop', selectorDrop, center2X, center2Y)
  fireMouseEvent('dragend', selectorDrag, center2X, center2Y)
  fireMouseEvent('mouseup', selectorDrag, center2X, center2Y)

  return true
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
