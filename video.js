export class Video {

  constructor(width, height) {
    this.width = width
    this.height = height
  }

  setup() {
    const width = this.width
    const height = this.height
    var tag = document.createElement('script');
    tag.id = 'iframe-demo';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    window.onYouTubeIframeAPIReady = function () {
      console.log("API is ready.")
      player = new YT.Player('video-loader'/*Specific your div ID here for display the video.*/, {
        videoId: 'cqMKaYtvMd4', // Specific your video ID http://www.youtube.com/embed/videoIDHere
        width: width,// Specific width
        height: height,// Specific height
        // playerVars: {
          //  end: 0, autoplay: 1, loop: 0, controls: 0, showinfo: 0, modestbranding: 1, fs: 0, cc_load_policty: 0, iv_load_policy: 3, autohide: 0
          // },
        events: {
          'onReady': onPlayerReady()
        }
      });
    }

    window.onPlayerReady = function () {
      console.log("My player is onReady");
      const player = YT.get('video-loader')
      console.log(player)
    }
  }

  log() {
    const player = YT.get('video-loader')
    console.log(player)
  }

  changeVideo(videoId) {
    const player = YT.get('video-loader')
    player.loadVideoById(videoId)
  }

  getTimestamp() {
    const player = YT.get('video-loader')
    return player.getCurrentTime()
  }

  playVideo() {
    const player = YT.get('video-loader')
    player.playVideo()
  }

  pauseVideo() {
    const player = YT.get('video-loader')
    player.pauseVideo()
  }

  toggleVideo() {
    const player = YT.get('video-loader')
    if (player.getPlayerState() == 1) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  seekVideo(seconds) {
    const player = YT.get('video-loader')
    const currTime = Math.round(player.getCurrentTime())
    player.seekTo(currTime + seconds)
  }


}
