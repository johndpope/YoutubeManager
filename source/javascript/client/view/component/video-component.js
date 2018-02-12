import React, {Component} from 'react';
import Video from 'structure/Video';

/**
 * The VideoComponent props.
 * @typedef {object} VideoComponentProps - example
 * @property {Video} video
 * @property {boolean} showDescription - Indicates whether show description or not.
 */  

/**
 * @class VideoComponent
 * @extends {Component}
 * @augments {Component<VideoComponentProps, {}>}
 */
class VideoComponent extends Component {
	render() {
		return (
			<div className="video-component">
				<div className="text-center">
					<img
						src={this.props.video.thumbnail}
						draggable="false"
						className="video-thumbnail"
					/>
				</div>
				{ this.props.showDescription ?
					<div className="video-text">
						<div className="video-title" >
							{this.props.video.title + ' -- ' +  this.props.video.authorName}
						</div>
						<div className="video-description" >{this.props.video.description}</div>
					</div>
				:
					null
				}
			</div>
		)
	}
}

export default VideoComponent;