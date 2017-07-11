import React from 'react';

class VideoComponent extends React.Component {
	render() {
		return (
			<div className="YoutubeItem">
				<img
					src={this.props.thumbnail}
					className="Thumbnail"
					draggable="false"
				/>
				{ this.props.showDescription ?
					<div className="Text">
						<div className="Title" >
							{this.props.title + ' -- ' +  this.props.author}
						</div>
						<div className="Description" >{this.props.description}</div>
					</div>
				:
					null
				}
			</div>
		)
	}
}

export default VideoComponent;