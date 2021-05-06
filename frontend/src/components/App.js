/* Author: Luis Balladares
    For CS50's Web development with Python and Javascript
*/

import React from 'react';
import ReactDOM from 'react-dom';

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

/*Object to communicate attacks data between components */

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
    if(event.target.className.includes("cardWrapper") && dragged.dataset.type != "ev"){
        const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
        drawsound.loop = false;
        drawsound.play();

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

    if(dragged.className.includes("cardWrapper") && dragged.dataset.type =="ev"){

        const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
        drawsound.loop = false;
        drawsound.play();

        document.getElementById("ply_event").classList.add("highlightTarget");
        handleAttacks.getAttack(0, "", "");

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
    if(event.target.className.includes("cardWrapper")  && dragged.dataset.type != "ev"){
        document.getElementById("ply_board").classList.remove("highlightTarget");
        document.getElementById("plyEng1").classList.remove("highlightEnergy");
        document.getElementById("plyEng2").classList.remove("highlightEnergy");
        document.getElementById("plyEng1").classList.remove("invalidBorder");
        document.getElementById("plyEng2").classList.remove("invalidBorder");
    }
    if(dragged.className.includes("cardWrapper") && dragged.dataset.type =="ev"){
        document.getElementById("ply_event").classList.remove("highlightTarget");
        document.getElementById("plyEng1").classList.remove("invalidBorder");
        document.getElementById("plyEng2").classList.remove("invalidBorder");
        document.getElementById("plyEng1").classList.remove("highlightEnergy");
        document.getElementById("plyEng2").classList.remove("highlightEnergy");
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
    if(dragged.className.includes("cardWrapper") && dragged.dataset.type != "ev"){
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
        else{/* Not allow*/
            const wrong = new Audio('/static/frontend/sounds/wrong.wav');
            wrong.loop = false;
            wrong.play();
            console.log("No energy!")
        }  
    }
}, false);

function destroyEgg(who){
    if(who == "opp"){
        oppEggs--;
        if(oppEggs <= 0){
            console.log("you win")
        }
        const lastegg = document.getElementById("opp_eggs").lastElementChild;
        lastegg.parentNode.removeChild(lastegg);
        console.log(`oppeggs: ${oppEggs}`);

        if(handleAttacks.atkCondition.includes("Predator")){
            console.log("extra egg destroyed")
            oppEggs--
            if(oppEggs <= 0){
                console.log("you win")
            }
            const lastegg = document.getElementById("opp_eggs").lastElementChild;
            lastegg.parentNode.removeChild(lastegg);
            console.log(`oppeggs: ${oppEggs}`);
        }
        
    }

    else{
        plyEggs--;
        console.log(`plyeggs: ${plyEggs}`);
        document.getElementById("plyEggsCounter").innerHTML = plyEggs;
        if(plyEggs <= 0){
            console.log("You lose !!")
        }
        if(handleAttacks.atkCondition.includes("Predator")){
            console.log("extra egg destroyed")
            plyEggs--
            if(plyEggs <= 0){
                console.log("you lose!")
            }
            
        }
    }
}

function restoreEgg(who){
    if(who=="ply"){
        if(plyEggs < 10){
            console.log("restoring ply egg");
            plyEggs ++;
            document.getElementById("plyEggsCounter").innerHTML = plyEggs;
        }
    }

    else{
        if(oppEggs < 10){
            console.log("restoring opp egg");
            oppEggs++;
            console.log(`oppeggs: ${oppEggs}`);
            /* hacer la logica de colocar otro egg al grid*/
        }
    }
}

/* ---Enemy eggs----*/
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
        div1.dataset.event = card.event_effect;
        
        parentEl.appendChild(div1);
        const lastchild = document.getElementById("ply_hand").lastElementChild;
        drawDeck("ply");

        if(card.card_type != "ev"){
            ReactDOM.render(<SketchHandCard name={card.name}
                atk={card.attack}
                lifepoints={card.life_points}
                condition={card.condition_text}
                rarity={card.rarity}
                size={card.size}
                type={card.card_type}
                cost={card.cost}
   
                />, lastchild);
   
        }

        else{
            ReactDOM.render(<SketchEventHand name={card.name}
                condition={card.condition_text}
                rarity={card.rarity}
                type={card.card_type}
                cost={card.cost}
                eventtext={card.event_effect}

            />, lastchild)

        }
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
        cardToAdd.event = card.event_effect;

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
        this.gain1Atk = this.gain1Atk.bind(this);
        this.restore1Lp = this.restore1Lp.bind(this);
        this.logAtk = this.logAtk.bind(this);
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
        
        document.getElementById("opp_eggs").classList.add("highlightTarget");

    }

    handleDragEnd(){
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

    gain1Atk(){
        this.setState({ atk: parseInt(this.state.atk, 10) + 1});
    }

    logAtk(){
        console.log(`my attack is now ${this.state.atk}`)
    }

    restore1Lp(){
        this.setState({life_points: parseInt(this.state.life_points, 10) + 1});
        console.log("Restore 1 lp")
    }

    render(){
        
    	return(
            <React.Fragment>
            <div className={this.state.classes} 
            onDragStart={this.handleDragStart}
            onDragOver={this.handleDragOver}
            onDragEnd={this.handleDragEnd}
            onDrop={this.handleDrop}
            draggable={this.state.can_attack ? true : false}
            data-condition={this.state.condition}
            style={{cursor: this.state.can_attack ? 'grab' : 'none'}}
            >
                <div>{this.state.can_attack ? 'Go' : 'zZzZ'}</div>
                <div>Atk:{this.state.atk} ------ LP:{this.state.life_points}</div>
                <div><b>{this.state.cardname}</b></div>
                <div>{this.state.condition}</div>
                <div>Size: {this.state.size}</div>
                <input className="inputTurnply" onInput={this.handleturnStart} />
                <input className="inputsleepply" onInput={this.handlesleepcard} />
                <input className="inputTake1dmgply" onInput={this.take1dmgply} />
                <input className="inputGain1atkply" onInput={this.gain1Atk}/>
                <input className="inputrestore1Lpply" onInput={this.restore1Lp} />
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
        this.gain1Atk = this.gain1Atk.bind(this);
        this.restore1Lp = this.restore1Lp.bind(this);

        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragExit = this.handleDragExit.bind(this);
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

    handleDragEnter(){
        this.setState({classes: "cardplayedOpp highlightTarget"});
    }

    handleDragExit(){
    	this.setState({classes: "cardplayedOpp"});
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
        this.setState({classes: "cardplayedOpp"});
        if(dragged.className.includes("cardplayedPly")){
                console.log("being attacked!");
                var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
                });
            dragged.getElementsByClassName("inputsleepply")[0].dispatchEvent(evento);

            if(this.state.condition.includes("Poisonous")){
                console.log("poisonous dmg");
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                    });
                dragged.getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);
            }
            /* That card cannot attack again this turn*/
            
            this.handleDamage();
        }
    	
    
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

    gain1Atk(){
        this.setState({ atk: parseInt(this.state.atk, 10) + 1});
    }

    restore1Lp(){
        this.setState({life_points: parseInt(this.state.life_points, 10) + 1});
        console.log("Restore 1 lp")
    }

    render(){
    	return(
            <React.Fragment>
                <div className={this.state.classes} 
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                onDragStart={this.handleDragStart}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragExit}
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
                    <input className="inputGain1atkopp" onInput={this.gain1Atk}/>
                    <input className="inputrestore1Lpopp" onInput={this.restore1Lp} />
  
  
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

                /* Dino Card*/
                if(cardtoPlay[0].type != "ev"){
                   
                    let divCreate = document.createElement("div");
                    divCreate.classList.add('border', 'cardinHand', 'blackbg', 'position');
                    document.getElementById("boarddiv").appendChild(divCreate);

                    const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
                    drawsound.loop = false;
                    drawsound.play();
                    
                    /* simulates playing a dino card*/
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
                }
                /* Event card*/
                else{
                    console.log("gonna play ev card")
                    let divCreate = document.createElement("div");
                    divCreate.classList.add('border', 'cardinHand', 'blackbg', 'position');
                    document.getElementById("boarddiv").appendChild(divCreate);

                    const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
                    drawsound.loop = false;
                    drawsound.play();
                    
                    /* simulates playing an event card*/
                    gsap.fromTo(divCreate, {top: '0%', left: '50%'},{xPercent:-50, yPercent:-50, left:"10%", top:"38%", duration: 0.8, ease: "power1.out"});
                    await(sleep(2200));
                    divCreate.parentNode.removeChild(divCreate);

                    ReactDOM.render(<SketchEventBoardOpp name={cardtoPlay[0].name}
                        rarity = {cardtoPlay[0].rarity}
                        type = {cardtoPlay[0].type}
                    />, document.getElementById("opp_event"));

                    await(sleep(1800));
                    handleOppEvent(cardtoPlay[0].event);
                }
                
                /* ------*/    
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
    /* */

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

/* ---Handling Event cards-----*/

function SketchEventHand(props){
    const classes = 'border cardinHand navbarcolor blackbg font1w';
    return <React.Fragment>
            <div className={classes}>
                Cost: {props.cost}
                <div><b>{props.name}</b></div>
                <div>R: {props.rarity}</div>
                <div>{props.condition}</div>
                <div>Type: {props.type}</div>
                
            </div>
        </React.Fragment>
}

class SketchEventBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            classes: "cardplayedplyEvent",
        }
    }

    componentDidMount(){
        gsap.fromTo(ReactDOM.findDOMNode(this), {scaleX: 1.2, scaleY: 1.2},{duration: 0.5, scaleY: 1, scaleX: 1});

        setTimeout(function(){
        gsap.to(document.querySelector("#ply_event div"), {opacity: 0, duration: 0.7});
        }, 2000);

        setTimeout(function(){ 
        ReactDOM.unmountComponentAtNode(document.getElementById("ply_event"));
        }, 3200);
    }

    
    render(){
        return(<React.Fragment>
            <div className={this.state.classes}>
                
                <div><b>{this.props.name}</b></div>
                <div>R: {this.props.rarity}</div>
                <div>Type: {this.props.type}</div>
                
            </div>
        </React.Fragment>

        );  
    }
}

