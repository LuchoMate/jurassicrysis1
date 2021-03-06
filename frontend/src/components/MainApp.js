
/* Author: Luis Balladares
    For CS50's Web development with Python and Javascript
*/

import React from 'react';
import ReactDOM from 'react-dom';

function pageOut(){
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  gsap.to(".transition1 div", {
    opacity: 1,
    duration: 1,
    yPercent:-50,
    top:"50%",
    
    
  });
  
  function pageouttr2(){
    var tl = gsap.timeline()
    tl.set(".transition2 div", {display: 'block'}).to(".transition2 div", {
      opacity: 1,
      duration: 1,
      yPercent:-50,
    });
    return tl;
  }

  pageouttr2();
  
}
  
function pageIn(){
  
  gsap.to(".transition1 div", {
    opacity: 0,
    duration: 1,
    yPercent:-150,
    top:"50%",
    
    
  });

  function pageintr2(){
    var tl2 = gsap.timeline();
    tl2.to(".transition2 div", {
      duration: 1,
      opacity: 0,
      yPercent:50,
      top:"50%"}).set(".transition2 div", {display: 'none'});
      return tl2;
  }

  pageintr2();
    
}
  
  
  /* -----Home page carousel-----*/

var myIndex = 0;  
function carousel() {
  
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel, 5000);    
}
  
  /*------- Shop page-------*/
  
  
function shopPage(){
    document.getElementById("cancelBuy").addEventListener('click', cancelBuy)
    let packs = document.getElementsByClassName("boosterpack");
    for(let i =0; i < packs.length; i++){
      packs[i].addEventListener('click', function (event){
        handlePack(event.target.id);
      })
    }
  
}
  
/* Shows selected pack and Buy button*/
function handlePack(pack){
  let packs = document.getElementsByClassName("boosterpack");
  for(let i =0; i < packs.length; i++){
    packs[i].style.pointerEvents = "none";
  }

  document.getElementById("boosterimgDemo").src=`/static/frontend/images/shop/${pack}Booster.png`;
  document.getElementById("buyButton").addEventListener('click', function(){
    buyPack(pack);
  })
  var tl = gsap.timeline();
  tl.set("#buyAPack", {display: 'block'})
  tl.from("#buyAPack", {opacity: 0,scaleY: 0, scaleX: 0, duration: 0.5})
}
  
/* Attempts to buy pack*/
function buyPack(pack){
    console.log(`Gonna buy ${pack} pack`);

    let cookie = document.cookie
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1)

    fetch(`/api/buy_pack`, {
        method: 'PUT',
        headers: {
            'X-CSRFToken': csrfToken,
            "Content-Type": "application/json; charset=UTF-8"
          },
        
        body: JSON.stringify({
            "content": pack
        }) 
    }).then(response => {
      console.log(response.status); 
      if(response.status == 204){
        throw new Error('error');
      }
      return response.json();
    })
    .then(newCards => {

      //Modificar plata
      let checkCoins = document.getElementById("userCoins").innerHTML;
      checkCoins = parseInt(checkCoins) - 5000;
      document.getElementById("userCoins").innerHTML = checkCoins;

      var tl = gsap.timeline();
      tl.to("#buyAPack", {opacity: 0, scaleY: 0, scaleX: 0, duration: 0.2})
      tl.set("#buyAPack", {opacity: 1, scaleX: 1, scaleY: 1, display: 'none'})

      var old_element = document.getElementById("buyButton");
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      document.getElementById("closePurchase").addEventListener('click', closeNewCards)

      newCards.cardsAdded.forEach(element => {
       
        let mainflip = document.createElement("div");
        mainflip.classList.add("flip-card-main");
        document.getElementById("newCardsDisplay").appendChild(mainflip);

        mainflip.addEventListener('click',function() {
          
          this.classList.toggle("turnBack");
          this.style.pointerEvents = 'none';
          const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
          drawsound.loop = false;
          drawsound.play();
          })
        

        let innerflip = document.createElement("div");
        innerflip.classList.add("flip-card-inner");
        mainflip.appendChild(innerflip);

        let frontborder = document.createElement("div");
        frontborder.classList.add("flip-card-front");
        innerflip.appendChild(frontborder);

        let interiorborder = document.createElement("div");
        interiorborder.classList.add("interiorDeck");
        interiorborder.classList.add("interiorDeckPly");
        frontborder.appendChild(interiorborder);

        let iconcard = document.createElement("div");
        iconcard.classList.add("dinoIconCard");
        interiorborder.appendChild(iconcard);

        let iconimg = document.createElement("img");
        iconimg.src = '/static/frontend/images/icons/jcdinohead.png';
        iconimg.classList.add("height100");
        iconcard.appendChild(iconimg);

        let logotext = document.createElement("div");
        logotext.classList.add("jclogotext");
        logotext.innerHTML = "Jurassicrysis";
        interiorborder.appendChild(logotext);

        let backCard = document.createElement("div");
        backCard.classList.add("containerwrapper");
        innerflip.appendChild(backCard);

        showNewCard(element, backCard);
      });
      

      const button = new Audio('/static/frontend/sounds/winrps.mp3');
      button.loop = false;
      button.play();

      var tl = gsap.timeline();
      tl.set("#showNewCards", {visibility: 'visible'})
      tl.from("#showNewCards", {opacity: 0, scaleY: 0, scaleX: 0, duration: 0.2})
      
    })
    .catch(error => {console.log("not enough Dinocoins!");
    notMoney();
  })
}

  
/* Not enough money to buy pack*/
function notMoney(){
  var tl = gsap.timeline();
  tl.to("#buyAPack", {opacity: 0, scaleY: 0, scaleX: 0, duration: 0.2})
  tl.set("#buyAPack", {opacity: 1, scaleX: 1, scaleY: 1, display: 'none'})
  tl.set("#notMoney", {display: 'block'})
  tl.from("#notMoney", {opacity: 0, scaleY: 0, scaleX: 0, duration: 0.2})

  const wrong = new Audio('/static/frontend/sounds/wrong.wav');
  wrong.loop = false;
  wrong.play();

  var old_element = document.getElementById("buyButton");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);

  document.getElementById("closeNotMoney").addEventListener('click', closeNotMoney)

}

function closeNotMoney(){
  var tl = gsap.timeline();
  tl.to("#notMoney", {opacity: 0, scaleX: 0, scaleY: 0, duration: 0.2})
  tl.set("#notMoney", {display: 'none', opacity: 1, scaleY: 1, scaleX: 1})

    /* To remove click handler from button*/
    var old_element = document.getElementById("closeNotMoney");
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    let packs = document.getElementsByClassName("boosterpack");
    for(let i =0; i < packs.length; i++){
    packs[i].style.pointerEvents = "auto";
    }

}

/* close cards display and clears current cards to show*/
function closeNewCards(){
  var tl = gsap.timeline();
  tl.to("#showNewCards", {opacity: 0, scaleX: 0, scaleY: 0, duration: 0.2})
  tl.set("#showNewCards", {visibility: 'hidden', opacity: 1, scaleY: 1, scaleX: 1})

  let clearDisplay = document.getElementById("newCardsDisplay");
  while(clearDisplay.lastElementChild){
    clearDisplay.removeChild(clearDisplay.lastElementChild);
  }

  let packs = document.getElementsByClassName("boosterpack");
    for(let i =0; i < packs.length; i++){
    packs[i].style.pointerEvents = "auto";
    }

}
  
