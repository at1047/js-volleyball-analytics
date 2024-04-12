import { Contact } from './contact.js'
import { Video } from './video.js'

export class App {

  constructor() {
    this.contactList = []
    this.selectedRow = null
    this.video = new Video(560, 315)

    this.court = document.querySelector('#court')
    this.videoUrlButton = document.querySelector('#video-url-button')
    this.videoUrl= document.querySelector('#video-url')
    this.canvas = document.getElementById("canvas-court");


    // const inputTimeOffset = document.getElementById("input-timeOffset");
    this.inputKeyInput = document.getElementById("input-keyInput");
    this.buttonSaveContacts = document.getElementById("button-saveContacts");
    this.buttonClearContacts = document.getElementById("button-clearContacts");

    this.modalOutput= document.getElementById("modal-output");
    this.modalOutputJson = document.getElementById("modal-output-json");
    this.buttonModalOutputClose = document.getElementById("modal-output-closeButton");

    this.contactContainer = document.getElementById("contact-list");

  }

  setup() {

    let rect = this.court.getBoundingClientRect();

    const padding = 50

    const courtHeight = rect.height - padding * 2
    const courtWidth = rect.width - padding * 2

    const hOneM = courtHeight / 18
    const wOneM = courtWidth / 9


    this.setupCourt(this.canvas, rect.width, rect.height, padding)

    this.inputKeyInput.addEventListener ("click", function() {
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

    this.buttonSaveContacts.addEventListener ("click", function() {
      var contactListStr = ""
      for (var i = 0; i < this.contactList.length; i++) {
        contactListStr = contactListStr + this.contactList[i].createRow()
      }
      console.log(contactListStr)
      console.log(JSON.stringify(this.contactList))
      modalOutputJson.innerHTML = JSON.stringify(this.contactList)
      modalOutput.classList.remove("modal-hide")
    });

    this.buttonClearContacts.addEventListener ("click", function() {
      this.contactList = []
      this.renderContacts(contactContainer)
    });

    this.buttonModalOutputClose.addEventListener ("click", function() {
      modalOutput.classList.add("modal-hide")
    });

    let mouseDownPos
    this.court.addEventListener('mousedown', (e) => {
      this.addCircleMenu(e.clientY, e.screenX)
      mouseDownPos = [Math.round((e.screenX - rect.left - padding)/wOneM*10)/10
        ,Math.round((e.clientY - rect.top - padding)/hOneM*10)/10]
    })

    this.court.addEventListener('mouseup', (e) => {
      const val = this.removeCircleMenu(e)
      if (val != null) {

        this.contactList = this.addNewContact(this.contactList, val, mouseDownPos, this.video.getTimestamp(), playerSelected)
        this.renderContacts(this.contactContainer)

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
      var pointerInCourt = (mouseKeyPos[0] > rect.left && mouseKeyPos[0] < rect.right
        && mouseKeyPos[1] > rect.top && mouseKeyPos[1] < rect.bottom)
      var mouseKeyPosM = [Math.round((mouseKeyPos[0] - rect.left - padding)/wOneM*10)/10
        ,Math.round((mouseKeyPos[1] - rect.top - padding)/hOneM*10)/10]
      this.contactList = this.handleKeyPress(this.contactList, pointerInCourt,
        this.inputKeyInput, e.key, mouseKeyPosM, this.video.getTimestamp(), this.video, playerSelected)
      this.renderContacts(this.contactContainer)
    });

    document.addEventListener("click", function(e){
      const target = e.target.closest(".column-remove"); // Or any other selector.
      if (target != null) {
        this.contactList = this.contactList.filter((contact) => contact.time != target.parentElement.dataset.value)
        this.renderContacts(this.contactContainer)
      }
    }.bind(this))


    this.videoUrlButton.addEventListener("click", (e) => {
      video.changeVideo(videoUrl.value)
    })

    this.video.setup()

  }

  addNewContact(contactList, type, pos, time, playerSelected) {
    if (this.selectedRow == null) {
      const contact = new Contact(type, pos, time, playerSelected)
      return [...contactList, contact]
    } else {
      console.log(this.selectedRow)
      this.selectedRow.update(type, pos, playerSelected) // Modify object in place
      this.selectedRow = null
      return contactList
    }
  }

  renderContacts(container) {
    container.innerHTML = ''
    for (var i = 0; i < this.contactList.length; i++) {
      const contact = this.contactList[i]
      const newDiv = contact.createDiv()
      container.appendChild(newDiv)
    }
  }

  handleKeyPress(contactList, pointerInCourt, inputKeyInput, key, pos, time, video, playerSelected) {
    if (inputKeyInput.checked && pointerInCourt) {
      switch (key) {
        case "q":
          return this.addNewContact(contactList, "Pass", pos, time, playerSelected)
        case "w":
          return this.addNewContact(contactList, "Set", pos, time, playerSelected)
        case "e":
          return this.addNewContact(contactList, "Hit", pos, time, playerSelected)
        case "r":
          return this.addNewContact(contactList, "Ground", pos, time, playerSelected)
        case "t":
          return this.addNewContact(contactList, "Serve", pos, time, playerSelected)
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


  addCircleMenu(top, left) {
    let items = document.querySelectorAll('.button-court');
    const menuCount = items.length
    const theta = 2*Math.PI/menuCount
    const offset = 50

    for(var i = 0, l = items.length; i < l; i++) {
      items[i].classList.remove("button-hide")
      let phi = theta * i

      const verticalOffset= Math.sin(2*Math.abs(phi-Math.PI)) * (-6)

      // console.log(phi)
      let calcTop = top - Math.cos(phi)*offset - items[i].offsetHeight/2 + verticalOffset
      let calcLeft = left + Math.sin(phi)*offset - items[i].offsetWidth/2

      items[i].style.top = calcTop + "px"
      items[i].style.left = calcLeft + "px"
    }
  }

  removeCircleMenu(e) {
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

  setupCourt(canvas, width, height, padding) {
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

    this.drawLine(ctx, topRight[0], topRight[1], bottomRight[0], bottomRight[1])
    this.drawLine(ctx, bottomRight[0], bottomRight[1], bottomLeft[0], bottomLeft[1])
    this.drawLine(ctx, bottomLeft[0], bottomLeft[1], topLeft[0], topLeft[1])
    this.drawLine(ctx, topLeft[0], topLeft[1], topRight[0], topRight[1])

    this.drawLine(ctx, padding, threeMLineTop, width-padding, threeMLineTop)
    this.drawLine(ctx, padding, threeMLineBottom, width-padding, threeMLineBottom)
    this.drawLine(ctx, padding, middleLine, width-padding, middleLine)

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

      const player = players[i]

      let calcTop = hOneM*posY - player.offsetHeight/2 + rect.top + padding
      let calcLeft = wOneM*posX - player.offsetWidth/2 + rect.left + padding

      player.style.top = calcTop + "px"
      player.style.left = calcLeft + "px"
    }

    for(var i = 0; i < positions.length; i++) { // TODO only frontrow players for now
      const posX = positions[i].x
      const posY = positions[i].y

      const player = players[i+6]

      let calcTop = - hOneM*posY - player.offsetHeight/2 + rect.bottom - padding
      let calcLeft = - wOneM*posX - player.offsetWidth/2 + rect.right - padding

      player.style.top = calcTop + "px"
      player.style.left = calcLeft + "px"
    }
  }


  drawLine(ctx, x, y, newX, newY) {
    ctx.beginPath();
    ctx.strokeStyle = '#FFFFFF'
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.stroke();
  }

  getPosOnCourt(x, y, padding) {
    return [x - padding, y - padding]
  }


}
