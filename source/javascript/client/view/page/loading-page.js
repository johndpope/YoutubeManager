import React, {Component} from 'react';

class LoadingPage extends Component {
	render() {
		return (
			<div className="LoadingPage">
				<h1 >LOADING ... <img src="../assets/loading.gif" style={{ width : '1em' }}/></h1> 
			</div>
		)
	}
}

export default LoadingPage;