function cancelBuy(){

  /* To remove click handler from button*/
  var old_element = document.getElementById("buyButton");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);

  let packs = document.getElementsByClassName("boosterpack");
  for(let i =0; i < packs.length; i++){
    packs[i].style.pointerEvents = "auto";
  }

  var tl = gsap.timeline();
  tl.to("#buyAPack", {scaleY: 0, scaleX: 0, duration: 0.5})
  tl.set("#buyAPack", {display: 'none', scaleX: 1, scaleY: 1})
}
  
/* Show card by id*/
async function showNewCard(newCard, nodetoAdd){
  let response = await fetch(`/api/get_card/${newCard}`);
  let card = await response.json();

  nodetoAdd.classList.add(`displayRarity${card.rarity}`);

  if(card.card_type != "ev"){
    ReactDOM.render(<SketchDinoCard name={card.name}
        atk={card.attack}
        lifepoints={card.life_points}
        condition={card.condition_text}
        rarity={card.rarity}
        size={card.size}
        type={card.card_type}
        cost={card.cost}

        />, nodetoAdd);

  }

  else{
    ReactDOM.render(<SketchEventCard name={card.name}
        condition={card.condition_text}
        rarity={card.rarity}
        type={card.card_type}
        cost={card.cost}
        eventtext={card.event_effect}

    />, nodetoAdd)

  }

}
  
function SketchDinoCard(props){
  const classhand = 'displayCardContainer';
  const interiorcard = `interiorcard${props.type}`;
  const attackTag = 'attackTag flexallcenter';
  const costTag = 'costTag flexallcenter';
  const energyTag = 'energyTag flexallcenter';
  const lifepointsTag = 'lifepointsTag flexallcenter';
  const nameTag = `namediv namediv${props.rarity} flexallcenter overhidden`;
  const dinopicTag = 'dinopicDiv noEvents';
  const imgTag = 'height100 width100';
  const conditionTag = 'conditionTag flexallcenter overhidden';
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

function SketchEventCard(props){
    
  const classhand = 'displayCardContainer';
  const interiorcard = `interiorcard${props.type}`;
  const costTag = 'costTag flexallcenter';
  const energyTag = 'energyTag flexallcenter';
  const nameTag = `namediv namediv${props.rarity} flexallcenter overhidden`;
  const dinopicTag = 'dinopicDiv noEvents';
  const imgTag = 'height100 width100';
  const conditionTagEv = 'conditionTagEvDisplay overhidden';
  
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

/*------- Trades Page-------*/

/* Loads incoming trades requests*/
async function loadIncoming() {
  let response = await fetch(`/api/incoming_requests`);
  if(response.status == 200){
    const incoming_div = document.getElementById("incoming_requests")
    incoming_div.innerHTML = ""
    let incoming_requests = await response.json();
    

    let tablediv = document.createElement("table");
    tablediv.classList.add("table");
    tablediv.classList.add("table-hover");
    tablediv.classList.add("table-dark");
    tablediv.classList.add("table-striped")
    incoming_div.appendChild(tablediv);

    let thead = document.createElement("thead");
    tablediv.appendChild(thead);
    let tr = document.createElement("tr");
    thead.appendChild(tr);

    let tSender = document.createElement("th");
    tSender.scope="col";
    tSender.innerHTML = "Sender"
    tSender.classList.add("textalign");
    tr.appendChild(tSender);

    let tsenderCard = document.createElement("th");
    tsenderCard.scope="col";
    tsenderCard.innerHTML="Card Offered";
    tsenderCard.classList.add("textalign");
    tr.appendChild(tsenderCard);

    let tcardReq = document.createElement("th");
    tcardReq.scope="col";
    tcardReq.innerHTML = "Card Requested";
    tcardReq.classList.add("textalign");
    tr.appendChild(tcardReq);

    let tAccept = document.createElement("th");
    tAccept.scope="col";
    tAccept.innerHTML = "Accept";
    tAccept.classList.add("textalign");
    tr.appendChild(tAccept);

    let tReject = document.createElement("th");
    tReject.scope="col";
    tReject.innerHTML = "Reject";
    tReject.classList.add("textalign");
    tr.appendChild(tReject);

    let tbody = document.createElement("tbody");
    tablediv.appendChild(tbody);
    
    incoming_requests.forEach(element => {
      let trow = document.createElement("tr");
      tbody.appendChild(trow);

      ReactDOM.render(<RenderIncomingCell 
      Sender={element.Sender}
      SenderCard={element.Sender_card}
      RecipientCard={element.Recipient_card}
      requestId={element.id}
      
      />, trow)
    });

  }
  else {
    document.getElementById("incoming_requests").innerHTML = "No active Requests."
  }
}

/* Renders each cell details*/
class RenderIncomingCell extends React.Component{
  constructor(props){
    super(props);
    this.cancelTrade = this.cancelTrade.bind(this);
    this.acceptTrade = this.acceptTrade.bind(this);
    this.destroyMe = this.destroyMe.bind(this);
  }

  acceptTrade(){
    console.log("accept trade")
    console.log(this.props.requestId)

    let cookie = document.cookie
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1)

    fetch(`/api/accept_trade`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            "Content-Type": "application/json; charset=UTF-8"
          },
        
        body: JSON.stringify({
            "tradeId": this.props.requestId,
            "senderPlayer": this.props.Sender,
            "senderCard": this.props.SenderCard,
            "recipientCard": this.props.RecipientCard
            
        }) 
    }).then(response => {
      
      if(response.status != 204){
        throw new Error('error');
      }
      else{console.log(response.status);
        const button = new Audio('/static/frontend/sounds/winrps.mp3');
        button.loop = false;
        button.play();

        const thisNode = ReactDOM.findDOMNode(this);            
        var tl = gsap.timeline();
        tl.to(thisNode, {opacity: 0, duration: 0.4})
        setTimeout(() => {this.destroyMe()}, 0.7);
        setTimeout(() => {loadIncoming()}, 0.8);
        setTimeout(() => {tradeAccepted(this.props.SenderCard, this.props.RecipientCard)}, 0.8);

      }
    })
    .catch(error => {console.log(error);
      const wrong = new Audio('/static/frontend/sounds/wrong.wav');
      wrong.loop = false;
      wrong.play();
      
    });

  }

  cancelTrade(){
    console.log("cancel trade")
    console.log(this.props.requestId)

    let cookie = document.cookie
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1)

    fetch(`/api/cancel_trade`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken,
            "Content-Type": "application/json; charset=UTF-8"
          },
        
        body: JSON.stringify({
            "tradeId": this.props.requestId
            
        }) 
    }).then(response => {
      
      if(response.status != 204){
        throw new Error('error');
      }
      else{console.log(response.status);
        const button = new Audio('/static/frontend/sounds/button2.mp3');
        button.loop = false;
        button.play();

        const thisNode = ReactDOM.findDOMNode(this);            
        var tl = gsap.timeline();
        tl.to(thisNode, {opacity: 0, duration: 0.4})
        setTimeout(() => {this.destroyMe()}, 0.7);
        setTimeout(() => {loadIncoming()}, 0.8);

      }
    })
    .catch(error => {console.log(error);
      const wrong = new Audio('/static/frontend/sounds/wrong.wav');
      wrong.loop = false;
      wrong.play();
      
    });

  }

  destroyMe(){
    const thisNode = ReactDOM.findDOMNode(this);
    const parent = thisNode.parentNode;
    ReactDOM.unmountComponentAtNode(thisNode.parentNode);
    parent.parentNode.removeChild(parent);  
  } 

  render(){
    return(
      
      <React.Fragment>
          <td className="textalign"><a href={'profile/'+ this.props.Sender}>{this.props.Sender}</a></td>
          <td className="textalign">{this.props.SenderCard}</td>
          <td className="textalign">{this.props.RecipientCard}</td>
          <td className="textalign"><button onClick={this.acceptTrade} type="button" className="btn btn-success">Accept</button></td>
          <td className="textalign"><button onClick={this.cancelTrade} type="button" className="btn btn-danger">Reject</button></td>
      </React.Fragment>
    )
  }

}

