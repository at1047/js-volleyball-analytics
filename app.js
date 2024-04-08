import { Contact } from './contact.js'

export function setup() {
  const court = document.querySelector('#court')
  let rect = court.getBoundingClientRect();

  const padding = 50

  const courtHeight = rect.height - padding * 2
  const courtWidth = rect.width - padding * 2

  const hOneM = courtHeight / 18
  const wOneM = courtWidth / 18

  console.log(rect)

  var contactList = []

  // court.addEventListener('click', (e) => {
  //   let x = e.clientX - rect.left;
  //   let y = e.clientY - rect.top;
  //   const pos = getPosOnCourt(x, y, padding)
  //   console.log("clientX: " + pos[0] +
  //   " - clientY: " + pos[1])
  //   console.log(e)
  // })

  let mouseDownPos
  court.addEventListener('mousedown', (e) => {
    addCircleMenu(court, e.clientY, e.screenX)
    mouseDownPos = [Math.round((e.screenX - rect.left - padding)/wOneM*10)/10
      ,Math.round((e.clientY - rect.top - padding)/hOneM*10)/10]
  })

  court.addEventListener('mouseup', (e) => {
    const val = removeCircleMenu(e)
    if (val != null) {
      addNewContact(contactList, val, mouseDownPos)

    }

  })

  let mouseKeyPos
  document.addEventListener('mousemove', (e) => {
    mouseKeyPos = [e.screenX, e.clientY]
  }, false);

  document.addEventListener("keydown", (e) => {
    console.log(e)
    if (mouseKeyPos[0] > rect.left && mouseKeyPos[0] < rect.right
      && mouseKeyPos[1] > rect.top && mouseKeyPos[1] < rect.bottom) {
      var mouseKeyPosM = [Math.round((mouseKeyPos[0] - rect.left - padding)/wOneM*10)/10
        ,Math.round((mouseKeyPos[1] - rect.top - padding)/hOneM*10)/10]
      handleKeyPress(contactList, e.key, mouseKeyPosM)
      // console.log(player.getCurrentTime())
    }
  });

  const canvas = document.getElementById("canvas-court");
  setupCourt(canvas, rect.width, rect.height, padding)
  // renderContact()

  // document.addEventListener("DOMContentLoaded", () => {
  //   const videoPlayer = document.getElementById("player");
  //   const videoUrl = "https://www.youtube.com/embed/QkWOaqGn9Vg?si=uIrc2hE9vr_OSpJz"+"?enablejsapi=1"
  //   videoPlayer.src = videoUrl
  // })

}

var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
window.onYouTubeIframeAPIReady = function () {
   console.log("API is ready.")
   player = new YT.Player('video-loader'/*Specific your div ID here for display the video.*/, {
     videoId: 'cqMKaYtvMd4', // Specific your video ID http://www.youtube.com/embed/videoIDHere
     width: '560', // Specific width
     height: '315',  // Specific height
     // playerVars: {
     //  end: 0, autoplay: 1, loop: 0, controls: 0, showinfo: 0, modestbranding: 1, fs: 0, cc_load_policty: 0, iv_load_policy: 3, autohide: 0
     // },
     events: {
      'onReady': onPlayerReady()
     }
    });
   }

window.onPlayerReady = function () {
  console.log("My player is onReady");
  console.log(player)
}



// var player;
// window.onYouTubeIframeAPIReady = function() {
//   console.log("player ready")
//     player = new YT.Player('player', {
//             playerVars: {'wmode': 'opaque', 'autohide': 1 , 'enablejsapi': 1 , 'origin': 'http://www.yousite.com', 'rel': 0},
//         events: {
//           'onReady': onPlayerReady,
//           'onStateChange': onPlayerStateChange
//         }
//     });
//   }
//
// function onPlayerReady(event) {
//   console.log("debug")
//   document.getElementById('player').style.borderColor = '#FF6D00';
// }
//
//   function changeBorderColor(playerStatus) {
//     var color;
//     if (playerStatus == -1) {
//       color = "#37474F"; // unstarted = gray
//     } else if (playerStatus == 0) {
//       color = "#FFFF00"; // ended = yellow
//     } else if (playerStatus == 1) {
//       color = "#33691E"; // playing = green
//     } else if (playerStatus == 2) {
//       color = "#DD2C00"; // paused = red
//     } else if (playerStatus == 3) {
//       color = "#AA00FF"; // buffering = purple
//     } else if (playerStatus == 5) {
//       color = "#FF6DOO"; // video cued = orange
//     }
//     if (color) {
//       document.getElementById('player').style.borderColor = color;
//     }
//   }
//   function onPlayerStateChange(event) {
//     changeBorderColor(event.data);
//   }

function addNewContact(contactList, type, pos) {
    const contact = new Contact(type, pos)
    contactList = [...contactList, contact]
    const contactDiv = contact.createDiv()
    const mainContact = document.getElementById("main-contact");
    mainContact.appendChild(contactDiv)
    return contactList
}

