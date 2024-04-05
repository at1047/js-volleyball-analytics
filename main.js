import './style.css'
import { setup } from './court.js'

document.querySelector('#app').innerHTML = `
  <div class="main-container">
    <div class="main main-left">
    </div>
    <div class="main main-right court" id="court">
      <canvas id="canvas-court"></canvas>
      <div>
        <div class="button-court button-hide" data-value="1">1</div>
        <div class="button-court button-hide" data-value="2">2</div>
        <div class="button-court button-hide" data-value="3">3</div>
        <div class="button-court button-hide" data-value="4">4</div>
      </div>
    </div>
  </div>
`

setup()
