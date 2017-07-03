import React, {Component} from 'react';
import SeriesService from 'series/series-service';

console.log(SeriesService.getSeries());

class Erro extends Component {
	render() {
		return (
			<div className="ErrorPage">
					<h1 >LOADING ...</h1>
				</div>
		)
	}
}

export default Erro