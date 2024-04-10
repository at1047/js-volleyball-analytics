import { Contact } from './contact.js'
import { Video } from './video.js'

var contactList = []
var selectedRow = null

export function setup() {
  const video = new Video(560, 315)

  const court = document.querySelector('#court')
  const videoUrlButton = document.querySelector('#video-url-button')
  const videoUrl= document.querySelector('#video-url')
  const canvas = document.getElementById("canvas-court");
  let rect = court.getBoundingClientRect();
  const contactContainer = document.getElementById("contact-list");

  const inputKeyInput = document.getElementById("input-keyInput");
  // const inputTimeOffset = document.getElementById("input-timeOffset");
  const buttonSaveContacts = document.getElementById("button-saveContacts");
  const buttonClearContacts = document.getElementById("button-clearContacts");

  const padding = 50

  const courtHeight = rect.height - padding * 2
  const courtWidth = rect.width - padding * 2

  const hOneM = courtHeight / 18
  const wOneM = courtWidth / 9


  setupCourt(canvas, rect.width, rect.height, padding)

  inputKeyInput.addEventListener ("click", function() {
  document.activeElement.blur();
  });

  let playerSelected
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("player")) {
      e.target.classList.toggle("player-selected")
      playerSelected = e.target.dataset.value

      const players = document.querySelectorAll(".player");
      for(var i = 0; i < players.length; i++) { // TODO only frontrow players for now
        if (players[i] != e.target) {
          players[i].classList.remove("player-selected")
        }
      }
    }
  })

  buttonSaveContacts.addEventListener ("click", function() {
    var contactListStr = ""
    for (var i = 0; i < contactList.length; i++) {
      contactListStr = contactListStr + contactList[i].createRow()
    }
    console.log(contactListStr)
    console.log(JSON.stringify(contactList))
  });

  buttonClearContacts.addEventListener ("click", function() {
    contactList = []
    renderContacts(contactContainer)
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

      contactList = addNewContact(contactList, val, mouseDownPos, video.getTimestamp(), playerSelected)
      renderContacts(contactContainer)

      const players = document.querySelectorAll(".player");
      for(var i = 0; i < players.length; i++) { // TODO only frontrow players for now
        if (players[i] != e.target) {
          players[i].classList.remove("player-selected")
        }
      }
      playerSelected = null
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
    contactList = handleKeyPress(contactList, pointerInCourt, inputKeyInput, e.key, mouseKeyPosM, video.getTimestamp(), video, playerSelected)
    renderContacts(contactContainer)
  });



  videoUrlButton.addEventListener("click", (e) => {
    video.changeVideo(videoUrl.value)
  })

  video.setup()

}

function addNewContact(contactList, type, pos, time, playerSelected) {
  if (selectedRow == null) {
    const contact = new Contact(type, pos, time, playerSelected)
    return [...contactList, contact]
  } else {
    console.log(selectedRow)
    // selectedRow.update()
  }
}

function renderContacts(container) {
  container.innerHTML = ''
  for (var i = 0; i < contactList.length; i++) {
    const contact = contactList[i]
    const newDiv = contact.createDiv()
    newDiv.addEventListener('click', function(e) {
      // specify the action to take when the div is clicked
      if (e.target.classList.contains("column-remove")) {
        console.log(newDiv.dataset.value)
        contactList = contactList.filter((contact) => contact.time != newDiv.dataset.value)
        console.log(contactList)
        renderContacts(container, contactList)
      } else {
        newDiv.classList.toggle("contact-selected")
        selectedRow = contactList.find((contact) => contact.time == newDiv.dataset.value)
        console.log(selectedRow)
      }
    })
    container.appendChild(newDiv)
  }
  // const contact = new Contact()
  // const contactDiv = contact.createDiv()
  // console.log(contactDiv)
  // const mainContact = document.getElementById("main-contact");
}

function handleKeyPress(contactList, pointerInCourt, inputKeyInput, key, pos, time, video, playerSelected) {
  console.log(key)
  if (inputKeyInput.checked && pointerInCourt) {
    switch (key) {
      case "q":
        return addNewContact(contactList, "Pass", pos, time, playerSelected)
      case "w":
        return addNewContact(contactList, "Set", pos, time, playerSelected)
      case "e":
        return addNewContact(contactList, "Hit", pos, time, playerSelected)
      case "r":
        return addNewContact(contactList, "Ground", pos, time, playerSelected)
      case "t":
        return addNewContact(contactList, "Serve", pos, time, playerSelected)
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
  return contactList
}


function addCircleMenu(court, top, left) {
  let items = document.querySelectorAll('.button-court');
  const menuCount = items.length
  const theta = 2*Math.PI/menuCount
  const offset = 50

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
  const hovered = document.elementFromPoint(e.clientX, e.clientY)
  var value

  if (hovered.classList.contains("button-court")) {
    value = hovered.dataset.value
  }

  let items = document.querySelectorAll('.button-court');
  for(var i = 0, l = items.length; i < l; i++) {
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
  const hOneM = courtHeight / 18
  const wOneM = courtWidth / 9

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

  let rect = court.getBoundingClientRect();
  var positions = [
    {x: 2, y: 3}
    ,{x: 1.5, y: 7.5}
    ,{x: 4.5, y: 7.5}
    ,{x: 7.5, y: 7.5}
    ,{x: 7, y: 3}
    ,{x: 4.5, y: 1.5}
  ]

  const players = document.querySelectorAll(".player");
  for(var i = 0; i < positions.length; i++) { // TODO only frontrow players for now
    const posX = positions[i].x
    const posY = positions[i].y
    console.log('x:' + posX + ', y:' + posY)

    const player = players[i]

    let calcTop = hOneM*posY - player.offsetHeight/2 + rect.top + padding
    let calcLeft = wOneM*posX - player.offsetWidth/2 + rect.left + padding

    player.style.top = calcTop + "px"
    player.style.left = calcLeft + "px"
  }

  for(var i = 0; i < positions.length; i++) { // TODO only frontrow players for now
    const posX = positions[i].x
    const posY = positions[i].y
    console.log('x:' + posX + ', y:' + posY)

    const player = players[i+6]

    let calcTop = - hOneM*posY - player.offsetHeight/2 + rect.bottom - padding
    let calcLeft = - wOneM*posX - player.offsetWidth/2 + rect.right - padding

    player.style.top = calcTop + "px"
    player.style.left = calcLeft + "px"
  }
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

