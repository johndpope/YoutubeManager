import React, {Component} from 'react';
import Video from 'structure/Video';

import VideoComponent from 'view/component/video-component';

/**
 * The VideoComponent props.
 * @typedef {object} VideoListComponentProps
 * @property {Video[]} videos
 * @property {boolean} horizontal
 * @property {number} highlightIndex
 * @property {function} click
 * @property {function} [changePosition]
 * @property {function} [removeVideoPlaylist]
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
	dragStart(event , index) {
		console.log('drag start');
		//this.item = index;
	}
	dragOver(event) {
		console.log('drag over');
		//event.preventDefault();
	}
	dragEnter(event , index) {
		console.log('drag enter')
		//this.setState({over: index});
	}
	drop(event , index) {
		console.log('drop');
		//this.props.changePosition(this.item,index);
		//this.setState({over : -1});
	}
	remove(index) {
		console.log(index);
		//this.props.removeVideoPlaylist(index);
	}
	render() {
		const videos = this.props.videos.map( (item, index) => {
			return (
				<div key={item.id} className={(this.props.horizontal ? 'Horizontal ' : 'Vertical ')} >
					{
						this.props.horizontal ?
						null :
						<button type='button' className='RemoveButton' onClick={()=>this.remove(index)} >
							<span className='glyphicon glyphicon-remove' aria-hidden={true}></span>
						</button>
					}
					<div className={
							(this.props.highlightIndex == index ? 'Highlight ' : '') + 
							(this.state.over == index ? 'Over ' : '') + 
							'HasTooltip'
						}
						draggable={this.props.changePosition? true : false}
						onDragEnter={(event)=>this.dragEnter(event , index)}
						onDragStart={(event)=>this.dragStart(event , index)}
						onDragOver={this.dragOver}
						onDrop={(event)=>this.drop(event , index)}
						onClick={(event)=>this.props.click(event, index)}
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
	click() {},
	changePosition() {},
	removeVideoPlaylist() {}
}

export default VideoListComponent;