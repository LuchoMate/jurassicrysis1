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

/*---Each player draw 5 cards to begin. Player who got first turn draws another one */
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
        for(let i=0; i<5; i++){/* starting hand*/
            drawCard("opp");
        }
        
    })
    .then(console.log(oppdeck));

    console.log("gonna fetch players deck");

    fetch(`/api/shuffled_deck`)
    .then(response => response.json())
    .then(plydata => {
        plydata.shuffled.forEach(element => {
            plydeck.push(element);
        });
        for(let i=0; i<5; i++){/* starting hand*/
            drawCard("ply");
        }
    })
    .then(console.log(plydeck));

    setTimeout(function(){ console.log("first turn"); drawCard(currentTurn); }, 6000);
}

async function drawCard(who){/* call destroyegg if pop == undefined*/
    if(who == "ply"){
        
        let response = await fetch(`/api/get_card/${plydeck.pop()}`);
        let card = await response.json(); 

        console.log(`ply: ${card.name}`);
    }
    else {
        let response = await fetch(`/api/get_card/${oppdeck.pop()}`);
        let card = await response.json(); 

        console.log(`opp: ${card.name}`);
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