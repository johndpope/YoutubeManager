import config from 'config';

const seriesAPI = {
	getSeries() {
		return fetch( config.apiDomain + '/series' ).then( (response) => {
			return response.json();
		});
	},
	saveSeries(series) {
		return fetch( 
			config.apiDomain + '/series',
			{
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(series)
			}
		).then( (response) => {
			return response.json();
		});
	}
}

export default seriesAPI