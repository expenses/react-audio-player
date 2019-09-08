"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var ReactAudioPlayer = /** @class */ (function (_super) {
    __extends(ReactAudioPlayer, _super);
    function ReactAudioPlayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.audioEl = undefined;
        _this.listenTracker = undefined;
        return _this;
    }
    ReactAudioPlayer.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, onEnded = _a.onEnded, onLoad = _a.onLoad;
        var audio = this.audioEl;
        if (!audio) {
            return;
        }
        // When audio play starts
        audio.addEventListener('play', function (e) {
            _this.setListenTrack();
            // this.props.onPlay(e);
        });
        // When unloading the audio player (switching to another src)
        audio.addEventListener('abort', function (e) {
            _this.clearListenTrack();
            // this.props.onAbort(e);
        });
        // When the file has finished playing to the end
        audio.addEventListener('ended', function (e) {
            _this.clearListenTrack();
            onEnded ? onEnded() : null;
        });
        // When the user pauses playback
        audio.addEventListener('pause', function (e) {
            _this.clearListenTrack();
            // this.props.onPause(e);
        });
        audio.addEventListener('loadedmetadata', function (e) {
            onLoad ? onLoad(audio) : null;
        });
    };
    ReactAudioPlayer.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = this.props, playing = _a.playing, time = _a.time;
        if (playing !== nextProps.playing && this.audioEl) {
            if (nextProps.playing) {
                this.audioEl.play();
            }
            else {
                this.audioEl.pause();
            }
        }
        if (nextProps.time && nextProps.time !== time && this.audioEl) {
            var difference = Math.abs(nextProps.time - this.props.time);
            // Skip seeks over 1 second
            if (difference > 1) {
                this.audioEl.currentTime = nextProps.time;
            }
        }
    };
    /**
     * Set an interval to call props.onListen every props.listenInterval time period
     */
    ReactAudioPlayer.prototype.setListenTrack = function () {
        var _this = this;
        if (this.listenTracker === undefined) {
            var listenInterval = this.props.listenInterval;
            this.listenTracker = setInterval(function () {
                if (_this.props.onListen !== undefined && _this.audioEl !== undefined) {
                    _this.props.onListen(_this.audioEl.currentTime);
                }
            }, listenInterval);
        }
    };
    /**
     * Clear the onListen interval
     */
    ReactAudioPlayer.prototype.clearListenTrack = function () {
        if (this.listenTracker !== undefined) {
            clearInterval(this.listenTracker);
            this.listenTracker = undefined;
        }
    };
    ReactAudioPlayer.prototype.render = function () {
        var _this = this;
        var _a = this.props, title = _a.title, src = _a.src, playing = _a.playing, className = _a.className;
        return (react_1.default.createElement("audio", { autoPlay: playing, className: className, ref: function (ref) { _this.audioEl = ref || undefined; }, src: src, 
            // Set lockscreen / process audio title on devices
            title: title || src, preload: 'metadata' },
            react_1.default.createElement("p", null,
                "Your browser does not support the ",
                react_1.default.createElement("code", null, "audio"),
                " element.")));
    };
    return ReactAudioPlayer;
}(react_1.Component));
exports.default = ReactAudioPlayer;
