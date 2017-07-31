import React, { Component } from 'react';
import Video from 'structure/Video';

import youtubeService from 'youtube/youtube-service';
import { app } from 'app';

import VideoListComponent from 'view/component/video-list-component';
import VideoWallComponent from 'view/component/video-wall-component';
import VideoComponent from 'view/component/video-component';

/**
 * 
 * 
 * @class SubscriptionsVideosPage
 * @extends {Component}
 * @augments {Component<{videoList: Video[]}, {subscriptionsVideos: Video[], loadingSubscription:boolean}>}
 */
class SubscriptionsVideosPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subscriptionsVideos: [],
			loadingSubscription: true,
			videoList: this.props.videoList
		};
	}
	componentDidMount() {
		this.isMountedz = true;
		youtubeService.listLastSubscribedVideos().then( (videoList) => {
			if(this.isMountedz) {
				this.setState({
					subscriptionsVideos: videoList,
					loadingSubscription: false
				})
			}
		})
	}
	componentWillUnmount() {
		this.isMountedz = false;
	}
	// addVideoToList (index, event) {
	addVideoToList (video) {
		// event.preventDefault();
		// if(event.button == 0) {
			const videoList = this.state.videoList;
			// const video = this.state.subscriptionsVideos[index];
			if(videoList.indexOf(video) === -1) {
				videoList.push(video);
				this.setState({videoList: videoList});
			}else {
				console.log('video já na lista');
			}
		// }
	}
	removeVideoFromList (index) {
		const videoList = this.state.videoList;
		videoList.splice(index, 1);
		this.setState({videoList: videoList});
	}
	changeVideoPosition (fromPosition, toPosition) {
		const videoList = this.state.videoList;
		const video = videoList[fromPosition];
		videoList.splice(fromPosition, 1);
		videoList.splice(toPosition, 0, video);
		this.setState({videoList: videoList});
	}
	playVideoList () {
		app.playVideos(this.state.videoList);
	}
	render() {
		const subscriptionsVideos = this.state.subscriptionsVideos.slice(0, 16).map( (video, index) => {
			return (
				<div
					key={video.id}
					className="Item"
					onClick={(event)=>this.addVideoToList(index, event)}
				>
					<VideoComponent video={video} />
				</div>
			)
		})
		return (
			<div className="YoutubeContent">
				{this.state.loadingSubscription?
					<div className="Loading">
						<div className="LoadingContent">
							Loading ...
						</div>
					</div>
					:
					null
				}
				<div className="Center" >
					<div className="content" >
						<div className="Items" >
							{/* {subscriptionsVideos} */}
							<VideoWallComponent videos={this.state.subscriptionsVideos} click={this.addVideoToList} />
						</div>
					</div>
				</div>
				<div className="Side">
					<button onClick={() => this.playVideoList()}>
						Play
						<span className="glyphicon glyphicon-play" aria-hidden={true}></span>
					</button>
					<VideoListComponent videos={this.state.videoList} changePosition={this.changePosition} removeVideoPlaylist={this.removeVideoPlaylist} />
				</div>
			</div>
		)
	}
}

SubscriptionsVideosPage.defaultProps  = {
	videoList: []
}

export default SubscriptionsVideosPage;