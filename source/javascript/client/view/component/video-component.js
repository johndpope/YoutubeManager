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
	componentDidMount() {
		console.log(this.props);
	}
	render() {
		return (
			<div className="YoutubeItem">
				<img
					src={this.props.video.thumbnail}
					className="Thumbnail"
					draggable="false"
				/>
				{ this.props.showDescription ?
					<div className="Text">
						<div className="Title" >
							{this.props.video.title + ' -- ' +  this.props.video.authorName}
						</div>
						<div className="Description" >{this.props.video.description}</div>
					</div>
				:
					null
				}
			</div>
		)
	}
}

export default VideoComponent;