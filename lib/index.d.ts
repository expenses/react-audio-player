import { Component, ReactElement } from 'react';
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
    audioEl: HTMLAudioElement | undefined;
    listenTracker: number | undefined;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: Props): void;
    /**
     * Set an interval to call props.onListen every props.listenInterval time period
     */
    setListenTrack(): void;
    /**
     * Clear the onListen interval
     */
    clearListenTrack(): void;
    render(): ReactElement;
}
export {};
