import './style.css'
import { setup } from './app.js'

document.querySelector('#app').innerHTML = `
  <div class="main-container">
    <div class="main main-top">
      <input type="checkbox" id="input-keyInput">Keyboard Controls Enabled</input>
      <input id="input-timeOffset" placeholder="-1">Time offset</input>
    </div>
    <div class="main-body">
      <div class="main main-left">
        <div id="video-input">
          <div>Video ID: </div>
          <input id="video-url"></input>
          <button id="video-url-button">Update video</button>
        </div>
        <div class="video-container">
          <div id="video-loader"></div>
        </div>
        <div id="main-contact">
          <div class="contact">
            <div class="column-time">Time</div>
            <div class="column-type">Contact Type</div>
            <div class="column-pos">Position</div>
            <div class="column-player">Player</div>
          </div>
        </div>
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
  </div>
`

setup()
