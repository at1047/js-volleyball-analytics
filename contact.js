export class Contact {
  // constructor(type, location) {
  //   this.type = type
  //   this.location = location
  // }
  constructor(type, pos, time) {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    this.time = this.prependZero(Math.round(minutes)) + ":" + this.prependZero(Math.round(seconds))
    this.type = type
    this.pos = pos
    this.player = 1
  }

  createDiv() {
    var contactDiv = document.createElement("div")
    contactDiv.classList.add("contact")
    // contactDiv.style.width = "500px"
    // contactDiv.style.height = "20px"
    contactDiv.style.color = "white"


    var timeDiv = document.createElement("div")
    timeDiv.innerHTML = this.time
    timeDiv.classList.add("column-time")
    // timeDiv.style.width = "50px"
    var typeDiv = document.createElement("div")
    typeDiv.innerHTML = this.type
    typeDiv.classList.add("column-type")
    // typeDiv.style.width = "100px"
    var posDiv = document.createElement("div")
    posDiv.innerHTML = this.pos[0] + ", " + this.pos[1]
    posDiv.classList.add("column-pos")
    // posDiv.style.width = "200px"
    var playerDiv = document.createElement("div")
    playerDiv.innerHTML = this.player
    playerDiv.classList.add("column-player")
    // playerDiv.style.width = "50px"

    contactDiv.appendChild(timeDiv)
    contactDiv.appendChild(typeDiv)
    contactDiv.appendChild(posDiv)
    contactDiv.appendChild(playerDiv)
    return contactDiv
  }

  createRow() {
    return this.time + "," + this.type + "," + this.pos + "," + this.player + "\r\n"
  }

  prependZero(time) {
    return ("0" + time).slice(-2)
  }
}
