import React, { Component, ReactElement } from 'react';

interface Props {
  playing: boolean;
  className?: string;
  listenInterval: number;
  src?: string;
  title?: string;
  time: number;
  onListen?: (time: number) => void;
  onLoad?: (audio: HTMLAudioElement) => void;
  onEnded?: () => void;
}

export default class ReactAudioPlayer extends Component<Props> {
  audioEl: HTMLAudioElement | undefined = undefined;

  listenTracker: number | undefined = undefined;

  componentDidMount() {
    let {onEnded, onLoad} = this.props;
    const audio = this.audioEl;

    if (!audio) {
      return;
    }

    // When audio play starts
    audio.addEventListener('play', (e: Event) => {
      this.setListenTrack();
      // this.props.onPlay(e);
    });

    // When unloading the audio player (switching to another src)
    audio.addEventListener('abort', (e: Event) => {
      this.clearListenTrack();
      // this.props.onAbort(e);
    });

    // When the file has finished playing to the end
    audio.addEventListener('ended', (e: Event) => {
      this.clearListenTrack();
      onEnded ? onEnded() : null;
    });

    // When the user pauses playback
    audio.addEventListener('pause', (e: Event) => {
      this.clearListenTrack();
      // this.props.onPause(e);
    });

    audio.addEventListener('loadedmetadata', (e: Event) => {
      onLoad ? onLoad(audio) : null;
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { playing, time } = this.props;

    if (playing !== nextProps.playing && this.audioEl) {
      if (nextProps.playing) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
      }
    }

    if (nextProps.time && nextProps.time !== time && this.audioEl) {
      const difference = Math.abs(nextProps.time - this.props.time);

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
    if (this.listenTracker === undefined) {
      const { listenInterval } = this.props;
      this.listenTracker = setInterval(() => {
        if (this.props.onListen !== undefined && this.audioEl !== undefined) {
          this.props.onListen(this.audioEl.currentTime);
        }
      }, listenInterval);
    }
  }

  /**
   * Clear the onListen interval
   */
  clearListenTrack() {
    if (this.listenTracker !== undefined) {
      clearInterval(this.listenTracker);
      this.listenTracker = undefined;
    }
  }

  render(): ReactElement {
    const {
      title, src, playing, className,
    } = this.props;

    return (
      <audio
        autoPlay={playing}
        className={className}
        ref={(ref) => { this.audioEl = ref || undefined; }}
        src={src}
        // Set lockscreen / process audio title on devices
        title={title || src}
        preload='metadata'
      >
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    );
  }
}
