import React, { Component } from 'react';
import Video from 'structure/Video';

import VideoListComponent from 'view/component/video-list-component';

/**
 * 
 * 
 * @class PlayerPage
 * @augments {Component<{videos: Video[], horizontal: boolean}, {}>}
 */
class PlayerPage extends Component {
	/**
	 * The complete Triforce, or one or more components of the Triforce.
	 * @typedef {Object} SampleDef - example
	 * @property {boolean} hasCourage - Indicates whether the Courage component is present.
	 * @property {boolean} hasPower - Indicates whether the Power component is present.
	 * @property {boolean} hasWisdom - Indicates whether the Wisdom component is present.
	 * @param {SampleDef} props wheater
	 */  
	constructor(props) {
		super(props);
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
		document.addEventListener('keydown', this.keyboardControl.bind(this));
		document.addEventListener('wheel', this.wheelControl.bind(this), {passive: true});
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
		document.removeEventListener('keydown', this);
		document.removeEventListener('wheel', this, {passive: true});
		/*
		TODO CHECK
		document.removeEventListener('wheel', this.wheelControl);
		*/
	}
	render() {
		return (
			<div>
				<button onClick={()=>this.props.fimVideo(this.props.videos.slice(this.state.playingIndex + 1, this.props.videos.length))} >
					<span className="glyphicon glyphicon-remove" aria-hidden={true}></span>
					<span className="TextAfterIcon">Close</span>
				</button>
				<div className="YoutubePlayer">
					<div id="player">
					</div>
				</div>
				<div>
					{/*<YoutubePlayList videos={this.props.videos} horizontal={true} highlightIndex={this.state.playingIndex} click={this.changeVideo} />*/}
					<VideoListComponent videos={this.props.videos} horizontal highlightIndex={this.state.playingIndex} click={this.changeVideo} />
				</div>
			</div>
		)
	}
	videoStateChange(event) {
		// Fim do Video
		if (event.data == YT.PlayerState.ENDED) {
			const next = this.state.playingIndex + 1;
			if(this.props.videos[next]){
				this.changeVideo(next);
			}else {
				this.props.fimVideo([]);
			}
		}
	}
	changeVideo(index) {
		if(index >= 0 && index < this.props.videos.length) {
			this.setState({ playingIndex: index });
		}
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
				this.props.fimVideo(this.props.video.slice(this.state.playingIndex + 1, this.props.videos.length));
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
}

PlayerPage.defaultProps = {
	horizontal: false
}

export default PlayerPage;