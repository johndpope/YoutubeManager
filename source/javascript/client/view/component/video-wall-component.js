import React, { Component } from 'react';
import Video from 'structure/Video';

import VideoComponent from 'view/component/video-component';

/**
 * The VideoWallComponent props
 * @typedef {object} VideoWallComponentProps
 * @property {Video[]} videos
 * @property {int} pageSize
 * @property {function} click
 */

/**
 * @class VideoWallComponent
 * @extends {Component}
 * @augments {Component<VideoWallComponentProps,{}>}
 */

class VideoWallComponent extends Component{
	constructor(props) {
		super(props);
		this.state = {
			page: 1
		}
	}
	nextPage() {
		if ( this.props.videos.length > (this.state.page * this.props.pageSize)) {
			this.setState({
				page: this.state.page + 1
			})
		}
	}
	previousPage() {
		if ( this.state.page > 1) {
			this.setState({
				page: this.state.page - 1
			})
		}
	}
	render() {
		const videos = this.props.videos
			.slice( (this.state.page - 1) * this.props.pageSize , this.state.page * this.props.pageSize)
			.map( (item, index) => {
			return (
				<div key={item.id} onClick={()=>this.props.click(item)} className="wall-item">
					<VideoComponent video={item} showDescription={true} />
				</div>
			)
		})
		return (
			<div className="video-wall-component">
				<div className="video-wall">
					{videos}
				</div>
				<div>
					<button type="button" onClick={()=>this.previousPage()}>
						<span className="glyphicon glyphicon-chevron-left" aria-hidden={true}></span>
						Previous Page
					</button>
					<button className="Right" type="button" onClick={()=>this.nextPage()}>
						Next Page
						<span className="glyphicon glyphicon-chevron-right" aria-hidden={true}></span>
					</button>
				</div>
			</div>
		)
	}
}

VideoWallComponent.defaultProps = {
	videos: [],
	pageSize: 16,
	click() {}
}

export default VideoWallComponent;