
function pageIn() {
    var tl = gsap.timeline();

    tl.to(".plytransition div", {
        duration: 1.5,
        scaleY: 0,
        transformOrigin: "top left",
        ease: "bounce.out"
        
    });
}

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