async function tradeAccepted(senderCard, recipientCard){
  let createadiv = document.createElement("div")
  createadiv.classList.add("singlecardwrapper")
  document.getElementById("myNewCard").appendChild(createadiv)
  const nodedisplay = document.getElementById("myNewCard").lastElementChild;
  
  let response = await fetch(`/api/return_card_id/${senderCard}`);
  let card = await response.json();
  showNewCard(card.cardid, nodedisplay);

  let createadiv2 = document.createElement("div")
  createadiv2.classList.add("singlecardwrapper")
  document.getElementById("mySentCard").appendChild(createadiv2)
  const nodedisplay2 = document.getElementById("mySentCard").lastElementChild;

  let response2 = await fetch(`/api/return_card_id/${recipientCard}`);
  let card2 = await response2.json();
  showNewCard(card2.cardid, nodedisplay2);

  var tl = gsap.timeline()
  tl.set("#tradeAccepted", {visibility: 'visible'})
  tl.from("#tradeAccepted", {scaleY: 0, scaleX: 0, duration: 0.3})

}


/* Loads outgoing trades requests */
async function loadOutgoing() {
  let out_response = await fetch(`/api/outgoing_requests`);
  if(out_response.status == 200){
    const outgoing_div = document.getElementById("outgoing_requests")
    outgoing_div.innerHTML = ""
    let outgoing_requests = await out_response.json();
    

    
    let tablediv = document.createElement("table");
    tablediv.classList.add("table");
    tablediv.classList.add("table-hover");
    tablediv.classList.add("table-dark");
    tablediv.classList.add("table-striped")
    outgoing_div.appendChild(tablediv); 

    let thead = document.createElement("thead");
    tablediv.appendChild(thead);
    let tr = document.createElement("tr");
    thead.appendChild(tr);

    let cOffered = document.createElement("th");
    cOffered.scope="col";
    cOffered.innerHTML = "Card Offered"
    cOffered.classList.add("textalign")
    tr.appendChild(cOffered);

    let tUser = document.createElement("th");
    tUser.scope="col";
    tUser.innerHTML="User";
    tUser.classList.add("textalign")
    tr.appendChild(tUser);

    let tcardReq = document.createElement("th");
    tcardReq.scope="col";
    tcardReq.innerHTML = "Card Requested";
    tcardReq.classList.add("textalign");
    tr.appendChild(tcardReq);

    let tCancel = document.createElement("th");
    tCancel.scope="col";
    tCancel.innerHTML = "Cancel trade";
    tCancel.classList.add("textalign");
    tr.appendChild(tCancel);

    let tbody = document.createElement("tbody");
    tablediv.appendChild(tbody);

    outgoing_requests.forEach(element => {

      let trow = document.createElement("tr");
      tbody.appendChild(trow);

      ReactDOM.render(<RenderOutgoingCell
        SenderCard={element.Sender_card}
        Recipient={element.Recipient}
        RecipientCard={element.Recipient_card}
        requestId={element.id}
        />, trow)

    });
  }
  else {
    document.getElementById("outgoing_requests").innerHTML = "No sent requests."
  }
}

/* Renders each cell details*/
class RenderOutgoingCell extends React.Component{
  constructor(props){
    super(props);
    this.cancelTrade = this.cancelTrade.bind(this);
    this.destroyMe = this.destroyMe.bind(this);
  }

  cancelTrade(){
    console.log("cancel trade")
    console.log(this.props.requestId)

    /* Llamar api delete y en 200 hacer lo siguiente*/
    let cookie = document.cookie
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1)

    fetch(`/api/cancel_trade`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken,
            "Content-Type": "application/json; charset=UTF-8"
          },
        
        body: JSON.stringify({
            "tradeId": this.props.requestId
            
        }) 
    }).then(response => {
      
      if(response.status != 204){
        throw new Error('error');
      }
      else{console.log(response.status);
        const button = new Audio('/static/frontend/sounds/button2.mp3');
        button.loop = false;
        button.play();

        const thisNode = ReactDOM.findDOMNode(this);            
        var tl = gsap.timeline();
        tl.to(thisNode, {opacity: 0, duration: 0.4})
        setTimeout(() => {this.destroyMe()}, 0.7);
        setTimeout(() => {loadOutgoing()}, 0.8);


      }
    })
    .catch(error => {console.log(error);
      const wrong = new Audio('/static/frontend/sounds/wrong.wav');
      wrong.loop = false;
      wrong.play();
      
    });

  }

  destroyMe(){
    const thisNode = ReactDOM.findDOMNode(this);
    const parent = thisNode.parentNode;
    ReactDOM.unmountComponentAtNode(thisNode.parentNode);
    parent.parentNode.removeChild(parent);  
  } 
  
  render(){
    return(
      <React.Fragment>
          <td className="textalign">{this.props.SenderCard}</td>
          <td className="textalign"><a href={'profile/'+ this.props.Recipient}>{this.props.Recipient}</a></td>
          <td className="textalign">{this.props.RecipientCard}</td>
          <td className="textalign"><button onClick={this.cancelTrade} type="button" className="btn btn-danger">Cancel</button></td>
      </React.Fragment>
    )
  }

}

function openTrade(){
  const button = new Audio('/static/frontend/sounds/button2.mp3');
  button.loop = false;
  button.play();
  var tl = gsap.timeline()
  tl.set("#tradeCategory", {visibility: 'visible'})
  tl.from("#tradeCategory", {scaleX: 0, scaleY: 0, duration: 0.2})
}

