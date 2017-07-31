import React, { Component } from 'react';
import Video from 'structure/Video';

import { app } from 'app';

import VideoListComponent from 'view/component/video-list-component';

/**
 * @class PlayerPage
 * @augments {Component<{videos: Video[]},{}>}
 */
class PlayerPage extends Component {
	constructor(props) {
		super(props);
		this.wheelControl = this.wheelControl.bind(this);
		this.keyboardControl = this.keyboardControl.bind(this);
		this.state = {
			playingIndex: 0
		};
	}
	componentDidMount() {
		this.player = new YT.Player('player', {
			height: '720',
			width: '1280',
			videoId: this.props.videos[this.state.playingIndex].id,
			events: {
				onReady(event){
					event.target.setPlaybackQuality('hd720');
					event.target.setPlaybackQuality('hd1080');
					event.target.playVideo();
				},
				onStateChange: this.videoStateChange
			}
		});
		document.addEventListener('keydown', this.keyboardControl);
		document.addEventListener('wheel', this.wheelControl, {passive: true});
	}
	componentWillUpdate(nextProps, nextState) {
		if( nextState.playingIndex != this.state.playingIndex ) {
			this.player.loadVideoById({
				id: this.props.videos[this.state.playingIndex].id,
				suggestedQuality: 'hd1080'
			});
		}
	}
	componentWillUnmount() {
		this.player.destroy();
		document.removeEventListener('keydown', this.keyboardControl);
		document.removeEventListener('wheel', this.wheelControl);
	}
	videoStateChange(event) {
		// Fim do Video
		if (event.data == YT.PlayerState.ENDED) {
			const next = this.state.playingIndex + 1;
			if(this.props.videos[next]){
				this.changeVideo(next);
			}else {
				this.stopPlaying();
			}
		}
	}
	changeVideo(index) {
		if(index >= 0 && index < this.props.videos.length) {
			this.setState({ playingIndex: index });
		}
	}
	stopPlaying() {
		app.stopPlaying(this.props.videos.slice(this.state.playingIndex + 1, this.props.videos.length));
	}
	keyboardControl(event) {
		const keyCode = event.keyCode;
		switch(keyCode) {
			case 37: //Arrow Left
				this.changeVideo(this.state.playingIndex - 1);
				break;
			case 39: //Arrow Right
				this.changeVideo(this.state.playingIndex + 1);
				break;
			case 32: //Space
				const playerState = this.player.getPlayerState();
				if (playerState == YT.PlayerState.PAUSED){
					this.player.playVideo();
				}else if (playerState == YT.PlayerState.PLAYING) {
					this.player.pauseVideo();
				}
				break;
			case 8: //BackSpace
				event.preventDefault();
				this.stopPlaying();
				break;
		}
	}
	wheelControl(event) {
		const deltaY = event.wheelDeltaY;
		if (deltaY > 0) {
			this.player.setVolume(this.player.getVolume() + 10);
		}else if (deltaY < 0) {
			this.player.setVolume(this.player.getVolume() - 10);
		}
	}
	render() {
		return (
			<div>
				<button onClick={()=>this.stopPlaying()} >
					<span className="glyphicon glyphicon-remove" aria-hidden={true}></span>
					<span className="TextAfterIcon">Close</span>
				</button>
				<div className="YoutubePlayer">
					<div id="player">
					</div>
				</div>
				<div>
					<VideoListComponent videos={this.props.videos} horizontal highlightIndex={this.state.playingIndex} click={this.changeVideo} />
				</div>
			</div>
		)
	}
}

export default PlayerPage;