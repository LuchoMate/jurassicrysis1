import React from 'react';
import ReactDOM from 'react-dom';
/* import gsap from 'gsap';*/

/*--Test-*/
/* sortCardsPly();*/

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
        var tl = gsap.timeline();
        tl.to("#startbutton", {rotation: 360, duration: 1})
        .call(startGame);

    });
});

/*---Each player draw 5 cards to begin. */
function startGame() {
    
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
        var div = document.createElement("div");
        div.classList.add("cardWrapper");
        parentEl.appendChild(div);
        var div2 = document.createElement("div");
        div2.classList.add("cardinHand");
        div2.classList.add("border");
        div2.classList.add("navbarcolor");
        div2.classList.add("blackbg");
        div2.classList.add("font1w");
        div2.draggable = true;
        div.appendChild(div2);
        div2.innerHTML = card.name;
        /* 
        var img = document.createElement("img");
        img.classList.add("height80");*/

        sortCardsPly();
        console.log(`ply: ${card.name}`);
    }
    else {
        
        let response = await fetch(`/api/get_card/${oppdeck.pop()}`);
        let card = await response.json(); 

        console.log(`opp: ${card.name}`);
    }
}

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