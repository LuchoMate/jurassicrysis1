
function pageIn() {
    var tl = gsap.timeline();

    tl.to(".plytransition div", {
        duration: 1.5,
        scaleY: 0,
        transformOrigin: "top left",
        ease: "bounce.out"
    });
    tl.from("#difficultybox", {
        duration: 1,
        y: 300,
        opacity: 0
    })
}

function difficultybg() {
    var tl = gsap.timeline({repeat:-1});
    tl.to(".difficultypage", {
        duration: 30,
        backgroundPosition: "-2247px 0px",
        ease: Linear.easeNone
    });
}

function difficultyOut() {
    var tl = gsap.timeline();
    tl.to("#difficultybox", {
        duration: 1,
        y: 300,
        opacity: 0,
        scaleY: 0

    }).set("#difficultybox", {display: 'none'});
    return tl;
}



difficultybg();
pageIn();



function pageOut() {
    var tl = gsap.timeline();    

    tl.to(".plytransition div", {
        duration: 1.5,
        scaleY: 1,
        transformOrigin: "bottom left",
        ease: "bounce.out"
        
    });

}

function redirectHome(){
    pageOut();
    setTimeout(function(){ window.location.href = "/jurassicrysis/home";}, 2000);
}