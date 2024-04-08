import './style.css'
import { setup } from './app.js'

document.querySelector('#app').innerHTML = `
  <div class="main-container">
    <div class="main main-left">
      <div id="video-loader"></div>
      <div id="main-contact"></div>
    </div>
    <div class="main main-right court" id="court">
      <canvas id="canvas-court"></canvas>
      <div>
        <div class="button-court button-hide" data-value="Pass">Pass</div>
        <div class="button-court button-hide" data-value="Set">Set</div>
        <div class="button-court button-hide" data-value="Hit">Hit</div>
        <div class="button-court button-hide" data-value="Shank">Shank</div>
      </div>
    </div>
  </div>
`

setup()
