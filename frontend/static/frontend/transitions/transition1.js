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

function pageOut(){

  gsap.to(".transition1 div", {
    opacity: 1,
    duration: 1,
    yPercent:-50,
    top:"50%",
    
    
  });

  
  gsap.to(".transition2 div", {
    opacity: 1,
    duration: 1,
    yPercent:-50,
    top:"50%",
    
    
  });

}

function pageIn(){

  gsap.to(".transition1 div", {
    opacity: 0,
    duration: 1,
    yPercent:-150,
    top:"50%",
    
    
  });
  
  gsap.to(".transition2 div", {
    duration: 1,
    opacity: 0,
    yPercent:50,
    top:"50%",
    

    
  });

  
  
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

  transitions: [
      {
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


