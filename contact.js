export class Contact {
  // constructor(type, location) {
  //   this.type = type
  //   this.location = location
  // }
  constructor(type, pos, time, player) {
    this.time = time
    this.type = type
    this.pos = pos
    this.player = player
  }

  createDiv() {
    var contactDiv = document.createElement("div")
    contactDiv.classList.add("contact")
    // contactDiv.style.width = "500px"
    // contactDiv.style.height = "20px"
    contactDiv.style.color = "white"
    contactDiv.dataset.value = this.time


    var timeDiv = document.createElement("div")

    const minutes = Math.floor(this.time / 60);
    const seconds = this.time - minutes * 60;
    // const milliseconds = 1000 * (seconds - Math.round(seconds))
    const ftime = this.prependZero(Math.round(minutes), 2) + ":" + this.prependZero(Math.round(seconds), 2)// + "." + this.prependZero(milliseconds, 3)

    timeDiv.innerHTML = ftime
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
    playerDiv.innerHTML = (parseInt(this.player) + 1)
    playerDiv.classList.add("column-player")
    // playerDiv.style.width = "50px"

    var removeButton = document.createElement("div")
    removeButton.classList.add("column-remove")
    removeButton.innerHTML = "X"
    // playerDiv.style.width = "50px"

    contactDiv.appendChild(timeDiv)
    contactDiv.appendChild(typeDiv)
    contactDiv.appendChild(posDiv)
    contactDiv.appendChild(playerDiv)
    contactDiv.appendChild(removeButton)
    return contactDiv
  }

  update(type, pos, player) {
    this.type = type
    this.pos = pos
    this.player = player
  }

  createRow() {
    return this.time + "," + this.type + "," + this.pos + "," + this.player + "\r\n"
  }

  prependZero(time, digits) {
    return ("00000" + time).slice(-digits)
  }
}
