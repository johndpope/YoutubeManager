import seriesAPI from './series-api';
import cacheService from '/cache/cache-service';
import youtubeService from 'youtube/youtube-service';

const seriesService = {
	getSeries() {
		const series = cacheService.load(cacheService.type.series, 'series');
		let promise;
		if(series != undefined) {
			promise = seriesAPI.getSeries().then( (json) => {
				const promises = [];
				cacheService.save(cacheService.type.series, 'series', json);
				Object.keys(json).forEach( (element) => {
					const promise = youtubeService.listChannelUploads(element).then( (response) => {
						return response.result.filter( (video) => {
							return json[element].series.some( (serie) => {
								return (video.title.toLowerCase().indexOf(serie.title.toLowerCase()) != -1)
							});
						});
					})
					promises.push(promise);
				});
				return Promise.all(promises).then( (results) => {
					return results.reduce( (previousValue, currentvalue) => {
						return previousValue.concat(currentvalue)
					});
				})
			}).catch( () => {
				return [];
			});
		}else {
			promise = Promise.resolve(series);
		}
		return promise;
	},
	saveSeries(series) {
		return seriesAPI.saveSeries(series).then( (result) => {
			cacheService.save(cacheService.type.series, 'series', series);
		}).catch( (error) => {
			cacheService.clear(cacheService.type.series, 'series');
			return 'Não foi possível salvar as suas séries';
		});
	}
}

export default SeriesService;