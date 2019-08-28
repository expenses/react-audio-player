import React, { Component } from "react";

interface Props {
  playing: boolean;
  className?: string;
  listenInterval: number;
  src?: string;
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
  listenTracker: NodeJS.Timer | null = null;
  onPlay: any;

  componentDidMount() {
    const audio = this.audioEl;

    if (!audio) {
      return;
    }

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

    audio.addEventListener('loadedmetadata', (e: Event) => {
      if (this.props.onLoad) {
        this.props.onLoad(audio.duration);
      }
    });
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
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    );
  }
}
