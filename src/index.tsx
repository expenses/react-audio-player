import React, { Component } from "react";

/*ReactAudioPlayer.propTypes = {
  playing: PropTypes.bool,
  children: PropTypes.element,
  className: PropTypes.string,
  controls: PropTypes.bool,
  controlsList: PropTypes.string,
  crossOrigin: PropTypes.string,
  id: PropTypes.string,
  listenInterval: PropTypes.number,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  onAbort: PropTypes.func,
  onCanPlay: PropTypes.func,
  onCanPlayThrough: PropTypes.func,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onListen: PropTypes.func,
  onLoadedMetadata: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onSeeked: PropTypes.func,
  onVolumeChanged: PropTypes.func,
  preload: PropTypes.oneOf(['', 'none', 'metadata', 'auto']),
  src: PropTypes.string, // Not required b/c can use <source>
  style: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string,
  volume: PropTypes.number,
};*/

interface Props {
  playing: boolean;
  className?: string;
  listenInterval: number;
  src: string;
  title?: string;
  time: number;
  onListen?: (time: number) => void;
  onLoad?: (duration: number) => void;
}

interface AudioEl {
  currentTime: number;
  play: () => void;
  pause: () => void;
  duration: number;

  addEventListener: (name: string, callback: (e: Event) => void) => void;
}

export default class ReactAudioPlayer extends Component<Props> {
  audioEl: AudioEl | null = null;
  listenTracker: any;
  onPlay: any;

  componentDidMount() {
    const audio = this.audioEl;

    if (!audio) {
      return;
    }

    /*audio.addEventListener('error', (e: Event) => {
      this.props.onError(e);
    });

    // When enough of the file has downloaded to start playing
    audio.addEventListener('canplay', (e: Event) => {
      this.props.onCanPlay(e);
    });

    // When enough of the file has downloaded to play the entire file
    audio.addEventListener('canplaythrough', (e: Event) => {
      this.props.onCanPlayThrough(e);
    });*/

    // When audio play starts
    audio.addEventListener('play', (e: Event) => {
      this.setListenTrack();
      //this.props.onPlay(e);
    });

    // When unloading the audio player (switching to another src)
    audio.addEventListener('abort', (e: Event) => {
      this.clearListenTrack();
      //this.props.onAbort(e);
    });

    // When the file has finished playing to the end
    audio.addEventListener('ended', (e: Event) => {
      this.clearListenTrack();
      //this.props.onEnded(e);
    });

    // When the user pauses playback
    audio.addEventListener('pause', (e: Event) => {
      this.clearListenTrack();
      //this.props.onPause(e);
    });

    // When the user drags the time indicator to a new time
    /*audio.addEventListener('seeked', (e: Event) => {
      this.props.onSeeked(e);
    });*/

    audio.addEventListener('loadedmetadata', (e: Event) => {
      if (this.props.onLoad) {
        this.props.onLoad(audio.duration);
      }
      //this.props.onLoadedMetadata(e);
    });

    /*audio.addEventListener('volumechange', (e: Event) => {
      this.props.onVolumeChanged(e);
    });*/
  }

  componentWillReceiveProps(nextProps: Props) {
    //this.updateVolume(nextProps.volume);
    if (this.props.playing !== nextProps.playing && this.audioEl) {
      if (nextProps.playing) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
      }
    }

    if (nextProps.time && nextProps.time !== this.props.time && this.audioEl) {
      let difference = Math.abs(nextProps.time - this.props.time);

      // Skip seeks over 1 second
      if (difference > 1) {
        this.audioEl.currentTime = nextProps.time;
      }
    }
  }

  /**
   * Set an interval to call props.onListen every props.listenInterval time period
   */
  setListenTrack() {
    if (!this.listenTracker) {
      const listenInterval = this.props.listenInterval;
      this.listenTracker = setInterval(() => {
        if (this.props.onListen && this.audioEl) {
          this.props.onListen(this.audioEl.currentTime);
        }
      }, listenInterval);
    }
  }

  /**
   * Clear the onListen interval
   */
  clearListenTrack() {
    if (this.listenTracker) {
      clearInterval(this.listenTracker);
      this.listenTracker = null;
    }
  }

  render() {
    const incompatibilityMessage = this.props.children || (
      <p>Your browser does not support the <code>audio</code> element.</p>
    );

    // Set lockscreen / process audio title on devices
    const title = this.props.title ? this.props.title : this.props.src;

    return (
      <audio
        autoPlay={this.props.playing}
        className={this.props.className}
        ref={(ref) => { this.audioEl = ref; }}
        src={this.props.src}
        title={title}
      >
        {incompatibilityMessage}
      </audio>
    );
  }
}

/*ReactAudioPlayer.defaultProps = {
  playing: false,
  children: null,
  className: '',
  controls: false,
  controlsList: '',
  crossOrigin: null,
  id: '',
  listenInterval: 10000,
  loop: false,
  muted: false,
  onAbort: () => {},
  onCanPlay: () => {},
  onCanPlayThrough: () => {},
  onEnded: () => {},
  onError: () => {},
  onListen: () => {},
  onPause: () => {},
  onPlay: () => {},
  onSeeked: () => {},
  onVolumeChanged: () => {},
  onLoadedMetadata: () => {},
  preload: 'metadata',
  src: null,
  style: {},
  title: '',
  volume: 1.0,
};*/
