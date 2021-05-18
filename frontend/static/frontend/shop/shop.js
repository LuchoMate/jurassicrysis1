document.addEventListener('DOMContentLoaded', function() {
    console.log("dom content loaded")

    const packs = document.querySelectorAll("boosterdis");
    packs.forEach(pack => {
        pack.addEventListener('click', event => {
            console.log("clicked!")
        })
    })

    function handlePack(pack){
        document.getElementById("boosterToBuy").innerHTML = pack;
        var tl = gsap.timeline();
        tl.set("#buyAPack", {display: 'block'})
        tl.from("#buyAPack", {opacity: 0,scaleY: 0, scaleX: 0, duration: 1})
    }

})
