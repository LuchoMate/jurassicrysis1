/*
barba.init({
    prevent: data => data.el.classList.contains('stopBarba'),
    transitions: [{
      name: 'opacity-transition',
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0
        });
      }
    }]
  });
  */

  /* 

  function pageTransition() {
    var tl = gsap.timeline();

    tl.to(".transition2 div", {
        duration: 0.2,
        scaleY: 1,
        transformOrigin: "bottom left",
        stagger: 0.1,
    });

    tl.to(".transition2 div", {
        duration: 0.8,
        scaleY: 0,
        transformOrigin: "bottom left",
        stagger: 0.1,
        delay: 0.1,
    });
}

*/

function pageOut(){

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

/*
function contentAnimation() {
  var tl = gsap.timeline();
  tl.from("h1", {
      duration: 0.3,
      translateY: 50,
      opacity: 0,
  });
  tl.to(
      "img",
      {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      },
      "-=.1"
  );
}
*/

/* Home page carousel*/

function carousel() {
    var myIndex = 0;
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
    console.log("hello shopPage!");
    document.getElementById("cancelBuy").addEventListener('click', cancelBuy)
    let packs = document.getElementsByClassName("boosterpack");
    for(let i =0; i < packs.length; i++){
      packs[i].addEventListener('click', function (event){
        handlePack(event.target.id);
      })
    }
 
}

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

      var tl = gsap.timeline();
      tl.to("#buyAPack", {opacity: 0, scaleY: 0, scaleX: 0, duration: 0.2})
      tl.set("#buyAPack", {opacity: 1, scaleX: 1, scaleY: 1, display: 'none'})

      var old_element = document.getElementById("buyButton");
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);


      newCards.cardsAdded.forEach(element => {
        console.log(element)
        /* callshowNewCard*/
        showNewCard(element)
      });
      /* gsap timeline mostrar el div con cartas listas*/

      const button = new Audio('/static/frontend/sounds/winrps.mp3');
      button.loop = false;
      button.play();
      
      var tl = gsap.timeline();
      tl.set("showNewCards", {display: 'block'})
      tl.from("showNewCards", {opacity: 0, scaleY: 0, scaleX: 0, duration: 0.2})
      
    })
    .catch(error => {console.log("no enough Dinocoins!");
    notMoney();
  })
}

function notMoney(){
  var tl = gsap.timeline();
  tl.to("#buyAPack", {opacity: 0, scaleY: 0, scaleX: 0, duration: 0.2})
  tl.set("#buyAPack", {opacity: 1, scaleX: 1, scaleY: 1, display: 'none'})
  tl.set("#notMoney", {display: 'block'})
  tl.from("#notMoney", {opacity: 0, scaleY: 0, scaleX: 0, duration: 0.2})

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

async function showNewCard(newCard){
  let response = await fetch(`/api/get_card/${newCard}`);
  let card = await response.json();
  const childDiv = document.createElement("div")
  childDiv.classList.add("margin10")
  document.getElementById("showNewCards").appendChild(childDiv)
  const lastchild = document.getElementById("showNewCards").lastElementChild
  if(card.card_type != "ev"){
    ReactDOM.render(<SketchDinoCard name={card.name}
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
    ReactDOM.render(<SketchEventCard name={card.name}
        condition={card.condition_text}
        rarity={card.rarity}
        type={card.card_type}
        cost={card.cost}
        eventtext={card.event_effect}

    />, lastchild)

  }


}

function SketchDinoCard(props){
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

function SketchEventCard(props){
    
  const classhand = 'cardinHand';
  const interiorcard = `interiorcard${props.type}`;
  const costTag = 'costTag flexallcenter';
  const energyTag = 'energyTag flexallcenter';
  const nameTag = `namediv namediv${props.rarity} flexallcenter overhidden`;
  const dinopicTag = 'dinopicDiv noEvents';
  const imgTag = 'height100 width100';
  const conditionTagEv = 'conditionTagEv flexallcenter overhidden';
  
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

  views: [{
    /* 
    namespace: 'index',
    beforeEnter(){
      console.log("before enter index")
      carousel();
    },*/

    /* 
    namespace: 'shop',
    beforeEnter(){
      console.log("before enter shop")
      shopPage();
    },
    namespace: 'collection',
    beforeEnter(){
      console.log("before collection")
      
    },*/

    
  }],

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


  ],
});