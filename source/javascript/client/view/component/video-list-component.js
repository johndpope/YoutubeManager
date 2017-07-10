import {Component} from 'react';
//@augments {Component<{x: string, y:number}}, State>}
/**
 * 
 *
 * 
 * @class VideoListComponent
 * @extends {Component}
 */
class VideoListComponent extends Component {
	/**
	 * Creates an instance of VideoListComponent.
	 * @param {object} props - props
	 * @param {string} props.id - id
	 * @memberof VideoListComponent
	 */
	constructor(props) {
		this.props.
		super(props);
		this.state = {
			over: -1
		}
	}
	
	componentDidMount() {

	}
	render() {
		

	}
}

// VideoListComponent.defaultProps  = {
// 	horizontal: false,
// 	highlightIndex: -1,
// 	click() {
// 	}
// }

export default VideoListComponent;