function handleKeyPress(contactList, key, pos) {
  switch (key) {
    case "q":
      addNewContact(contactList, "Pass", pos)
      break;
    case "w":
      addNewContact(contactList, "Set", pos)
      break;
    case "e":
      addNewContact(contactList, "Hit", pos)
      break;
    case "r":
      addNewContact(contactList, "Shank", pos)
      break;
  }
}

// function renderContact() {
//   console.log("Rendering contact")
//   const contact = new Contact()
//   const contactDiv = contact.createDiv()
//   console.log(contactDiv)
//   const mainContact = document.getElementById("main-contact");
//   mainContact.appendChild(contactDiv)
// }

function addCircleMenu(court, top, left) {
  let items = document.querySelectorAll('.button-court');
  const menuCount = items.length
  const theta = 2*Math.PI/menuCount
  const offset = 30

  for(var i = 0, l = items.length; i < l; i++) {
    items[i].classList.remove("button-hide")
    let phi = theta * i
    // console.log(phi)
    let calcTop = top - Math.cos(phi)*offset - items[i].offsetHeight/2
    let calcLeft = left + Math.sin(phi)*offset - items[i].offsetWidth/2

    items[i].style.top = calcTop + "px"
    items[i].style.left = calcLeft + "px"
  }
}

function removeCircleMenu(e) {
  // document.getElementById("circle-menu").remove();
  const hovered = document.elementFromPoint(e.clientX, e.clientY)
  var value

  if (hovered.classList.contains("button-court")) {
    console.log(hovered.dataset.value)
    value = hovered.dataset.value
    // document.getElementById("debug").innerHTML = value;
  }

  let items = document.querySelectorAll('.button-court');
  for(var i = 0, l = items.length; i < l; i++) {
    // items[i].style.display = "None"
    items[i].classList.add("button-hide")
  }

  return value

}

function setupCourt(canvas, width, height, padding) {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const rect = canvas.getBoundingClientRect();


  const ctx = canvas.getContext("2d");


  const courtHeight = height - padding * 2
  const courtWidth = width - padding * 2

  const sixM = courtHeight / 3
  const nineM = courtHeight / 2
  // const hOneM = courtHeight / 18
  // const wOneM = courtWidth / 18

  // ctx.fillRect(padding, padding, wOneM, hOneM)

  const threeMLineTop = padding + sixM
  const middleLine = padding + nineM
  const threeMLineBottom = padding + 2 * sixM

  let topRight = [width-padding, padding]
  let bottomRight = [width-padding, height-padding]
  let bottomLeft = [padding, height-padding]
  let topLeft = [padding, padding]

  drawLine(ctx, topRight[0], topRight[1], bottomRight[0], bottomRight[1])
  drawLine(ctx, bottomRight[0], bottomRight[1], bottomLeft[0], bottomLeft[1])
  drawLine(ctx, bottomLeft[0], bottomLeft[1], topLeft[0], topLeft[1])
  drawLine(ctx, topLeft[0], topLeft[1], topRight[0], topRight[1])

  drawLine(ctx, padding, threeMLineTop, width-padding, threeMLineTop)
  drawLine(ctx, padding, threeMLineBottom, width-padding, threeMLineBottom)
  drawLine(ctx, padding, middleLine, width-padding, middleLine)

  // var positions = [{x: 2, y: 1.5}, {x: 4.5, y: 1.5}, {x: 7, y: 1.5}]

  // let players = document.querySelectorAll('.player-court');
  // for(var i = 0; i < 3; i++) { // TODO only frontrow players for now
  //   // console.log(phi)
  //   const posX = positions[i].x
  //   const posY = positions[i].y
  //   console.log('x:' + posX + ', y:' + posY)
  //   let calcTop = hOneM*posY + players[i].offsetHeight/2 + rect.top
  //   let calcLeft = wOneM*posX + players[i].offsetWidth/2 + rect.left

  //   players[i].style.top = calcTop + "px"
  //   players[i].style.left = calcLeft + "px"
  // }


}

// function setupPlayers(container, players) {
//
//   var div = document.createElement("div");
//   div.style.width = "100px";
//   div.style.height = "100px";
//   div.style.background = "red";
//   div.style.color = "white";
//   div.innerHTML = "Hello";
//   container.appendChild(div)
// }

function drawLine(ctx, x, y, newX, newY) {
  ctx.beginPath();
  ctx.strokeStyle = '#FFFFFF'
  ctx.moveTo(x, y);
  ctx.lineTo(newX, newY);
  ctx.stroke();
}

function getPosOnCourt(x, y, padding) {
  return [x - padding, y - padding]
}

// function getPosOnCourtFromM(x, y, courtHeight, courtWidth) {
//   return [x*courtWidth/9, y*courtHeight/9]
// }
