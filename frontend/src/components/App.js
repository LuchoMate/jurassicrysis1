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
const bgmusic = new Audio(`/static/frontend/sounds/music/bg${Math.floor(Math.random()*10)}.mp3`);
bgmusic.loop = true;
bgmusic.volume = 0.3;
let gameOver = false;

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
        if(dragged.dataset.cost <= plyEnergies && (document.getElementsByClassName("cardplayedPly").length < 8)){/* Allow*/
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
            
        }
        else{/* Not allow*/
            const wrong = new Audio('/static/frontend/sounds/wrong.wav');
            wrong.loop = false;
            wrong.play();
            
        }  
    }
}, false);

function destroyEgg(who){
    if(who == "opp" && gameOver == false){

        const thisNode = document.getElementById("opp_eggs");
        let pos = thisNode.getBoundingClientRect();
        const center1X = Math.floor((pos.left + pos.right) / 2.2);
        const center1Y = Math.floor(pos.top);
        const dmgDisplay = document.createElement("div");
        dmgDisplay.classList.add("attackbgIcon");
        dmgDisplay.style.top = center1Y+'px';
        dmgDisplay.style.left = center1X+'px';
        document.body.appendChild(dmgDisplay);
        gsap.to(dmgDisplay, {opacity: 0, duration: 1.7, ease: "expo.in"});
        setTimeout(() => {dmgDisplay.parentNode.removeChild(dmgDisplay);}, 1900);

        const destroyedegg = new Audio('/static/frontend/sounds/destroyed/egg_destroyed.wav');
        destroyedegg.loop = false;
        destroyedegg.play();

        oppEggs--;
        if(oppEggs <= 0){
            console.log("you win")
            gameOver = true;
            youWin();
        }
        const lastegg = document.getElementById("opp_eggs").lastElementChild;
        lastegg.parentNode.removeChild(lastegg);
        

        if(handleAttacks.atkCondition.includes("Predator") && gameOver == false){
            
            oppEggs--
            if(oppEggs <= 0){
                gameOver = true;
                console.log("you win");
                youWin();
            }
            const lastegg = document.getElementById("opp_eggs").lastElementChild;
            lastegg.parentNode.removeChild(lastegg);
            
        }
        
    }

    else if(gameOver == false){

        const thisNode = document.getElementById("ply_eggs");
        let pos = thisNode.getBoundingClientRect();
        const center1X = Math.floor(pos.left);
        const center1Y = Math.floor(pos.top);
        const dmgDisplay = document.createElement("div");
        dmgDisplay.classList.add("attackbgIcon");
        dmgDisplay.style.top = center1Y+'px';
        dmgDisplay.style.left = center1X+'px';
        document.body.appendChild(dmgDisplay);
        gsap.to(dmgDisplay, {opacity: 0, duration: 1.7, ease: "expo.in"});
        setTimeout(() => {dmgDisplay.parentNode.removeChild(dmgDisplay);}, 1900);

        const destroyedegg = new Audio('/static/frontend/sounds/destroyed/egg_destroyed.wav');
        destroyedegg.loop = false;
        destroyedegg.play();
        
        plyEggs--;
        
        document.getElementById("plyEggsCounter").innerHTML = plyEggs;
        if(plyEggs <= 0){
            console.log("You lose !!")
            gameOver = true;
            youLose();
        }
        if(handleAttacks.atkCondition.includes("Predator") && gameOver == false){

            plyEggs--
            if(plyEggs <= 0){
                gameOver = true;
                console.log("you lose!")
                youLose();
            }
            
        }
    }
}

