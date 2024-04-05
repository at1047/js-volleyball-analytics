export function setup() {
  court = document.querySelector('#court')
  let rect = court.getBoundingClientRect();

  console.log(rect)

  const padding = 50

  court.addEventListener('click', (e) => {
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const pos = getPosOnCourt(x, y, padding)
    console.log("clientX: " + pos[0] +
    " - clientY: " + pos[1])

    console.log(e)


  })


  court.addEventListener('mousedown', (e) => {
    addCircleMenu(court, e.clientY, e.screenX)
  })

  court.addEventListener('mouseup', (e) => {
    const val = removeCircleMenu(e)
  })


  setupCourt(rect.width, rect.height, padding)

}

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
  }

  let items = document.querySelectorAll('.button-court');
  for(var i = 0, l = items.length; i < l; i++) {
    // items[i].style.display = "None"
    items[i].classList.add("button-hide")
  }

  return value

}

function setupCourt(width, height, padding) {
  const canvas = document.getElementById("canvas-court");
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;


  const ctx = canvas.getContext("2d");


  const courtHeight = height - padding * 2
  const courtWidth = width - padding * 2

  const sixM = courtHeight / 3
  const nineM = courtHeight / 2
  const hOneM = courtHeight / 9
  const wOneM = courtWidth / 9

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
