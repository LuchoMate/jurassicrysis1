import React from 'react';
import ReactDOM from 'react-dom';
/* import gsap from 'gsap';*/

/*---------Utilities----------*/
function removeElement(element) {
    if (typeof(element) === "string") {
      element = document.querySelector(element);
    }
    return function() {
        element.parentNode.removeChild(element);
    };
}

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
        .call(startGame);

    });
});

/* Animates cards being placed in deck*/
function placeDeck(who){
    if(who=="opp"){
        var tl = gsap.timeline();
        tl.from("#opp_deck div", {x: 500, stagger: 0.1});
    }

    else{
        var tl = gsap.timeline();
        tl.from("#ply_deck div", {x: 500, stagger: 0.1});
    }
    
   
}

/*---Each player draw 5 cards to begin. */
function startGame() {

    /* Llamar función que pone cartas*/
    placeDeck("opp");
    placeDeck("ply");
    
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

    setTimeout(function(){ console.log("FIRST TURN"); drawCard(currentTurn); }, 10000);
}

/* ----Fetch and draw a card----*/
async function drawCard(who){/* call destroyegg if pop == undefined*/

    
    if(who == "ply"){
        
        let response = await fetch(`/api/get_card/${plydeck.pop()}`);
        let card = await response.json();
        
        var parentEl = document.getElementById("ply_hand");
        var div1 = document.createElement("div");
        div1.classList.add("cardWrapper");
        div1.draggable = true;
        parentEl.appendChild(div1);
        const lastchild = document.getElementById("ply_hand").lastElementChild;

        const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
        drawsound.loop = false;
        drawsound.play();

        ReactDOM.render(<SketchHandCard name={card.name} />, lastchild);

        sortCardsPly();
        console.log(`ply: ${card.name}`);
    }
    else {
        
        let response = await fetch(`/api/get_card/${oppdeck.pop()}`);
        let card = await response.json(); 

        console.log(`opp: ${card.name}`);
    }
}

/* Sketches hand's card inside wrapper div*/

function SketchHandCard(props){
    const classes = 'border cardinHand navbarcolor blackbg font1w';
    return <React.Fragment>
                <div className={classes}>
                    {props.name}
                </div>
            </React.Fragment>
}

/* Arrange cards in players hand*/

function sortCardsPly() {
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

ReactDOM.render(<App />, document.getElementById('root'))