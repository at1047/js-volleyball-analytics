import './style.css'
import { setup } from './app.js'

document.querySelector('#app').innerHTML = `
  <div class="main-container">
    <div class="main main-top">
      <input type="checkbox" id="input-keyInput">Keyboard Controls Enabled</input>
      <input id="input-timeOffset" placeholder="-1">Time offset</input>
      <button id="button-saveContacts">Save Contacts</button>
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
        <div id="players">
          <div class="player player-top">1</div>
          <div class="player player-top">2</div>
          <div class="player player-top">3</div>
          <div class="player player-top">4</div>
          <div class="player player-top">5</div>
          <div class="player player-top">6</div>
          <div class="player player-bottom">1</div>
          <div class="player player-bottom">2</div>
          <div class="player player-bottom">3</div>
          <div class="player player-bottom">4</div>
          <div class="player player-bottom">5</div>
          <div class="player player-bottom">6</div>
        </div>
        <div>
          <div class="button-court button-hide" data-value="Pass">Pass</div>
          <div class="button-court button-hide" data-value="Set">Set</div>
          <div class="button-court button-hide" data-value="Hit">Hit</div>
          <div class="button-court button-hide" data-value="Ground">Ground</div>
          <div class="button-court button-hide" data-value="Serve">Serve</div>
        </div>
      </div>
    </div>
  </div>
`

setup()