function restoreEgg(who){
    if(who=="ply"){
        if(plyEggs < 10){
            
            const thisNode = document.getElementById("ply_eggs");
            let pos = thisNode.getBoundingClientRect();
            const center1X = Math.floor(pos.left);
            const center1Y = Math.floor(pos.top);
            const restorediv = document.createElement("div");
            restorediv.classList.add("restorebgIcon");
            restorediv.style.top = center1Y+'px';
            restorediv.style.left = center1X+'px';
            document.body.appendChild(restorediv);
            gsap.to(restorediv, {opacity: 0, duration: 1.7, ease: "expo.in"});
            setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1900);

            plyEggs ++;
            document.getElementById("plyEggsCounter").innerHTML = plyEggs;
        }
    }

    else{
        if(oppEggs < 10){

            const thisNode = document.getElementById("opp_eggs");
            let pos = thisNode.getBoundingClientRect();
            const center1X = Math.floor((pos.left + pos.right) / 2.2);
            const center1Y = Math.floor(pos.top);
            const restorediv = document.createElement("div");
            restorediv.classList.add("restorebgIcon");
            restorediv.style.top = center1Y+'px';
            restorediv.style.left = center1X+'px';
            document.body.appendChild(restorediv);
            gsap.to(restorediv, {opacity: 0, duration: 1.7, ease: "expo.in"});
            setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1900);
            
            let eggdiv = document.createElement("div");
            eggdiv.classList.add("textalign");
            document.getElementById("opp_eggs").appendChild(eggdiv);
            let eggimg = document.createElement("img");
            eggimg.src = '/static/frontend/images/eggs/opp_egg.png';
            eggimg.classList.add("height90");
            eggimg.draggable = false;
            eggdiv.appendChild(eggimg);

            oppEggs++;
           
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
        tl.set("#opp_deck", {display: 'block'})
        tl.from("#opp_deck", {left: "200%", duration: 2});
    }

    else{
        var tl = gsap.timeline();
        tl.set("#ply_deck", {display: 'block'})
        tl.from("#ply_deck", {left: "200%", duration: 2});
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
      
    placeDeck("opp");
    await sleep(2500);
    placeDeck("ply");
    await sleep(2500);

   /* music and rain effect*/
    bgmusic.play();
    document.getElementById("rainanimated").style.display="block";

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
    
    if(who == "ply" && gameOver == false){
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

    else if(gameOver == false){
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
        
        if(plydeck.length > 0){
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
            destroyEgg("ply");
        }
        

    }
    else {/* opp draws*/

        if(oppdeck.length > 0){
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

        else{
            destroyEgg("opp");
        }
     
    }
}

/* dinocardhand*/

/* Sketches Dino card in Hand*/
function SketchHandCard(props){
        const classhand = 'cardinHand';
        const interiorcard = `interiorcard${props.type}`;
        const attackTag = 'attackTag flexallcenter';
        const costTag = 'costTag flexallcenter';
        const energyTag = 'energyTag flexallcenter';
        const lifepointsTag = 'lifepointsTag flexallcenter';
        const nameTag = `namediv namediv${props.rarity} flexallcenter`;
        const dinopicTag = 'dinopicDiv noEvents';
        const imgTag = 'height100 width100';
        const conditionTag = 'conditionTag flexallcenter';
        const sizeTag = 'sizeTag flexallcenter';
        const sizeImg = 'height100 width100 clipsize';

        return <React.Fragment>
                <div className={classhand}>
                    
                    <div className={interiorcard}>
                        <div className={attackTag}>{props.atk}</div>
                        <div className={costTag}>
                            {(function() {
                                if (props.cost == 1) {
                                    return <div className={energyTag}></div>;
                                } else {
                                    return <React.Fragment><div className={energyTag}></div>
                                    <div className={energyTag}></div></React.Fragment>;
                                }
                                })()}
                        </div>
                        <div className={lifepointsTag}>{props.lifepoints}</div>
                        <div className={nameTag}>{props.name}</div>
                        <div className={dinopicTag}><img src={`/static/frontend/images/cards/${props.name}.PNG`} className={imgTag}/></div>
                        <div className={conditionTag}>{props.condition}</div>
                        <div className={sizeTag}><img src={`/static/frontend/images/icons/size${props.size}.PNG`} className={sizeImg}/></div>

                    </div>
                     
                </div>
            </React.Fragment>
}
/* <div className='interiorDeck interiorDeckOpp'>*/
/* Sketches opp's hand card inside wrapper div*/
function SketchHandOpp() {
    
    
    return <React.Fragment>
            <div className='cardinhandOpp'>
                <div className='interiorhandOpp'></div>
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
        this.destroyMe = this.destroyMe.bind(this);
        this.animateDmg = this.animateDmg.bind(this);
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
        
        const dinocry = new Audio(`/static/frontend/sounds/cards/${this.props.name}.wav`);
        dinocry.loop = false;
        dinocry.play();

        gsap.fromTo(ReactDOM.findDOMNode(this), {scaleX: 1.2, scaleY: 1.2},{duration: 1, scaleY: 1, scaleX: 1});
    }

    /* Passes attacking info to data handler*/
    handleDragStart(){
        const dinoattack = new Audio(`/static/frontend/sounds/attacks/${this.state.size}_attack.wav`);
        dinoattack.loop = false;
        dinoattack.play();
        handleAttacks.getAttack(this.state.atk, this.state.type, this.state.condition);
        handleAttacks.showValues();
        
        document.getElementById("opp_eggs").classList.add("highlightTarget");
        let oppdinos = document.getElementsByClassName("cardplayedOpp");
        for(let i = 0; i< oppdinos.length; i++){
            oppdinos[i].classList.add("highlightTarget");
        }

    }

    handleDragEnd(){
        document.getElementById("opp_eggs").classList.remove("highlightTarget");
        let oppdinos = document.getElementsByClassName("cardplayedOpp");
        for(let i = 0; i< oppdinos.length; i++){
            oppdinos[i].classList.remove("highlightTarget");
        }

    }
    
    handleDragOver(){
        event.preventDefault();
    }

    handleDestroyed(){
    	console.log(`my hp is now: ${this.state.life_points}`);
        if(this.state.life_points <= 0){
            const dinodestroyed = new Audio(`/static/frontend/sounds/destroyed/${this.state.size}_destroyed.wav`);
            dinodestroyed.loop = false;
            dinodestroyed.play();

            const thisNode = ReactDOM.findDOMNode(this);            
            var tl = gsap.timeline();
            tl.to(thisNode, {rotation: 540, duration: 0.5})
            tl.to(thisNode, {scaleY: 0, scaleX: 0, duration: 0.4})
            setTimeout(() => {this.destroyMe()}, 1100);

        }
        else{
            const dinodamage = new Audio(`/static/frontend/sounds/damage/${this.state.size}_damage.wav`);
            dinodamage.loop = false;
            dinodamage.play();
        }
    }

    destroyMe(){
        console.log("Executed with impunity!!");
        const thisNode = ReactDOM.findDOMNode(this);
        const parent = thisNode.parentNode;
        ReactDOM.unmountComponentAtNode(thisNode.parentNode);
        parent.parentNode.removeChild(parent);  
    }

    animateDmg(dmg){
        console.log("entered animate dmg");
        console.log(`dmg will be ${dmg}`);
        const thisNode = ReactDOM.findDOMNode(this);
        let pos = thisNode.getBoundingClientRect();
        const center1X = Math.floor(pos.left);
        const center1Y = Math.floor(pos.top);
        const dmgDisplay = document.createElement("div");
        dmgDisplay.classList.add("attackbgIcon");
        dmgDisplay.style.top = center1Y+'px';
        dmgDisplay.style.left = center1X+'px';
        dmgDisplay.innerHTML = dmg;
        document.body.appendChild(dmgDisplay);
        gsap.to(dmgDisplay, {opacity: 0, duration: 1.7, ease: "expo.in"});
        setTimeout(() => {dmgDisplay.parentNode.removeChild(dmgDisplay);}, 1900);

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
        this.animateDmg(atkCalc);
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

        const thisNode = ReactDOM.findDOMNode(this);
        let pos = thisNode.getBoundingClientRect();
        const center1X = Math.floor(pos.left);
        const center1Y = Math.floor(pos.top);
        const take1dmgdiv = document.createElement("div");
        take1dmgdiv.classList.add("gethitIcon");
        take1dmgdiv.style.top = center1Y+'px';
        take1dmgdiv.style.left = center1X+'px';
        document.body.appendChild(take1dmgdiv);
        gsap.to(take1dmgdiv, {opacity: 0, duration: 1.3, ease: "slow(0.9, 0.4, false)"});
        setTimeout(() => {take1dmgdiv.parentNode.removeChild(take1dmgdiv);}, 1100);

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

        const classplayed = 'cardplayedPly';
        const interiorcard = `interiorcard${this.state.type}`;
        const attackTag = 'attackTag flexallcenter';
        const costTag = 'costTag flexallcenter navbarcolor';
        const lifepointsTag = 'lifepointsTag flexallcenter';
        const nameTag = `namediv namediv${this.state.rarity} flexallcenter`;
        const dinopicTag = 'dinopicDiv noEvents';
        const imgTag = 'height100 width100';
        const conditionTag = 'conditionTag flexallcenter';
        const sizeTag = 'sizeTag flexallcenter';
        const sizeImg = 'height100 width100 clipsize';
        const zztag = 'sleepanimation flexallcenter';
        const readytag = 'readyanimation';

    	return(
            <React.Fragment>
            <div className={classplayed} 
            onDragStart={this.handleDragStart}
            onDragOver={this.handleDragOver}
            onDragEnd={this.handleDragEnd}
            onDrop={this.handleDrop}
            draggable={this.state.can_attack ? true : false}
            data-condition={this.state.condition}
            style={{cursor: this.state.can_attack ? 'grab' : 'none'}}
            >   
                
                <div className={interiorcard}>
                    <div className={attackTag}>{this.state.atk}</div>
                    <div className={costTag}>
                        {this.state.can_attack ? <div className={readytag}></div> : <div className={zztag}></div>}
                    </div>
                    <div className={lifepointsTag}>{this.state.life_points}</div>
                    <div className={nameTag}>{this.state.cardname}</div>
                    <div className={dinopicTag}><img src={`/static/frontend/images/cards/${this.state.cardname}.PNG`} className={imgTag}/></div>
                    <div className={conditionTag}>{this.state.condition}</div>
                    <div className={sizeTag}><img src={`/static/frontend/images/icons/size${this.state.size}.PNG`} className={sizeImg}/></div>

                </div>


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
            classes: "cardplayedOpp",
            life_points: 0,
            atk: 0,
            cardname: "",
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
        this.destroyMe = this.destroyMe.bind(this);
        this.animateDmg = this.animateDmg.bind(this);
    }

    componentDidMount(){
    	this.setState({life_points: this.props.lifepoints});
        this.setState({atk: this.props.atk});
        this.setState({cardname: this.props.name});
        this.setState({rarity: this.props.rarity});
        this.setState({type: this.props.type});
        this.setState({weak: this.props.weak});
        this.setState({size: this.props.size});
        this.setState({condition: this.props.condition}, function(){this.attack1Turn()});

        const dinocry = new Audio(`/static/frontend/sounds/cards/${this.props.name}.wav`);
        dinocry.loop = false;
        dinocry.play();

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

        const thisNode = ReactDOM.findDOMNode(this);
        let pos = thisNode.getBoundingClientRect();
        const center1X = Math.floor(pos.left);
        const center1Y = Math.floor(pos.top);
        const take1dmgdiv = document.createElement("div");
        take1dmgdiv.classList.add("gethitIcon");
        take1dmgdiv.style.top = center1Y+'px';
        take1dmgdiv.style.left = center1X+'px';
        document.body.appendChild(take1dmgdiv);
        gsap.to(take1dmgdiv, {opacity: 0, duration: 1.1, ease: "expo.in"});
        setTimeout(() => {take1dmgdiv.parentNode.removeChild(take1dmgdiv);}, 1300);
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
        document.getElementById("opp_eggs").classList.remove("highlightTarget");

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
            const dinodestroyed = new Audio(`/static/frontend/sounds/destroyed/${this.state.size}_destroyed.wav`);
            dinodestroyed.loop = false;
            dinodestroyed.play();

            const thisNode = ReactDOM.findDOMNode(this);            
            var tl = gsap.timeline();
            tl.to(thisNode, {rotation: 540, duration: 0.5})
            tl.to(thisNode, {scaleY: 0, scaleX: 0, duration: 0.4})
            setTimeout(() => {this.destroyMe()}, 1100);

        }
        else{
            const dinodamage = new Audio(`/static/frontend/sounds/damage/${this.state.size}_damage.wav`);
            dinodamage.loop = false;
            dinodamage.play();
        }
    }

    destroyMe(){
        console.log("Executed with impunity!!");
        const thisNode = ReactDOM.findDOMNode(this);
        const parent = thisNode.parentNode;
        ReactDOM.unmountComponentAtNode(thisNode.parentNode);
        parent.parentNode.removeChild(parent);  
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
        this.animateDmg(atkCalc);
        this.setState({ life_points: this.state.life_points - atkCalc}, function(){this.handleDestroyed()});

    }

    animateDmg(dmg){

        const thisNode = ReactDOM.findDOMNode(this);
        let pos = thisNode.getBoundingClientRect();
        const center1X = Math.floor(pos.left);
        const center1Y = Math.floor(pos.top);
        const dmgDisplay = document.createElement("div");
        dmgDisplay.classList.add("attackbgIcon");
        dmgDisplay.style.top = center1Y+'px';
        dmgDisplay.style.left = center1X+'px';
        dmgDisplay.innerHTML = dmg;
        document.body.appendChild(dmgDisplay);
        gsap.to(dmgDisplay, {opacity: 0, duration: 1.7, ease: "expo.in"});

        setTimeout(() => {dmgDisplay.parentNode.removeChild(dmgDisplay);}, 1900);

    }

    gain1Atk(){
        this.setState({ atk: parseInt(this.state.atk, 10) + 1});
    }

    restore1Lp(){
        this.setState({life_points: parseInt(this.state.life_points, 10) + 1});
        console.log("Restore 1 lp")
    }

    render(){

        const interiorcard = `interiorcard${this.state.type}`;
        const attackTag = 'attackTag flexallcenter';
        const costTag = 'costTag flexallcenter';
        const lifepointsTag = 'lifepointsTag flexallcenter';
        const nameTag = `namediv namediv${this.state.rarity} flexallcenter`;
        const dinopicTag = 'dinopicDiv';
        const imgTag = 'height100 width100';
        const conditionTag = 'conditionTag flexallcenter';
        const sizeTag = 'sizeTag flexallcenter';
        const sizeImg = 'height100 width100 clipsize';
        const zztag = 'sleepanimation';
        const readytag = 'readyanimation';

    	return(
            <React.Fragment>
                <div className={this.state.classes} 
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                onDragStart={this.handleDragStart}
                data-can_attack={this.state.can_attack}
                data-condition={this.state.condition}
                data-size={this.state.size}
                >
                    <div className={interiorcard}>
                        <div className={attackTag}>{this.state.atk}</div>
                        <div className={costTag}>
                            {this.state.can_attack ? <div className={readytag}></div> : <div className={zztag}></div>}
                        </div>
                        <div className={lifepointsTag}>{this.state.life_points}</div>
                        <div className={nameTag}>{this.state.cardname}</div>
                        <div className={dinopicTag}><img src={`/static/frontend/images/cards/${this.state.cardname}.PNG`} className={imgTag}/></div>
                        <div className={conditionTag}>{this.state.condition}</div>
                        <div className={sizeTag}><img src={`/static/frontend/images/icons/size${this.state.size}.PNG`} className={sizeImg}/></div>

                    </div>

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
                if(cardtoPlay[0].type != "ev" && (document.getElementsByClassName("cardplayedOpp").length < 8)){
                   /* simulates playing a dino card*/
                    let divCreate = document.createElement("div");
                    divCreate.classList.add('borderDeckSimulate');
                    document.getElementById("boarddiv").appendChild(divCreate);
                    let divinterior = document.createElement("div");
                    divinterior.classList.add('interiorDeck');
                    divinterior.classList.add('interiorDeckOpp');
                    divCreate.appendChild(divinterior);
                    let iconcard = document.createElement("div");
                    iconcard.classList.add('dinoIconCard');
                    divinterior.appendChild(iconcard);
                    let imgdino = document.createElement("img");
                    imgdino.src = '/static/frontend/images/icons/jcdinohead.png';
                    imgdino.classList.add("height100");
                    iconcard.appendChild(imgdino);
                    let jclogotext = document.createElement("div");
                    jclogotext.classList.add("jclogotext");
                    jclogotext.innerHTML = 'Jurassicrysis';
                    divinterior.appendChild(jclogotext);

                    const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
                    drawsound.loop = false;
                    drawsound.play();
                    
                    /* animates playing card*/
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
                        rarity = {cardtoPlay[0].rarity}
                    />, lastoppchild);
                }
                /* Event card*/
                else{
                    console.log("gonna play ev card")
                    /* simulates playing a card*/
                    let divCreate = document.createElement("div");
                    divCreate.classList.add('borderDeckSimulate');
                    document.getElementById("boarddiv").appendChild(divCreate);
                    let divinterior = document.createElement("div");
                    divinterior.classList.add('interiorDeck');
                    divinterior.classList.add('interiorDeckOpp');
                    divCreate.appendChild(divinterior);
                    let iconcard = document.createElement("div");
                    iconcard.classList.add('dinoIconCard');
                    divinterior.appendChild(iconcard);
                    let imgdino = document.createElement("img");
                    imgdino.src = '/static/frontend/images/icons/jcdinohead.png';
                    imgdino.classList.add("height100");
                    iconcard.appendChild(imgdino);
                    let jclogotext = document.createElement("div");
                    jclogotext.classList.add("jclogotext");
                    jclogotext.innerHTML = 'Jurassicrysis';
                    divinterior.appendChild(jclogotext);

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
                        condition={cardtoPlay[0].condition}
                    />, document.getElementById("opp_event"));

                    await(sleep(1800));
                    const evaudio = new Audio(`/static/frontend/sounds/cards/${cardtoPlay[0].name}.wav`);
                    evaudio.loop = false;
                    evaudio.play();

                    document.getElementById("eventimgSpot").src = `/static/frontend/images/animated/Events/${cardtoPlay[0].name}.gif`;
                    var tl = gsap.timeline();
                    tl.set("#eventimgContainer", {display: 'block'})
                    tl.from("#eventimgContainer", {opacity: 0, duration: 0.2})
                    tl.to("#eventimgContainer", {opacity: 0, duration: 0.3, delay: 2});
                    tl.set("#eventimgContainer", {display: 'none'})
                    tl.set("#eventimgContainer", {opacity: 1})

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
        for(let i=0; i<oppDinos.length && (gameOver == false); i++){
            console.log(`checking dino ${i}`);
            if(oppDinos[i].dataset.can_attack == "true"){/* Ready to attack*/
                console.log(`dino ${i} can attack`);
                

                await(sleep(1800));
                if(Math.random() > 0.4){/* Attack a player's dino */
        
                    if(plyDinos.length > 0){

                        const dinoattack = new Audio(`/static/frontend/sounds/attacks/${oppDinos[i].dataset.size}_attack.wav`);
                        dinoattack.loop = false;
                        dinoattack.play();

                        oppDinos[i].draggable = true;
                        gsap.fromTo(oppDinos[i], {scaleX: 1.4, scaleY: 1.4},{duration: 1.3, scaleY: 1, scaleX: 1});
                        await(sleep(1700))
                        triggerDragAndDrop(oppDinos[i], plyDinos[Math.floor(Math.random()*plyDinos.length)]);
                        oppDinos[i].draggable = false;
                    }
                    else{
                        const dinoattack = new Audio(`/static/frontend/sounds/attacks/${oppDinos[i].dataset.size}_attack.wav`);
                        dinoattack.loop = false;
                        dinoattack.play();

                        gsap.fromTo(oppDinos[i], {scaleX: 1.4, scaleY: 1.4},{duration: 1.3, scaleY: 1, scaleX: 1});
                        await(sleep(1700))
                        destroyEgg("ply");
                        
                    }
                } 
                else{
                        const dinoattack = new Audio(`/static/frontend/sounds/attacks/${oppDinos[i].dataset.size}_attack.wav`);
                        dinoattack.loop = false;
                        dinoattack.play();
                        
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
    
    const classhand = 'cardinHand';
    const interiorcard = `interiorcard${props.type}`;
    const costTag = 'costTag flexallcenter';
    const energyTag = 'energyTag flexallcenter';
    const nameTag = `namediv namediv${props.rarity} flexallcenter`;
    const dinopicTag = 'dinopicDiv noEvents';
    const imgTag = 'height100 width100';
    const conditionTagEv = 'conditionTagEv flexallcenter';
    
    return <React.Fragment>
                <div className={classhand}>
                    <div className={interiorcard}>
                        <div className={costTag}>
                            {(function() {
                                if (props.cost == 1) {
                                    return <div className={energyTag}></div>;
                                } else {
                                    return <React.Fragment><div className={energyTag}></div>
                                    <div className={energyTag}></div></React.Fragment>;
                                }
                                })()}
                        </div>
                        <div className={nameTag}>{props.name}</div>
                        <div className={dinopicTag}><img src={`/static/frontend/images/cards/${props.name}.PNG`} className={imgTag}/></div>
                        <div className={conditionTagEv}>{props.condition}</div>
                    </div>
                     
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
        const interiorcard = `interiorcard${this.props.type}`;
        const nameTag = `namediv namediv${this.props.rarity} flexallcenter`;
        const dinopicTag = 'dinopicDiv';
        const imgTag = 'height100 width100';
        const conditionTagEv = 'conditionTagEv flexallcenter';

        return(<React.Fragment>
            <div className={this.state.classes}>
                
                <div className={interiorcard}>
                    <div className={nameTag}>{this.props.name}</div>
                    <div className={dinopicTag}><img src={`/static/frontend/images/cards/${this.props.name}.PNG`} className={imgTag}/></div>
                    <div className={conditionTagEv}>{this.props.condition}</div>
                </div>
                
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
                condition = {dragged.dataset.condition}
            />, document.getElementById("ply_event"));

            
            sortCards("ply");
            const evaudio = new Audio(`/static/frontend/sounds/cards/${dragged.dataset.name}.wav`);
            evaudio.loop = false;
            evaudio.play();

            handlePlyEvent(dragged.dataset.event);
            console.log(`Energy left: ${plyEnergies}`);

            document.getElementById("eventimgSpot").src = `/static/frontend/images/animated/Events/${dragged.dataset.name}.gif`;
            var tl = gsap.timeline();
            tl.set("#eventimgContainer", {display: 'block'})
            tl.from("#eventimgContainer", {opacity: 0, duration: 0.2})
            tl.to("#eventimgContainer", {opacity: 0, duration: 0.3, delay: 2.5});
            tl.set("#eventimgContainer", {display: 'none'})
            tl.set("#eventimgContainer", {opacity: 1})
  
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
        const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
        drawsound.loop = false;
        drawsound.play();

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
          const oppDinossaveLength = oppDinos.length;
          if(oppDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            for(let i=0; i<2; i++){
                if(oppDinos[Math.floor(randomNum*oppDinos.length)] && (oppDinos.length == oppDinossaveLength)){/* Prevents dmg to jump to other dinos*/
                    oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);
                    await(sleep(300));
                }
                else{
                    break;
                }
            }
            
            await(sleep(1000));

          }

        }
    }

    if(eventTexto.split("3damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("3damage").length - 1 ; i++){
          console.log("3 dmg");
          let oppDinos = document.getElementsByClassName("cardplayedOpp");
          const oppDinossaveLength = oppDinos.length;
          if(oppDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            for(let i=0; i<3; i++){
                if(oppDinos[Math.floor(randomNum*oppDinos.length)] && (oppDinos.length == oppDinossaveLength)){/* Prevents dmg to jump to other dinos*/
                    oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);
                    await(sleep(300));
                }
                else{
                    break;
                }
            }
            
            await(sleep(1000));
          }
 
        }
    }

    if(eventTexto.split("4damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("4damage").length - 1 ; i++){
          console.log("4 dmg");
          let oppDinos = document.getElementsByClassName("cardplayedOpp");
          const oppDinossaveLength = oppDinos.length;
          if(oppDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            for(let i=0; i<4; i++){
                if(oppDinos[Math.floor(randomNum*oppDinos.length)] && (oppDinos.length == oppDinossaveLength)){/* Prevents dmg to jump to other dinos*/
                    oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputTake1dmgopp")[0].dispatchEvent(evento);
                    await(sleep(300));
                }
                else{
                    break;
                }
            }
            await(sleep(1000));
          }

        }
    }

    if(eventTexto.split("2atk").length - 1 > 0){
        console.log("gain 2 atk");
        if(document.getElementsByClassName("cardplayedPly").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/gainAttack.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
        
        for(let i= 0; i< eventTexto.split("2atk").length - 1 ; i++){
            let plyDinos = document.getElementsByClassName("cardplayedPly");
            if(plyDinos.length > 0){

                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                let randomNum = Math.random();

                const thisNode = plyDinos[Math.floor(randomNum*plyDinos.length)];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const attackdiv = document.createElement("div");
                attackdiv.classList.add("gainattackIcon");
                attackdiv.style.top = center1Y+'px';
                attackdiv.style.left = center1X+'px';
                attackdiv.innerHTML = "+2";
                document.body.appendChild(attackdiv);
                gsap.to(attackdiv, {opacity: 0, duration: 1.7, ease: "expo.in"});
                setTimeout(() => {attackdiv.parentNode.removeChild(attackdiv);}, 1900);
                
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputGain1atkply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputGain1atkply")[0].dispatchEvent(evento);

                await(sleep(1000));
            }
        }
    }

    if(eventTexto.split("3atk").length - 1 > 0){
        console.log("gain 3 atk");
        if(document.getElementsByClassName("cardplayedPly").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/gainAttack.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
        for(let i= 0; i< eventTexto.split("3atk").length - 1 ; i++){
            let plyDinos = document.getElementsByClassName("cardplayedPly");
            console.log(`plydinolength: ${plyDinos.length}`)
            if(plyDinos.length > 0){

                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                let randomNum = Math.random();

                const thisNode = plyDinos[Math.floor(randomNum*plyDinos.length)];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const attackdiv = document.createElement("div");
                attackdiv.classList.add("gainattackIcon");
                attackdiv.style.top = center1Y+'px';
                attackdiv.style.left = center1X+'px';
                attackdiv.innerHTML = "+3";
                document.body.appendChild(attackdiv);
                gsap.to(attackdiv, {opacity: 0, duration: 1.7, ease: "expo.in"});
                setTimeout(() => {attackdiv.parentNode.removeChild(attackdiv);}, 1900);

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
        if(document.getElementsByClassName("cardplayedPly").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
       
        for(let i= 0; i< eventTexto.split("2restore").length - 1 ; i++){
            let plyDinos = document.getElementsByClassName("cardplayedPly");
            if(plyDinos.length > 0){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                let randomNum = Math.random();

                const thisNode = plyDinos[Math.floor(randomNum*plyDinos.length)];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const restorediv = document.createElement("div");
                restorediv.classList.add("restorebgIcon");
                restorediv.style.top = center1Y+'px';
                restorediv.style.left = center1X+'px';
                restorediv.innerHTML = "+2";
                document.body.appendChild(restorediv);
                gsap.to(restorediv, {opacity: 0, duration: 1.7, ease: "expo.in"});
                setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1900);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                await(sleep(1300));
            }

        }
    }

    if(eventTexto.split("3restore").length - 1 > 0){
        console.log("restore 3")
        if(document.getElementsByClassName("cardplayedPly").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
            drawsound.loop = false;
            drawsound.play();
        }

        for(let i= 0; i< eventTexto.split("3restore").length - 1 ; i++){
            let plyDinos = document.getElementsByClassName("cardplayedPly");
            if(plyDinos.length > 0){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                let randomNum = Math.random();

                const thisNode = plyDinos[Math.floor(randomNum*plyDinos.length)];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const restorediv = document.createElement("div");
                restorediv.classList.add("restorebgIcon");
                restorediv.style.top = center1Y+'px';
                restorediv.style.left = center1X+'px';
                restorediv.innerHTML = "+3";
                document.body.appendChild(restorediv);
                gsap.to(restorediv, {opacity: 0, duration: 1.9, ease: "expo.in"});
                setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1900);

                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);

                await(sleep(1300));
            }

        }
    }

    if(eventTexto.split("1restoreall").length - 1 > 0){
        console.log("restore 1 all")
        if(document.getElementsByClassName("cardplayedPly").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
        let plyDinos = document.getElementsByClassName("cardplayedPly");
        if(plyDinos.length > 0){
            for(let i=0; i< plyDinos.length; i++){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                const thisNode = plyDinos[i];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const restorediv = document.createElement("div");
                restorediv.classList.add("restorebgIcon");
                restorediv.style.top = center1Y+'px';
                restorediv.style.left = center1X+'px';
                restorediv.innerHTML = "+1";
                document.body.appendChild(restorediv);
                gsap.to(restorediv, {opacity: 0, duration: 1.3, ease: "slow(0.9, 0.4, false)"});
                setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1100);
                plyDinos[i].getElementsByClassName("inputrestore1Lpply")[0].dispatchEvent(evento);
                await(sleep(300));
            }
        }
    }

    if(eventTexto.split("2restoreall").length - 1 > 0){
        console.log("restore 2 all")
        if(document.getElementsByClassName("cardplayedPly").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
        let plyDinos = document.getElementsByClassName("cardplayedPly");
        if(plyDinos.length > 0){
            for(let i=0; i< plyDinos.length; i++){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                const thisNode = plyDinos[i];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const restorediv = document.createElement("div");
                restorediv.classList.add("restorebgIcon");
                restorediv.style.top = center1Y+'px';
                restorediv.style.left = center1X+'px';
                restorediv.innerHTML = "+2";
                document.body.appendChild(restorediv);
                gsap.to(restorediv, {opacity: 0, duration: 1.3, ease: "slow(0.9, 0.4, false)"});
                setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1100);

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
        gsap.fromTo(ReactDOM.findDOMNode(this), {scaleX: 1.2, scaleY: 1.2},{duration: 0.5, scaleY: 1, scaleX: 1});

        setTimeout(function(){
        gsap.to(document.querySelector("#opp_event div"), {opacity: 0, duration: 0.7});
        }, 2000);

        setTimeout(function(){ 
        ReactDOM.unmountComponentAtNode(document.getElementById("opp_event"));
        }, 3200);
    }

    
    render(){

        const interiorcard = `interiorcard${this.props.type}`;
        const nameTag = `namediv namediv${this.props.rarity} flexallcenter`;
        const dinopicTag = 'dinopicDiv';
        const imgTag = 'height100 width100';
        const conditionTagEv = 'conditionTagEv flexallcenter';

        return(<React.Fragment>
            <div className={this.state.classes}>
                
                <div className={interiorcard}>
                    <div className={nameTag}>{this.props.name}</div>
                    <div className={dinopicTag}><img src={`/static/frontend/images/cards/${this.props.name}.PNG`} className={imgTag}/></div>
                    <div className={conditionTagEv}>{this.props.condition}</div>
                </div>
                
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
        const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
        drawsound.loop = false;
        drawsound.play();

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
          const plyDinossaveLength = plyDinos.length;
          if(plyDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            for(let i=0; i<2; i++){
                if(plyDinos[Math.floor(randomNum*plyDinos.length)] && (plyDinos.length == plyDinossaveLength)){/* Prevents dmg to jump to other dinos*/
                    plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);
                    await(sleep(300));
                }
                else{
                    break;
                }
            }
            
            await(sleep(1000));

          }

        }
    }

    if(eventTexto.split("3damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("3damage").length - 1 ; i++){
          console.log("3 dmg");
          let plyDinos = document.getElementsByClassName("cardplayedPly");
          const plyDinossaveLength = plyDinos.length;
          if(plyDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            for(let i=0; i<3; i++){
                if(plyDinos[Math.floor(randomNum*plyDinos.length)] && (plyDinos.length == plyDinossaveLength)){/* Prevents dmg to jump to other dinos*/
                    plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);
                    await(sleep(300));
                }
                else{
                    break;
                }
            }

            await(sleep(1000));
          }
 
        }
    }

    if(eventTexto.split("4damage").length - 1 > 0){
        for(let i= 0; i< eventTexto.split("4damage").length - 1 ; i++){
          console.log("4 dmg");
          let plyDinos = document.getElementsByClassName("cardplayedPly");
          const plyDinossaveLength = plyDinos.length;
          if(plyDinos.length > 0){
            var evento = new Event('input', {
                bubbles: true,
                cancelable: true,
            });

            let randomNum = Math.random();
            for(let i=0; i<4; i++){
                if(plyDinos[Math.floor(randomNum*plyDinos.length)] && (plyDinos.length == plyDinossaveLength)){/* Prevents dmg to jump to other dinos*/
                    plyDinos[Math.floor(randomNum*plyDinos.length)].getElementsByClassName("inputTake1dmgply")[0].dispatchEvent(evento);
                    await(sleep(300));
                }
                else{
                    break;
                }
            }
            await(sleep(1000));
          }

        }
    }

    if(eventTexto.split("2atk").length - 1 > 0){
        console.log("gain 2 atk");
        if(document.getElementsByClassName("cardplayedOpp").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/gainAttack.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
        
        for(let i= 0; i< eventTexto.split("2atk").length - 1 ; i++){
            let oppDinos = document.getElementsByClassName("cardplayedOpp");
            if(oppDinos.length > 0){

                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                let randomNum = Math.random();

                const thisNode = oppDinos[Math.floor(randomNum*oppDinos.length)];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const attackdiv = document.createElement("div");
                attackdiv.classList.add("gainattackIcon");
                attackdiv.style.top = center1Y+'px';
                attackdiv.style.left = center1X+'px';
                attackdiv.innerHTML = "+2";
                document.body.appendChild(attackdiv);
                gsap.to(attackdiv, {opacity: 0, duration: 1.7, ease: "expo.in"});
                setTimeout(() => {attackdiv.parentNode.removeChild(attackdiv);}, 1900);


                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);

                await(sleep(1000));
            }
        }
    }

    if(eventTexto.split("3atk").length - 1 > 0){
        console.log("gain 3 atk");
        if(document.getElementsByClassName("cardplayedOpp").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/gainAttack.mp3');
            drawsound.loop = false;
            drawsound.play();
        }

        for(let i= 0; i< eventTexto.split("3atk").length - 1 ; i++){
            let oppDinos = document.getElementsByClassName("cardplayedOpp");
            if(oppDinos.length > 0){

                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                let randomNum = Math.random();
                const thisNode = oppDinos[Math.floor(randomNum*oppDinos.length)];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const attackdiv = document.createElement("div");
                attackdiv.classList.add("gainattackIcon");
                attackdiv.style.top = center1Y+'px';
                attackdiv.style.left = center1X+'px';
                attackdiv.innerHTML = "+3";
                document.body.appendChild(attackdiv);
                gsap.to(attackdiv, {opacity: 0, duration: 1.7, ease: "expo.in"});
                setTimeout(() => {attackdiv.parentNode.removeChild(attackdiv);}, 1900);


                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputGain1atkopp")[0].dispatchEvent(evento);

                await(sleep(1000));
            }
        }
    }
    
    if(eventTexto.split("2restore").length - 1 > 0){
        console.log("restore 2")
        if(document.getElementsByClassName("cardplayedOpp").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
        
        for(let i= 0; i< eventTexto.split("2restore").length - 1 ; i++){
            let oppDinos = document.getElementsByClassName("cardplayedOpp");
            if(oppDinos.length > 0){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                let randomNum = Math.random();

                const thisNode = oppDinos[Math.floor(randomNum*oppDinos.length)];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const restorediv = document.createElement("div");
                restorediv.classList.add("restorebgIcon");
                restorediv.style.top = center1Y+'px';
                restorediv.style.left = center1X+'px';
                restorediv.innerHTML = "+2";
                document.body.appendChild(restorediv);
                gsap.to(restorediv, {opacity: 0, duration: 1.7, ease: "expo.in"});
                setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1900);


                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                await(sleep(1000));
            }

        }
    }

    if(eventTexto.split("3restore").length - 1 > 0){
        console.log("restore 3")
        if(document.getElementsByClassName("cardplayedOpp").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
            drawsound.loop = false;
            drawsound.play();
        }

        for(let i= 0; i< eventTexto.split("3restore").length - 1 ; i++){
            let oppDinos = document.getElementsByClassName("cardplayedOpp");
            if(oppDinos.length > 0){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                let randomNum = Math.random();

                const thisNode = oppDinos[Math.floor(randomNum*oppDinos.length)];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const restorediv = document.createElement("div");
                restorediv.classList.add("restorebgIcon");
                restorediv.style.top = center1Y+'px';
                restorediv.style.left = center1X+'px';
                restorediv.innerHTML = "+3";
                document.body.appendChild(restorediv);
                gsap.to(restorediv, {opacity: 0, duration: 1.7, ease: "expo.in"});
                setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1900);


                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                oppDinos[Math.floor(randomNum*oppDinos.length)].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);

                await(sleep(1000));
            }

        }
    }

    if(eventTexto.split("1restoreall").length - 1 > 0){
        console.log("restore 1 all")
        if(document.getElementsByClassName("cardplayedOpp").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
        let oppDinos = document.getElementsByClassName("cardplayedOpp");
        if(oppDinos.length > 0){
            for(let i=0; i< oppDinos.length; i++){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                const thisNode = oppDinos[i];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const restorediv = document.createElement("div");
                restorediv.classList.add("restorebgIcon");
                restorediv.style.top = center1Y+'px';
                restorediv.style.left = center1X+'px';
                restorediv.innerHTML = "+1";
                document.body.appendChild(restorediv);
                gsap.to(restorediv, {opacity: 0, duration: 1.3, ease: "slow(0.9, 0.4, false)"});
                setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1100);

                oppDinos[i].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                await(sleep(300));
            }
        }
    }

    if(eventTexto.split("2restoreall").length - 1 > 0){
        console.log("restore 2 all")
        if(document.getElementsByClassName("cardplayedOpp").length > 0){
            const drawsound = new Audio('/static/frontend/sounds/restore.mp3');
            drawsound.loop = false;
            drawsound.play();
        }
        let oppDinos = document.getElementsByClassName("cardplayedOpp");
        if(oppDinos.length > 0){
            for(let i=0; i< oppDinos.length; i++){
                var evento = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });

                const thisNode = oppDinos[i];
                let pos = thisNode.getBoundingClientRect();
                const center1X = Math.floor(pos.left);
                const center1Y = Math.floor(pos.top);
                const restorediv = document.createElement("div");
                restorediv.classList.add("restorebgIcon");
                restorediv.style.top = center1Y+'px';
                restorediv.style.left = center1X+'px';
                restorediv.innerHTML = "+2";
                document.body.appendChild(restorediv);
                gsap.to(restorediv, {opacity: 0, duration: 1.3, ease: "slow(0.9, 0.4, false)"});
                setTimeout(() => {restorediv.parentNode.removeChild(restorediv);}, 1100);
                
                oppDinos[i].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);
                oppDinos[i].getElementsByClassName("inputrestore1Lpopp")[0].dispatchEvent(evento);

                await(sleep(300));
            }
        }
    }

}

