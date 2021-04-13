
export function startGame(difficulty, whostarts) {

    oppdeck = [];

    fetch(`/api/opp_deck/${difficulty}`)
    .then(response => response.json())
    .then(oppdata => {oppdeck = oppdata.shuffled})
    .then(console.log("opp deck:"))
    .then(console.log(oppdeck));

}