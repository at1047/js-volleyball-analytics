import { Contact } from './contact.js'
import { Video } from './video.js'

export function setup() {
  const video = new Video(560, 315)

  const court = document.querySelector('#court')
  const videoUrlButton = document.querySelector('#video-url-button')
  const videoUrl= document.querySelector('#video-url')
  let rect = court.getBoundingClientRect();

  const inputKeyInput = document.getElementById("input-keyInput");
  const inputTimeOffset = document.getElementById("input-timeOffset");

  const padding = 50

  const courtHeight = rect.height - padding * 2
  const courtWidth = rect.width - padding * 2

  const hOneM = courtHeight / 18
  const wOneM = courtWidth / 18

  var contactList = []

  inputKeyInput.addEventListener ("click", function() {
  document.activeElement.blur();
  });

  let mouseDownPos
  court.addEventListener('mousedown', (e) => {
    addCircleMenu(court, e.clientY, e.screenX)
    mouseDownPos = [Math.round((e.screenX - rect.left - padding)/wOneM*10)/10
      ,Math.round((e.clientY - rect.top - padding)/hOneM*10)/10]
  })

  court.addEventListener('mouseup', (e) => {
    const val = removeCircleMenu(e)
    if (val != null) {

      addNewContact(contactList, val, mouseDownPos, video.getTimestamp())
    }
  })

  let mouseKeyPos
  document.addEventListener('mousemove', (e) => {
    mouseKeyPos = [e.screenX, e.clientY]
  }, false);

  document.addEventListener("keydown", (e) => {
    console.log(mouseKeyPos)
    var pointerInCourt = (mouseKeyPos[0] > rect.left && mouseKeyPos[0] < rect.right
      && mouseKeyPos[1] > rect.top && mouseKeyPos[1] < rect.bottom)
    var mouseKeyPosM = [Math.round((mouseKeyPos[0] - rect.left - padding)/wOneM*10)/10
      ,Math.round((mouseKeyPos[1] - rect.top - padding)/hOneM*10)/10]
    handleKeyPress(contactList, pointerInCourt, inputKeyInput, e.key, mouseKeyPosM, video.getTimestamp(), video)
  });


  videoUrlButton.addEventListener("click", (e) => {
    console.log(videoUrl.value)
    video.changeVideo(videoUrl.value)
  })

  const canvas = document.getElementById("canvas-court");
  setupCourt(canvas, rect.width, rect.height, padding)

  video.setup()

}

function addNewContact(contactList, type, pos, time) {
    const contact = new Contact(type, pos, time)
    contactList = [...contactList, contact]
    const contactDiv = contact.createDiv()
    const mainContact = document.getElementById("main-contact");
    mainContact.appendChild(contactDiv)
    return contactList
}

function handleKeyPress(contactList, pointerInCourt, inputKeyInput, key, pos, time, video) {
  console.log(key)
  if (inputKeyInput.checked && pointerInCourt) {
    switch (key) {
      case "q":
        addNewContact(contactList, "Pass", pos, time)
        break;
      case "w":
        addNewContact(contactList, "Set", pos, time)
        break;
      case "e":
        addNewContact(contactList, "Hit", pos, time)
        break;
      case "r":
        addNewContact(contactList, "Shank", pos, time)
        break;
    }
  }
  if (inputKeyInput.checked) {
    switch (key) {
      case "ArrowRight":
        video.seekVideo(5)
        break;
      case "ArrowLeft":
        video.seekVideo(-5)
        break;
      case " ":
        video.toggleVideo()
        break;
    }
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