document.getElementById("ply_event").addEventListener("dragover", function( event ) {
    // prevent default to allow drop
    event.preventDefault();
    
}, false);

document.getElementById("ply_event").addEventListener("drop", function( event ) {
    // prevent default to allow drop
    event.preventDefault();

    if(dragged.className.includes("cardWrapper") && dragged.dataset.type =="ev"){
        document.getElementById("ply_event").classList.remove("highlightTarget");
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
            
            ReactDOM.render(<SketchEventBoard name={dragged.dataset.name}
                rarity = {dragged.dataset.rarity}
                type = {dragged.dataset.type}
            />, document.getElementById("ply_event"));

            
            sortCards("ply");
            handlePlyEvent(dragged.dataset.event);
            console.log(`Energy left: ${plyEnergies}`);
        }
        else{/* Not allow*/
            const wrong = new Audio('/static/frontend/sounds/wrong.wav');
            wrong.loop = false;
            wrong.play();
            console.log("No energy!")
        } 
    }
    

}, false);

/* --handles output of event cards for player--*/
async function handlePlyEvent(eventTexto){
    await(sleep(1000));

    if(eventTexto.split("destroyegg").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("destroyegg").length - 1 ; i++){
          console.log("destroy opp egg");
          destroyEgg("opp");
          await(sleep(500));
        }
    }

    if(eventTexto.split("restoreegg").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("restoreegg").length - 1 ; i++){
            restoreEgg("ply");
            await(sleep(500));
        }
    }

    if(eventTexto.split("drawcard").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("drawcard").length - 1 ; i++){
          console.log("draw card");
          drawCard("ply");
          await(sleep(1200));
        }
    }

    if(eventTexto.split("1damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("1damage").length - 1 ; i++){
          console.log("1 dmg");
          let oppDinos = document.getElementsByClassName("cardplayedOpp");
          if(oppDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            oppDinos[Math.floor(Math.random()*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);
            await(sleep(1000));
          }

          
        }
    }

    if(eventTexto.split("2damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("2damage").length - 1 ; i++){
          console.log("2 dmg");
          let oppDinos = document.getElementsByClassName("cardplayedOpp");
          if(oppDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }
            await(sleep(1000));

          }

        }
    }

    if(eventTexto.split("3damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("3damage").length - 1 ; i++){
          console.log("3 dmg");
          let oppDinos = document.getElementsByClassName("cardplayedOpp");
          if(oppDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }

            await(sleep(1000));
          }
 
        }
    }

    if(eventTexto.split("4damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("4damage").length - 1 ; i++){
          console.log("4 dmg");
          let oppDinos = document.getElementsByClassName("cardplayedOpp");
          if(oppDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }
            if(oppDinos[Math.floor(randomNum*oppDinos.length)]){
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);

            }

            await(sleep(1000));

          }

        }
    }

    if(eventTexto.split("2atk").length - 1 > 0){
        console.log("gain 2 atk");

        for(let i= 0; i< eventTexto.split("2atk").length - 1 ; i++){
            let plyDinos = document.getElementsByClassName("cardplayedPly");
            if(plyDinos.length > 0){

                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                let randomNum = Math.random();
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputGain1atkply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputGain1atkply")[0].dispatchEvent(evento);

                await(sleep(1000));
            }
        }
    }

    if(eventTexto.split("3atk").length - 1 > 0){
        console.log("gain 3 atk");

        for(let i= 0; i< eventTexto.split("3atk").length - 1 ; i++){
            let plyDinos = document.getElementsByClassName("cardplayedPly");
            console.log(`plydinolength: ${plyDinos.length}`)
            if(plyDinos.length > 0){

                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                let randomNum = Math.random();
                console.log(`random: ${randomNum}`)
                console.log(`choose dino: ${Math.floor(randomNum*plyDinos.length)}`)
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputGain1atkply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputGain1atkply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputGain1atkply")[0].dispatchEvent(evento);

                await(sleep(1000));
            }
        }
    }
    
    if(eventTexto.split("2restore").length - 1 > 0){
        console.log("restore 2")
        for(let i= 0; i< eventTexto.split("2restore").length - 1 ; i++){
            let plyDinos = document.getElementsByClassName("cardplayedPly");
            if(plyDinos.length > 0){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                let randomNum = Math.random();
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                await(sleep(1000));
            }

        }
    }

    if(eventTexto.split("3restore").length - 1 > 0){
        console.log("restore 3")
        for(let i= 0; i< eventTexto.split("3restore").length - 1 ; i++){
            let plyDinos = document.getElementsByClassName("cardplayedPly");
            if(plyDinos.length > 0){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                let randomNum = Math.random();
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);

                await(sleep(1000));
            }

        }
    }

    if(eventTexto.split("1restoreall").length - 1 > 0){
        console.log("restore 1 all")
        let plyDinos = document.getElementsByClassName("cardplayedPly");
        if(plyDinos.length > 0){
            for(let i=0; i< plyDinos.length; i++){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                plyDinos[i].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                await(sleep(300));
            }
        }
    }

    if(eventTexto.split("2restoreall").length - 1 > 0){
        console.log("restore 2 all")
        let plyDinos = document.getElementsByClassName("cardplayedPly");
        if(plyDinos.length > 0){
            for(let i=0; i< plyDinos.length; i++){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                plyDinos[i].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                plyDinos[i].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);

                await(sleep(300));
            }
        }
    }

}

