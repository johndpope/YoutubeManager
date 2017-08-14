import React, {Component} from 'react';
import Video from 'structure/Video';

import VideoComponent from 'view/component/video-component';

/**
 * The VideoComponent props.
 * @typedef {object} VideoListComponentProps
 * @property {Video[]} videos
 * @property {boolean} horizontal
 * @property {number} highlightIndex
 * @property {function} [removeVideoPlaylist]
 * @property {function} [click]
 * @property {function} [changePosition]
 */
/**
 * @class VideoListComponent
 * @extends {Component}
 * @augments {Component<VideoListComponentProps, {}>}
 */
class VideoListComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			over: -1
		}
	}
	dragStart(index) {
		this.draggedElementIndex = index;
	}
	dragOver(event) {
		event.preventDefault();
	}
	dragEnter(index) {
		// this.setState({over: index});
	}
	drop(index) {
		this.props.changePosition(this.draggedElementIndex, index);
		//this.setState({over : -1});
	}
	render() {
		const videos = this.props.videos.map( (item, index) => {
			return (
				<div key={item.id} className={(this.props.horizontal ? 'Horizontal ' : 'Vertical ')} >
					{
						this.props.removeVideoPlaylist ?
							<button type='button' className='RemoveButton' onClick={()=>this.props.removeVideoPlaylist(item, index)} >
								<span className='glyphicon glyphicon-remove' aria-hidden={true}></span>
							</button>
						:
							null
					}
					<div className={
							(this.props.highlightIndex == index ? 'Highlight ' : '') + 
							(this.state.over == index ? 'Over ' : '') + 
							'HasTooltip'
						}
						draggable={this.props.changePosition? true : false}
						onDragEnter={()=>this.dragEnter(index)}
						onDragStart={()=>this.dragStart(index)}
						onDragOver={(event)=>this.dragOver(event)}
						onDrop={()=>this.drop(index)}
						onClick={()=>this.props.click(item, index)}
						data-toggle="tooltip"
						data-placement={this.props.horizontal ? 'bottom' : 'left'}
						title={item.title + ' - ' + item.authorName}
					>
						<VideoComponent
							video={item}
							showDescription={false}
						/>
					</div>
				</div>
			)
		});
		return (
			<div calssName='YoutubePlaylist' >
				{videos}
			</div>
		)

	}
}

VideoListComponent.defaultProps  = {
	horizontal: false,
	highlightIndex: -1,
	removeVideoPlaylist(video, index) {},
	click(video, index) {}
}

export default VideoListComponent;