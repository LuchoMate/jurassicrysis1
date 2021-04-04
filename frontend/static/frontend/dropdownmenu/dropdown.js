/* These functions handle dropdown buttons on the layout*/

function myFunction() {
    var x = document.getElementById("responsiveButton");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
  }

  function cardFunction() {
    var x = document.getElementById("cardDrop");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
      }
    }

    function socialFunction() {
    var x = document.getElementById("socialDrop");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
      }
    }
    
    window.onclick = function(e) {
      if (!e.target.matches('li')) {
      var myDropdown = document.getElementById("cardDrop");
        if (myDropdown.classList.contains('w3-show')) {
          myDropdown.classList.remove('w3-show');

        }
      var myDropdown2 = document.getElementById("socialDrop");
        if (myDropdown2.classList.contains('w3-show')) {
          myDropdown2.classList.remove('w3-show');

        }

      }
    }

    function closedropdown() {

      var myDropdown = document.getElementById("cardDrop");
        if (myDropdown.classList.contains('w3-show')) {
          myDropdown.classList.remove('w3-show');

        }
      var myDropdown2 = document.getElementById("socialDrop");
        if (myDropdown2.classList.contains('w3-show')) {
          myDropdown2.classList.remove('w3-show');

        }

    }