/* --Handling Event cards played by opp---*/

class SketchEventBoardOpp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            classes: "cardplayeoppEvent",
        }
    }

    componentDidMount(){
        console.log("mounted opp ev")
        gsap.fromTo(ReactDOM.findDOMNode(this), {scaleX: 1.2, scaleY: 1.2},{duration: 0.5, scaleY: 1, scaleX: 1});

        setTimeout(function(){
        gsap.to(document.querySelector("#opp_event div"), {opacity: 0, duration: 0.7});
        }, 2000);

        setTimeout(function(){ 
        ReactDOM.unmountComponentAtNode(document.getElementById("opp_event"));
        }, 3200);
    }

    
    render(){
        return(<React.Fragment>
            <div className={this.state.classes}>
                
                <div><b>{this.props.name}</b></div>
                <div>R: {this.props.rarity}</div>
                <div>Type: {this.props.type}</div>
                
            </div>
        </React.Fragment>

        );  
    }
}

/* --handles output of event cards for opponent--*/
async function handleOppEvent(eventTexto){
    await(sleep(1000));

    if(eventTexto.split("destroyegg").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("destroyegg").length - 1 ; i++){
          console.log("destroy ply egg");
          destroyEgg("ply");
          await(sleep(500));
        }
    }

    if(eventTexto.split("restoreegg").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("restoreegg").length - 1 ; i++){
            restoreEgg("opp");
            await(sleep(500));
        }
    }

    if(eventTexto.split("drawcard").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("drawcard").length - 1 ; i++){
          console.log("draw card");
          drawCard("opp");
          await(sleep(1200));
        }
    }

    
    if(eventTexto.split("1damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("1damage").length - 1 ; i++){
          console.log("1 dmg");
          let plyDinos = document.getElementsByClassName("cardplayedPly");
          if(plyDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            plyDinos[Math.floor(Math.random()*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);
            await(sleep(1000));
          }  
        }
    }

    if(eventTexto.split("2damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("2damage").length - 1 ; i++){
          console.log("2 dmg");
          let plyDinos = document.getElementsByClassName("cardplayedPly");
          if(plyDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);

            }
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);

            }
            await(sleep(1000));

          }

        }
    }

    if(eventTexto.split("3damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("3damage").length - 1 ; i++){
          console.log("3 dmg");
          let plyDinos = document.getElementsByClassName("cardplayedPly");
          if(plyDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgPly")[0].dispatchEvent(evento);

            }
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgPly")[0].dispatchEvent(evento);

            }
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgPly")[0].dispatchEvent(evento);

            }

            await(sleep(1000));
          }
 
        }
    }

    if(eventTexto.split("4damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("4damage").length - 1 ; i++){
          console.log("4 dmg");
          let plyDinos = document.getElementsByClassName("cardplayedPly");
          if(plyDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);

            }
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);

            }
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);

            }
            if(plyDinos[Math.floor(randomNum*plyDinos.length)]){
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);

            }
            await(sleep(1000));
          }

        }
    }

    if(eventTexto.split("2atk").length - 1 > 0){
        console.log("gain 2 atk");

        for(let i= 0; i< eventTexto.split("2atk").length - 1 ; i++){
            let oppDinos = document.getElementsByClassName("cardplayedOpp");
            if(oppDinos.length > 0){

                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                let randomNum = Math.random();
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);

                await(sleep(1000));
            }
        }
    }

    if(eventTexto.split("3atk").length - 1 > 0){
        console.log("gain 3 atk");

        for(let i= 0; i< eventTexto.split("3atk").length - 1 ; i++){
            let oppDinos = document.getElementsByClassName("cardplayedOpp");
            if(oppDinos.length > 0){

                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                let randomNum = Math.random();
                console.log(`random: ${randomNum}`)
                console.log(`choose dino: ${Math.floor(randomNum*plyDinos.length)}`)
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);

                await(sleep(1000));
            }
        }
    }
    
    if(eventTexto.split("2restore").length - 1 > 0){
        console.log("restore 2")
        for(let i= 0; i< eventTexto.split("2restore").length - 1 ; i++){
            let oppDinos = document.getElementsByClassName("cardplayedOpp");
            if(oppDinos.length > 0){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                let randomNum = Math.random();
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                await(sleep(1000));
            }

        }
    }

    if(eventTexto.split("3restore").length - 1 > 0){
        console.log("restore 3")
        for(let i= 0; i< eventTexto.split("3restore").length - 1 ; i++){
            let oppDinos = document.getElementsByClassName("cardplayedOpp");
            if(oppDinos.length > 0){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                let randomNum = Math.random();
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);

                await(sleep(1000));
            }

        }
    }

    if(eventTexto.split("1restoreall").length - 1 > 0){
        console.log("restore 1 all")
        let oppDinos = document.getElementsByClassName("cardplayedOpp");
        if(oppDinos.length > 0){
            for(let i=0; i< oppDinos.length; i++){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                oppDinos[i].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                await(sleep(300));
            }
        }
    }

    if(eventTexto.split("2restoreall").length - 1 > 0){
        console.log("restore 2 all")
        let oppDinos = document.getElementsByClassName("cardplayedOpp");
        if(oppDinos.length > 0){
            for(let i=0; i< oppDinos.length; i++){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                oppDinos[i].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                oppDinos[i].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);

                await(sleep(300));
            }
        }
    }

}