/* Handling win and lose situations*/

function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
}

/* Hacer put requests para depositar premios*/

function youWin(){
    bgmusic.volume = 0;

    const difficultychosen = document.getElementById("startbutton").dataset.difficulty;
    const youwinlevelup = document.getElementById("youwinlevelup");
    const youwindinocoins = document.getElementById("youwindinocoins");

    switch (difficultychosen) {
        case "easy":
            youwinlevelup.innerHTML = "100 xp";
            youwindinocoins.innerHTML = "1000 Dinocoins"
            break;

        case "medium":
            youwinlevelup.innerHTML = "300 xp";
            youwindinocoins.innerHTML = "2000 Dinocoins"
            break;

        case "hard":
            youwinlevelup.innerHTML = "600 xp";
            youwindinocoins.innerHTML = "3500 Dinocoins"
            break;
   
    }

    closeFullscreen();
    const winmusic = new Audio(`/static/frontend/sounds/music/youwin.mp3`);
    winmusic.loop = true;
    winmusic.volume = 0.7;
    winmusic.play();

    const winfanfare1 = new Audio(`/static/frontend/sounds/music/youwinfanfare2.mp3`);
    winfanfare1.loop = false;
    winfanfare1.play();

    const winfanfare2 = new Audio(`/static/frontend/sounds/music/youwinfanfare.mp3`);
    winfanfare2.loop = false;
    winfanfare2.play();

    var tl = gsap.timeline();
    tl.set("#boarddiv", {display: 'none'})
    tl.set("#youwinscreen", {display: 'block'})
    tl.from("#youwinscreen", {duration: 0.5,
        opacity: 0,
        })
    tl.from("#winmessage", {duration: 2, opacity: 0})
    tl.from("#youwinlevelup", {duration: 2, opacity: 0})
    tl.from("#youwindinocoins", {duration: 2, opacity: 0})
    tl.from("#youwinexit", {duration: 2, opacity: 0})
}

function youLose(){
    bgmusic.volume = 0;
    closeFullscreen();
    const losemusic = new Audio(`/static/frontend/sounds/music/youlose.mp3`);
    losemusic.loop = true;
    losemusic.volume = 0.7;
    losemusic.play();

    const losefanfare = new Audio(`/static/frontend/sounds/music/youlosefanfare.mp3`);
    losefanfare.loop = false;
    losefanfare.play();

    var tl = gsap.timeline();
    tl.set("#boarddiv", {display: 'none'})
    tl.set("#youlosescreen", {display: 'block'})

    tl.from("#youlosescreen", {duration: 0.5,
        opacity: 0,
        })
    tl.from("#losemessage", {duration: 2, opacity: 0})
    tl.from("#youlosedinocoins", {duration: 2, opacity: 0})
    tl.from("#youloseexit", {duration: 2, opacity: 0})
}