async function showCategory(category){
  
  const button = new Audio('/static/frontend/sounds/button2.mp3');
  button.loop = false;
  button.play();
 
  const catString = String(category)
  const catDisplay = catString.slice(8);
  let catArray = []

  switch (catDisplay) {
    case "ca":
      catArray=[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
      break;
    case "he":
      catArray=[18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]
      break;
    case "aq":
      catArray=[33,34,35,36,37,38,39,40,41,42,43,44,45,46,47]
      break;
    case "fl":
      catArray=[48,49,50,51,52,53,54,55,56,57,58,59,60,61,62]
      break;
    case "ev":
      catArray=[63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82]

    default:
      break;
  }

  catArray.forEach(element => {
    const createadiv = document.createElement("div")
    createadiv.dataset.cardid = element;
    createadiv.style.cursor = 'pointer';
    createadiv.classList.add("singlecardwrapper");

    createadiv.addEventListener('click', function(event){
      showCardAvailable(event.currentTarget.dataset.cardid);
    }, true);
    
    document.getElementById("categoryContainer").appendChild(createadiv)

    const lastCatChild = document.getElementById("categoryContainer").lastElementChild;
    showNewCard(element, lastCatChild)
  });

  closeTrade();
  var tl = gsap.timeline()
  tl.set("#showCategory", {visibility: 'visible'})
  tl.from("#showCategory", {scaleX: 0, scaleY: 0, duration: 0.2})

}

function closeTrade(){
  const button = new Audio('/static/frontend/sounds/button2.mp3');
  button.loop = false;
  button.play();
  var tl = gsap.timeline()

  tl.to("#tradeCategory", {scaleX: 0, scaleY: 0, duration: 0.2})
  tl.set("#tradeCategory", {visibility: 'hidden'})
  tl.set("#tradeCategory", {scaleX: 1, scaleY: 1});

}

function closeCategory(){
  const button = new Audio('/static/frontend/sounds/button2.mp3');
  button.loop = false;
  button.play();
  var tl = gsap.timeline()
  tl.to("#showCategory", {scaleX: 0, scaleY: 0, duration: 0.2})
  tl.set("#showCategory", {visibility: 'hidden'})
  tl.set("#showCategory", {scaleX: 1, scaleY: 1});

  document.getElementById("categoryContainer").innerHTML = "";

}

/* Shows if selected card is available for trade*/
async function showCardAvailable(card){
  const createadiv = document.createElement("div")
  createadiv.classList.add("singlecardwrapper");
  document.getElementById("displayCardAvailable").appendChild(createadiv);
  const nodedisplay = document.getElementById("displayCardAvailable").lastElementChild;
  showNewCard(card, nodedisplay);

  let check_card = await fetch(`/api/check_card/${card}`);
  if(check_card.status == 200){

    const available_div = document.getElementById("cardUserAvailables")
    available_div.innerHTML = ""
    let available_users = await check_card.json();

    let tablediv = document.createElement("table");
    tablediv.classList.add("table");
    tablediv.classList.add("table-hover");
    tablediv.classList.add("table-dark");
    tablediv.classList.add("table-striped");
    tablediv.classList.add("align-middle");
    available_div.appendChild(tablediv); 

    let thead = document.createElement("thead");
    tablediv.appendChild(thead);
    let tr = document.createElement("tr");
    thead.appendChild(tr);

    let usershow = document.createElement("th");
    usershow.scope="col";
    usershow.innerHTML = "Player"
    tr.appendChild(usershow);

    let Quantity = document.createElement("th");
    Quantity.scope="col";
    Quantity.innerHTML="Quantity";
    tr.appendChild(Quantity);

    let Request = document.createElement("th");
    Request.scope="col";
    Request.innerHTML = "Send Offer";
    tr.appendChild(Request);

    let tbody = document.createElement("tbody");
    tablediv.appendChild(tbody);

    available_users.forEach(element => {

      let trow = document.createElement("tr");
      trow.style.cursor ="pointer";
      tbody.appendChild(trow);

      ReactDOM.render(<RenderPlayerAvlb
        Player={element.Owner}
        Quantity={element.quantity}
        CardCollected={element.Card_collected}
        requestId={element.id}
        cardtoTrade={card}
        />, trow)

    });

  }
  else {
    document.getElementById("cardUserAvailables").innerHTML = "This card is not available for trade at this moment."
  }

  closeCategory();
  var tl = gsap.timeline()
  tl.set("#showCardAvailable", {visibility: 'visible'})
  tl.from("#showCardAvailable", {scaleX: 0, scaleY: 0, duration: 0.2});

}

function finishTrade(playerToSend, cardToTrade, cardToOffer){
  closeAvailable();
  
  console.log(`Send RQ to ${playerToSend}, I want ${cardToTrade} and I offer ${cardToOffer}`)

  let cookie = document.cookie
  let csrfToken = cookie.substring(cookie.indexOf('=') + 1)

  fetch(`/api/new_trade`, {
      method: 'POST',
      headers: {
          'X-CSRFToken': csrfToken,
          "Content-Type": "application/json; charset=UTF-8"
        },
      
      body: JSON.stringify({
          "TargetPlayer": playerToSend,
          "TargetCard": cardToTrade,
          "OfferedCard": cardToOffer
      }) 
  }).then(response => {
    
    if(response.status != 201){
      throw new Error('error');
    }
    else console.log(response.status); 

    return response.json();
  }).then(response => {console.log(response);
      const button = new Audio('/static/frontend/sounds/winrps.mp3');
      button.loop = false;
      button.play();
      document.getElementById("newTradeMsg").innerHTML="Trade request created successfully!";
      var tl = gsap.timeline()
      tl.set("#successfulNewTrade", {display: 'block'})
      tl.from("#successfulNewTrade", {scaleY: 0, scaleX: 0, duration: 0.3})

  })
  .catch(error => {console.log(error);
    const wrong = new Audio('/static/frontend/sounds/wrong.wav');
    wrong.loop = false;
    wrong.play();
    document.getElementById("newTradeMsg").innerHTML="Trade request could not be completed.";
    var tl = gsap.timeline()
    tl.set("#successfulNewTrade", {display: 'block'})
    tl.from("#successfulNewTrade", {scaleY: 0, scaleX: 0, duration: 0.3})
  });

}

/* Renders each players available cards, also shows current user available cards for trade on click*/
class RenderPlayerAvlb extends React.Component{
  constructor(props){
    super(props);
   
    this.showDetails = this.showDetails.bind(this);
    this.hideTradesList = this.hideTradesList.bind(this);
  }

  async hideTradesList() {
    document.getElementById("cardUserAvailables").innerHTML="";
    document.getElementById("cardAvTitle").innerHTML=`Choose card to offer to <strong>${this.props.Player}</strong>`;
    document.getElementById("yourAvCards").style.display = 'block';

    let response = await fetch(`/api/mycardstrade`);
    if(response.status == 200){
      let cardlist = await response.json();
      cardlist.forEach(element => {
        const createadiv = document.createElement("div")
        /* createadiv.dataset.mycardid = element;*/
        createadiv.style.cursor = 'pointer';
        createadiv.classList.add("singlecardwrapper");
        createadiv.dataset.playerToSend = this.props.Player;
        createadiv.dataset.cardtoTrade = this.props.cardtoTrade;
        createadiv.dataset.cardtoOffer = element;
        
        createadiv.addEventListener('click', function(event){
          finishTrade(event.currentTarget.dataset.playerToSend,
            event.currentTarget.dataset.cardtoTrade,
            event.currentTarget.dataset.cardtoOffer);
        }, true); 
        
        document.getElementById("cardUserAvailables").appendChild(createadiv)
        const lastCatChild = document.getElementById("cardUserAvailables").lastElementChild;
        showNewCard(element, lastCatChild)
  
      });
    }
    else {
      document.getElementById("cardUserAvailables").innerHTML="You don't have any available cards to trade";
    }
    gsap.to("#cardUserAvailables", {opacity: 1, duration: 0.3})
  }

  showDetails(){
    const button = new Audio('/static/frontend/sounds/button2.mp3');
    button.loop = false;
    button.play();

    var tl = gsap.timeline();
    tl.to("#cardUserAvailables", {opacity: 0, duration: 0.3})
    tl.call(this.hideTradesList)
  
  }

  render(){
    return(
      <React.Fragment>
          <td>{this.props.Player}</td>
          <td>{this.props.Quantity}</td>
          <td><button  onClick={this.showDetails} type="button" className="btn btn-primary">Trade</button></td>
      </React.Fragment>
    )
  }

}

function closeAvailable() {
  var tl = gsap.timeline()
  tl.to("#showCardAvailable", {scaleX: 0, scaleY: 0, duration: 0.2})
  tl.set("#showCardAvailable", {visibility: 'hidden', scaleX: 1, scaleY: 1,})
  document.getElementById("displayCardAvailable").innerHTML ="";
  document.getElementById("cardUserAvailables").innerHTML ="";
  document.getElementById("cardAvTitle").innerHTML ="Card availability";
  document.getElementById("yourAvCards").style.display = 'none';

}

function closeTradeStatus() {
  loadOutgoing();
  var tl = gsap.timeline()
  tl.to("#successfulNewTrade", {scaleX: 0, scaleY: 0, duration: 0.3})
  tl.set("#successfulNewTrade", {display: 'none', scaleX: 1, scaleY: 1})
  document.getElementById("newTradeMsg").innerHTML = "";
}

function closeTradeAccepted(){
  var tl = gsap.timeline()
  tl.to("#tradeAccepted", {scaleX: 0, scaleY: 0})
  tl.set("#tradeAccepted", {scaleX: 1, scaleY: 1, visibility: 'hidden'})
  document.getElementById("myNewCard").innerHTML = "";
  document.getElementById("mySentCard").innerHTML = "";
  loadIncoming();
  loadOutgoing();
}

/* On page load functions*/
function tradePage(){
  loadIncoming();
  loadOutgoing();
  document.getElementById("newTrade").addEventListener('click', openTrade)
  document.getElementById("cancelTrade").addEventListener('click', function(){closeTrade()} )
  document.getElementById("closeCategory").addEventListener('click', function(){closeCategory()} )
  document.getElementById("closeCardAvailable").addEventListener('click', function(){closeAvailable()} )
  document.getElementById("closeSuccessful").addEventListener('click', function(){closeTradeStatus()})
  document.getElementById("closeTradeAccepted").addEventListener('click', function(){closeTradeAccepted()})

  const categories = document.getElementsByClassName("categoryPic");
  for(let i =0; i < categories.length; i++){
    categories[i].addEventListener('click', function (event){
      showCategory(event.target.id);
    }, true)
  } 
  
}

/*-----------Deck manager page-------------*/


/* On page load*/
function deckmanagerPage(){
  let dl = getDeckLength();
  loadDeck();
  load_avl_collection();
  loadComposition();

  document.getElementById("closeInvalidAdd").addEventListener('click', function(){closeInvalidAdd()})
}

/* Loads and renders user's deck*/
async function loadDeck() {
  let response = await fetch("/api/my_deck")
  let deck = await response.json();

  deck.deck.forEach(element => {
    const createadiv = document.createElement("div")
    createadiv.dataset.cardid = element;
    createadiv.style.cursor = 'pointer';
    createadiv.classList.add("singlecardwrapper");
    createadiv.style.display="flex";
    createadiv.style.justifyContent="center";
    createadiv.dataset.cardid = element;
    createadiv.addEventListener('click', function(event){
      removeFromDeck(event.currentTarget.dataset.cardid);
    }, true);

    /* A??adir event listener removeFromDeck*/

    document.getElementById("deckContainer").appendChild(createadiv)
    const lastCatChild = document.getElementById("deckContainer").lastElementChild;
    showNewCard(element, lastCatChild)
    
  });


}
/* Gets users deck length*/
async function getDeckLength(){
  let response = await fetch("/api/my_deck")
  let deck = await response.json();
  document.getElementById("deckLength").innerHTML = deck.deck.length;

  if (deck.deck.length == 20){
    document.getElementById("deckLengthIcon").innerHTML = "&#9989;"
  }
  else {
    document.getElementById("deckLengthIcon").innerHTML = "&#9940;"
  }

  return deck.deck.length;

}

/* Loads and renders users available cards*/
async function load_avl_collection(){
  let response = await fetch("/api/myallavl")
  if(response.status == 200){
    let cardlist = await response.json();
    cardlist.forEach(element => {
      const createadiv = document.createElement("div")
      createadiv.style.cursor = 'pointer';
      createadiv.classList.add("singlecardwrapper");
      createadiv.dataset.cardid = element;
      createadiv.addEventListener('click', function(event){
        addToDeck(event.currentTarget.dataset.cardid);
      }, true);

      document.getElementById("collContainer").appendChild(createadiv)
      const lastCatChild = document.getElementById("collContainer").lastElementChild;
      showNewCard(element, lastCatChild)

    });

  }
  else {
    const creatediv = document.createElement("div")
    creatediv.classList.add("textalign")
    creatediv.classList.add("navbarcolor")
    creatediv.classList.add("pangolinfont")
    creatediv.classList.add("font5vh")
    creatediv.classList.add("flexcontainer")
    creatediv.innerHTML="No cards available."
    document.getElementById("collContainer").appendChild(creatediv)
  }
 
}
/* Get user's # of card types on deck*/
async function loadComposition(){
  let response = await fetch('/api/deck_composition');
  let composition = await response.json();

  document.getElementById("caCardCount").innerHTML = composition.ca;
  document.getElementById("heCardCount").innerHTML = composition.he;
  document.getElementById("aqCardCount").innerHTML = composition.aq;
  document.getElementById("flCardCount").innerHTML = composition.fl;
  document.getElementById("evCardCount").innerHTML = composition.ev;

}

/* Attempts to add a card from collection to deck*/
function addToDeck(cardid){
  let cookie = document.cookie
  let csrfToken = cookie.substring(cookie.indexOf('=') + 1)
  fetch(`/api/update_deck`, {
    method: 'PUT',
    headers: {
        'X-CSRFToken': csrfToken,
        "Content-Type": "application/json; charset=UTF-8"
      },
    
    body: JSON.stringify({
        "content": cardid
    }) 
  }).then(response => {
    console.log(response.status); 
    if(response.status == 204){
      
      let dl = getDeckLength();
      document.getElementById("deckContainer").innerHTML="";
      loadDeck();
      document.getElementById("collContainer").innerHTML="";
      load_avl_collection();
      /* Colocarle la animacion aqui*/
      const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
      drawsound.loop = false;
      drawsound.play();
      const y1 = -(window.innerHeight*0.5)
      const x1 = window.innerWidth*0.75
      const x2 = window.innerWidth*0.25 
      var tl = gsap.timeline()
      tl.set("#addCard", {y: y1, x: x1, visibility: 'visible'})
      tl.to("#addCard", {x: x2, duration: 0.4})
      tl.to("#addCard", {opacity: 0, duration: 0.2})
      tl.set("#addCard", {opacity: 1, visibility: 'hidden'})
      loadComposition();

    }
    else if(response.status == 406){
      console.log("Max 2 per deck")
      var tl = gsap.timeline()
      tl.set("#invalidAdd", {visibility: 'visible'})
      tl.from("#invalidAdd", {scaleX: 0, scaleY: 0, duration: 0.3})
      const wrong = new Audio('/static/frontend/sounds/wrong.wav');
      wrong.loop = false;
      wrong.play();

    }
    else {
      console.log("Invalid card, try again!")
    }
  })

}
/* Removes a card from deck to collection*/
function removeFromDeck(cardid){
  let cookie = document.cookie
  let csrfToken = cookie.substring(cookie.indexOf('=') + 1)

  fetch(`/api/update_deck`, {
    method: 'DELETE',
    headers: {
        'X-CSRFToken': csrfToken,
        "Content-Type": "application/json; charset=UTF-8"
      },
    
    body: JSON.stringify({
        "content": cardid
        
    }) 
  }).then(response => {
    if(response.status == 204){

      let dl = getDeckLength();
      document.getElementById("deckContainer").innerHTML="";
      loadDeck();
      document.getElementById("collContainer").innerHTML="";
      load_avl_collection();

      const drawsound = new Audio('/static/frontend/sounds/drawcard.mp3');
      drawsound.loop = false;
      drawsound.play();
      const y1 = -(window.innerHeight*0.5)
      const x1 = window.innerWidth*0.25
      const x2 = window.innerWidth*0.75 
      var tl = gsap.timeline()
      tl.set("#removeCard", {y: y1, x: x1, visibility: 'visible'})
      tl.to("#removeCard", {x: x2, duration: 0.4})
      tl.to("#removeCard", {opacity: 0, duration: 0.2})
      tl.set("#removeCard", {opacity: 1, visibility: 'hidden'})
      loadComposition();

    }
    else {
      console.log("Invalid card removed!")
    }

  })

}

function closeInvalidAdd(){
  var tl = gsap.timeline()
  tl.to("#invalidAdd", {scaleX: 0, scaleY: 0, duration: 0.3})
  tl.set("#invalidAdd", {visibility: 'hidden', scaleX: 1, scaleY: 1})
}

/*---------Database page----------- */

function databasePage(){
  document.getElementById("closeCardDetails").addEventListener('click', function(){closeCardDetails()})
  document.getElementById("closeGetImage").addEventListener('click', function(){closeCardImage()})
  document.getElementById("dbCatSelect").addEventListener('change', function(){dbShowCategory(this.value)}, false)
  document.getElementById("userSearch").addEventListener('input', searchCard);
  dbShowCategory("all");

}

function closeCardDetails(){
  var tl = gsap.timeline()
  tl.to("#dbCardDetails", {scaleX: 0, scaleY: 0, duration: 0.3})
  tl.set("#dbCardDetails", {scaleX: 1, scaleY: 1, visibility: 'hidden'})
  document.getElementById("cdCardDisplay").innerHTML="";
}

function closeCardImage(){
  var tl = gsap.timeline()
  tl.to("#cdGetImage", {scaleX: 0, scaleY: 0, duration: 0.5})
  tl.set("#cdGetImage", {scaleX: 1, scaleY: 1, visibility: 'hidden'})
}

const cardList = [
  "Scipionyx",
  "Sinornithoides",
  "Bambiraptor",
  "Chilesaurus",
  "Elopteryx",
  "Velociraptor",
  "Bahariasaurus",
  "Saltriovenator",
  "Megapnosaurus",
  "Allosaurus",
  "Albertosaurus",
  "Inostrancevia",
  "Metriacanthosaurus",
  "Tyrannosaurus",
  "Giganotosaurus",
  "Compsognathus",
  "Segnosaurus",
  "Homalocephale",
  "Qantassaurus",
  "Anchisaurus",
  "Dicraeosaurus",
  "Kaatedocus",
  "Huayangosaurus",
  "Kunbarrasaurus",
  "Ankylosaurus",
  "Dracopelta",
  "Barosaurus",
  "Stegosaurus",
  "Triceratops",
  "Brachiosaurus",
  "Umoonasaurus",
  "Hainosaurus",
  "Rhomaleosaurus",
  "Megalneusaurus",
  "Dolichosaurus",
  "Alexeyisaurus",
  "Styxosaurus",
  "Elasmosaurus",
  "Futabasaurus",
  "Brachauchenius",
  "Thalassomedon",
  "Kronosaurus",
  "Mosasaurus",
  "Miguelosaurus",
  "Plesiosaurus",
  "Anurognathus",
  "Jinfengopteryx",
  "Archaeopteryx",
  "Alanqa",
  "Gwawinapterus",
  "Tupandactylus",
  "Anhanguera",
  "Azhdarcho",
  "Bellubrunnus",
  "Dsungaripterus",
  "Ikrandraco",
  "Zhejiangopterus",
  "Ornitocheirus",
  "Pterodactylus",
  "Zhenyuanopterus",
  "Ambush",
  "Better Lands",
  "Large Litter",
  "Surprise Attack",
  "Regroup now",
  "Maternal Bond",
  "Famine",
  "Cold Winter",
  "Migration",
  "Drought",
  "Repel Attack",
  "Counterattack",
  "Predators Out",
  "Floods",
  "Eruption",
  "Earthquake",
  "Tsunami",
  "Thunder",
  "Stampede",
  "Asteroid"
]

/* Shows cards matching search query*/
async function searchCard(e){
  let querySearch = [];
  const userSearch = e.target.value.toLowerCase()
  for(let i=0; i<cardList.length; i++){
    if(cardList[i].toLowerCase().includes(userSearch)){
      querySearch.push(i+3)/* Cards IDs begin at number 3*/
    }
  }
  document.getElementById("dbCategory").innerHTML = "";
  if(querySearch.length > 0){
    querySearch.forEach(element => {
      const createadiv = document.createElement("div")
      createadiv.style.cursor = 'pointer';
      createadiv.classList.add("singlecardwrapper");
      createadiv.dataset.cardid = element;
      createadiv.addEventListener('click', function(event){
        dbCardDetails(event.currentTarget.dataset.cardid);
      }, true);

      document.getElementById("dbCategory").appendChild(createadiv)
      const lastCatChild = document.getElementById("dbCategory").lastElementChild;
      showNewCard(element, lastCatChild)

    });
  }
  else{
    const somediv = document.createElement("div");
    somediv.classList.add("pangolinfont");
    somediv.classList.add("textalign");
    somediv.classList.add("font5vh");
    somediv.classList.add("navbarcolor");
    somediv.innerHTML ="No cards matching query.";
    document.getElementById("dbCategory").appendChild(somediv);

  }

}

/* Shows cardlist by category*/
async function dbShowCategory(category){
  document.getElementById("dbCategory").innerHTML = "";
  switch (category) {
    case "all":
      for(let i=3; i<83; i++){
        const createadiv = document.createElement("div")
        createadiv.style.cursor = 'pointer';
        createadiv.classList.add("singlecardwrapper");
        createadiv.dataset.cardid = i;
        createadiv.addEventListener('click', function(event){
          dbCardDetails(event.currentTarget.dataset.cardid);
        }, true);

        document.getElementById("dbCategory").appendChild(createadiv)
        const lastCatChild = document.getElementById("dbCategory").lastElementChild;
        showNewCard(i, lastCatChild)

      }
      break;

    case "ca":
      for(let i=3; i<18; i++){
        const createadiv = document.createElement("div")
        createadiv.style.cursor = 'pointer';
        createadiv.classList.add("singlecardwrapper");
        createadiv.dataset.cardid = i;
        createadiv.addEventListener('click', function(event){
          dbCardDetails(event.currentTarget.dataset.cardid);
        }, true);

        document.getElementById("dbCategory").appendChild(createadiv)
        const lastCatChild = document.getElementById("dbCategory").lastElementChild;
        showNewCard(i, lastCatChild)
      }
      break;

    case "he":
      for(let i=18; i<33; i++){
        const createadiv = document.createElement("div")
        createadiv.style.cursor = 'pointer';
        createadiv.classList.add("singlecardwrapper");
        createadiv.dataset.cardid = i;
        createadiv.addEventListener('click', function(event){
          dbCardDetails(event.currentTarget.dataset.cardid);
        }, true);

        document.getElementById("dbCategory").appendChild(createadiv)
        const lastCatChild = document.getElementById("dbCategory").lastElementChild;
        showNewCard(i, lastCatChild)

      }
      break;

    case "aq":
      for(let i=33; i<48; i++){
        const createadiv = document.createElement("div")
        createadiv.style.cursor = 'pointer';
        createadiv.classList.add("singlecardwrapper");
        createadiv.dataset.cardid = i;
        createadiv.addEventListener('click', function(event){
          dbCardDetails(event.currentTarget.dataset.cardid);
        }, true);

        document.getElementById("dbCategory").appendChild(createadiv)
        const lastCatChild = document.getElementById("dbCategory").lastElementChild;
        showNewCard(i, lastCatChild)

      }
      break;

    case "fl":
      for(let i=48; i<63; i++){
        const createadiv = document.createElement("div")
        createadiv.style.cursor = 'pointer';
        createadiv.classList.add("singlecardwrapper");
        createadiv.dataset.cardid = i;
        createadiv.addEventListener('click', function(event){
          dbCardDetails(event.currentTarget.dataset.cardid);
        }, true);

        document.getElementById("dbCategory").appendChild(createadiv)
        const lastCatChild = document.getElementById("dbCategory").lastElementChild;
        showNewCard(i, lastCatChild)

      }
      break;

    case "ev":
      for(let i=63; i<83; i++){
        const createadiv = document.createElement("div")
        createadiv.style.cursor = 'pointer';
        createadiv.classList.add("singlecardwrapper");
        createadiv.dataset.cardid = i;
        createadiv.addEventListener('click', function(event){
          dbCardDetails(event.currentTarget.dataset.cardid);
        }, true);

        document.getElementById("dbCategory").appendChild(createadiv)
        const lastCatChild = document.getElementById("dbCategory").lastElementChild;
        showNewCard(i, lastCatChild)
      }
      break;

  
    default:
      break;
  }

}


/* Opens card detailed info*/
async function dbCardDetails(cardid){
  let response = await fetch(`/api/get_card/${cardid}`);
  let cardinfo = await response.json();

  const createadiv = document.createElement("div")
  createadiv.classList.add("singlecardwrapper");
  document.getElementById("cdCardDisplay").appendChild(createadiv);
  const nodedisplay = document.getElementById("cdCardDisplay").lastElementChild;
  showNewCard(cardid, nodedisplay);

  
  var old_element = document.getElementById("showMeImg");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  document.getElementById("showMeImg").addEventListener('click', function(){showDinoImg(cardinfo.name)})

  var old_element = document.getElementById("playMeSound");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  document.getElementById("playMeSound").addEventListener('click', function(){playDinoSound(cardinfo.name)})

  document.getElementById("cdCardName").innerHTML = cardinfo.name;
  switch (cardinfo.card_type) {
    case "ca":
      document.getElementById("cdCategory").innerHTML="Carnivorous"
      document.getElementById("cdCategory").style.color = 'crimson'
      
      break;
  
    case "he":
      document.getElementById("cdCategory").innerHTML="Herbivorous"
      document.getElementById("cdCategory").style.color = 'green'
      break;

    case "aq":
      document.getElementById("cdCategory").innerHTML="Aquatic"
      document.getElementById("cdCategory").style.color = 'blue'
      break;

    case "fl":
      document.getElementById("cdCategory").innerHTML="Flying"
      document.getElementById("cdCategory").style.color = 'lightblue'
      break;

    case "ev":
      document.getElementById("cdCategory").innerHTML="Event"
      document.getElementById("cdCategory").style.color = 'purple'
      break;

    default:
      break;
  }

  switch (cardinfo.size) {
    case "sm":
      document.getElementById("cdSize").innerHTML="Small"
      break;
  
    case "me":
      if(cardinfo.card_type != "ev"){
        document.getElementById("cdSize").innerHTML="Medium"
      }
      else{
        document.getElementById("cdSize").innerHTML="-"
      }
      
      break;

    case "la":
      
      document.getElementById("cdSize").innerHTML="Large"
      break;

    default:
      break;
  }

  switch (cardinfo.rarity) {
    case "co":
      document.getElementById("cdRarity").innerHTML="Common"
      document.getElementById("cdRarity").style.color = 'gray'
      break;

    case "sc":
      document.getElementById("cdRarity").innerHTML="Scarce"
      document.getElementById("cdRarity").style.color = 'blue'
      break;

    case "ex":
      document.getElementById("cdRarity").innerHTML="Exceptional"
      document.getElementById("cdRarity").style.color = 'gold'
      break;
  
    default:
      break;
  }

  if(cardinfo.card_type != "ev"){
    switch (cardinfo.condition_text) {
      case "":
        document.getElementById("cdAbility").innerHTML="None";
        document.getElementById("cdEffect").innerHTML="-";
        break;
      case "Agile.":
        document.getElementById("cdAbility").innerHTML="Agile";
        document.getElementById("cdEffect").innerHTML="This card can attack on its first turn.";
        break;
  
      case "Fierce.":
        document.getElementById("cdAbility").innerHTML="Fierce";
        document.getElementById("cdEffect").innerHTML="This card deals +1 DMG to Medium and Large Dinosaurs.";
        break;
  
      case "Poisonous.":
        document.getElementById("cdAbility").innerHTML="Poisonous";
        document.getElementById("cdEffect").innerHTML="Any dinosaur attacking this card receives 1 DMG.";
        break;
      
      case "Scaled.":
        document.getElementById("cdAbility").innerHTML="Scaled";
        document.getElementById("cdEffect").innerHTML="This card receives -1 DMG from other dinosaurs.";
        break;
  
      case "Predator.":
        document.getElementById("cdAbility").innerHTML="Predator";
        document.getElementById("cdEffect").innerHTML="Destroys two eggs instead of one when attacking.";
        break;
    
      default:
        break;
    }

  }
  else {
    document.getElementById("cdAbility").innerHTML="-";
    document.getElementById("cdEffect").innerHTML="-";

  }
  

  var tl = gsap.timeline()
  tl.set("#dbCardDetails", {visibility: 'visible'})
  tl.from("#dbCardDetails", {scaleX: 0, scaleY: 0, duration: 0.5})


}

function showDinoImg(dinoName){
  document.getElementById("cdShowDino").src=`/static/frontend/images/cards/${dinoName}.png`;
  var tl = gsap.timeline();
  tl.set("#cdGetImage", {visibility: 'visible'})
  tl.from("#cdGetImage", {scaleX: 0, scaleY: 0, duration: 0.5})
}

function playDinoSound(dinoName){
  const dinocry = new Audio(`/static/frontend/sounds/cards/${dinoName}.wav`);
  dinocry.loop = false;
  dinocry.volume = 0.5;
  dinocry.play();
}

/*------- My collection page----------*/

async function collectionPage(){
  getCompleted();
  getPlayerCollection()
}

/* Gets number of collected cards by player*/
async function getCompleted(){
  let response = await fetch(`/api/collection_total`);
  let completed = await response.json();

  document.getElementById("individualCollected").innerHTML = completed.Completion;
  document.getElementById("percentageTitle").innerHTML = `${((completed.Completion/80)*100).toFixed(1)}%`;
  document.getElementById("collProgressBar").innerHTML = `${((completed.Completion/80)*100).toFixed(1)}%`;
  document.getElementById("collProgressBar").style.width = `${((completed.Completion/80)*100).toFixed(1)}%`;
}

async function getPlayerCollection(){
  let response = await fetch(`/api/collection_total`);
  let collection = await response.json();

  const cardlist = collection.CardId;
  const quantity = collection.Quantity;
  
  for(let i =0; i<cardlist.length; i++){
    let wrapperdiv = document.createElement("div");
    wrapperdiv.classList.add("collectionWrapper");
    document.getElementById("collDisplay").appendChild(wrapperdiv);

    let createadiv = document.createElement("div")
    createadiv.classList.add("singlecardwrapper");
    createadiv.style.margin = "0px";
    wrapperdiv.appendChild(createadiv);
    let nodedisplay = wrapperdiv.lastElementChild;
    showNewCard(cardlist[i], nodedisplay);

    let qntDiv = document.createElement("div");
    qntDiv.classList.add("navbarcolor");
    qntDiv.classList.add("textalign");
    qntDiv.classList.add("pangolinfont");
    qntDiv.classList.add("font5vh");
    qntDiv.innerHTML = `x${quantity[i]}`

    wrapperdiv.appendChild(qntDiv);

    
  }
}

/* ----Leaderboards Page----*/
let victories_player = []
let victories_quantity = []
let xp_player = []
let xp_quantity = []
let leaderboard_collection = {}


function leaderboardsPage(){
  getLeaderboardsData();
  document.getElementById("lbSelect").addEventListener('change', function(){leaderboardsCategory(this.value)}, false)
  setTimeout(function(){ leaderboardsCategory("v") }, 500);

}

async function getLeaderboardsData(){
  let response = await fetch(`/api/leaderboard`);
  let data = await response.json();

  victories_player = data.victories_ply;
  victories_quantity = data.victories;
  xp_player = data.xp_ply;
  xp_quantity = data.xp;
  leaderboard_collection = data.PlayersCollection;

}

function leaderboardsCategory(lbCategory){
  const leaderboard_div = document.getElementById("showLeaderboards")
  leaderboard_div.innerHTML = ""

  let tablediv = document.createElement("table");
  tablediv.classList.add("table");
  tablediv.classList.add("table-hover");
  tablediv.classList.add("table-dark");
  tablediv.classList.add("table-striped");
  tablediv.classList.add("align-middle");
  leaderboard_div.appendChild(tablediv); 

  let thead = document.createElement("thead");
  tablediv.appendChild(thead);
  let tr = document.createElement("tr");
  thead.appendChild(tr);

  let usershow = document.createElement("th");
  usershow.scope="col";
  usershow.innerHTML = "#Rank"
  tr.appendChild(usershow);

  let Quantity = document.createElement("th");
  Quantity.scope="col";
  Quantity.innerHTML="Player";
  tr.appendChild(Quantity);

  let tbody = document.createElement("tbody");
  tablediv.appendChild(tbody);


  switch (lbCategory) {
    case "v":
      let l_victories = document.createElement("th");
      l_victories.scope="col";
      l_victories.innerHTML="Victories";
      tr.appendChild(l_victories);

      for(let i=0; i<victories_player.length; i++){
        let trow = document.createElement("tr");
        tbody.appendChild(trow);

        ReactDOM.render(<RenderLeaderboard
          Rank={i+1}
          Player={victories_player[i]}
          showQuantity={victories_quantity[i]}
          />, trow)

      }
      break;

    case "x":
      let x_victories = document.createElement("th");
      x_victories.scope="col";
      x_victories.innerHTML="Experience";
      tr.appendChild(x_victories);
      for(let i=0; i<xp_player.length; i++){
        let trow = document.createElement("tr");
        tbody.appendChild(trow);

        ReactDOM.render(<RenderLeaderboard
          Rank={i+1}
          Player={xp_player[i]}
          showQuantity={xp_quantity[i]}
          />, trow)

      }

      break;

    case "c":
      let c_collected = document.createElement("th");
      c_collected.scope="col";
      c_collected.innerHTML="Cards collected";
      tr.appendChild(c_collected);
      let i = 1;
      for (var key in leaderboard_collection){
        let trow = document.createElement("tr");
        tbody.appendChild(trow);
        ReactDOM.render(<RenderLeaderboard
          Rank={i}
          Player={key}
          showQuantity={leaderboard_collection[key]}
          />, trow)
        i++;

      }

      break;
  
    default:
      break;
  }
  

}

class RenderLeaderboard extends React.Component{
  constructor(props){
    super(props);
   
  }

  render(){
    return(
      <React.Fragment>
          <td>{this.props.Rank}</td>
          <td><a href={'profile/'+ this.props.Player}>{this.props.Player}</a></td>
          <td>{this.props.showQuantity}</td>
      </React.Fragment>
    )
  }

}

/* Small delay to transition*/

function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
      setTimeout(() => {
          done();
      }, n);
  });
}
  
