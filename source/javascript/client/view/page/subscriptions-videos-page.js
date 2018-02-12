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
	addVideoToList (video) {
		const videoList = this.state.videoList;
		if(videoList.indexOf(video) === -1) {
			videoList.push(video);
			this.setState({videoList: videoList});
		}else {
			console.log('video já na lista');
		}
	}
	removeVideoFromList (video) {
		const videoList = this.state.videoList;
		const index = videoList.indexOf(video);
		videoList.splice(index, 1);
		this.setState({videoList: videoList});
	}
	changeVideoPositionOnList (fromPosition, toPosition) {
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
		return (
			<div className="YoutubeContent subscriptions-videos-page">
				{this.state.loadingSubscription?
					<div className="Loading">
						<div className="LoadingContent">
							Loading ...
						</div>
					</div>
					:
					null
				}
				<div className="Side sidebar">
					<button onClick={() => this.playVideoList()}>
						Play
						<span className="glyphicon glyphicon-play" aria-hidden={true}></span>
					</button>
					<VideoListComponent
						videos={this.state.videoList}
						changePosition={(fromPosition, toPosition)=>this.changeVideoPositionOnList(fromPosition, toPosition)}
						removeVideoPlaylist={(video)=>this.removeVideoFromList(video)}
					/>
				</div>
				<div className="Center main-content" >
					<div className="content" >
						<div className="Items" >
							<VideoWallComponent
								videos={this.state.subscriptionsVideos}
								click={(video)=>this.addVideoToList(video)}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

SubscriptionsVideosPage.defaultProps  = {
	videoList: []
}

export default SubscriptionsVideosPage;