barba.init({
  sync: true,
  prevent: data => data.el.classList.contains('stopBarba'),
  preventRunning: true,

  transitions: [
      {
          name: 'index',
          to: {namespace: ['index']},
          async leave(data) {
            const done = this.async();
            pageOut();
            await delay(1500);
            done();
          },

          async enter(data) {
            pageIn();
            carousel();
          },
  
      },

      {
        name: 'shop',
        to: {namespace: ['shop']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
          shopPage();
        },

      },

      {
        name: 'login',
        to: {namespace: ['login']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
        },

      },

      {
        name: 'trader',
        to: {namespace: ['trader']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
          tradePage();
        },

      },

      {
        name: 'deckmanager',
        to: {namespace: ['deckmanager']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
          deckmanagerPage()
          
        },

      },

      {
        name: 'database',
        to: {namespace: ['database']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
          databasePage();
          
          
          
        },

      },
      
      {
        name: 'collection',
        to: {namespace: ['collection']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
          collectionPage();
         
        },

      },

      {
        name: 'leaderboards',
        to: {namespace: ['leaderboards']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
          leaderboardsPage();
         
        },

      },

      {
        name: 'profile',
        to: {namespace: ['profile']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
          
        },

      },

      {
        name: 'register',
        to: {namespace: ['register']},
        async leave(data) {
          const done = this.async();
          pageOut();
          await delay(1500);
          done();
        },

        async enter(data) {
          pageIn();
          
        },

      },

  ],
});