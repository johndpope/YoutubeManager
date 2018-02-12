import config from 'config';
import Video from 'structure/Video';
import Channel from 'structure/Channel';

const youtubeAPI = {
	/**
	 * 
	 * 
	 * @param {any} playlistId 
	 * @param {any} [pageToken=undefined] 
	 * @returns 
	 */
	listPlaylistVideos(playlistId, pageToken=undefined) {
		const request = gapi.client.youtube.playlistItems.list({
			part: 'snippet',
			playlistId: playlistId,
			pageToken: pageToken,
			maxResults: 50
		})
		return request.then( (response) => {
			const videos = [];
			response.result.items.forEach( (element) => {
				const video = new Video(
					element.snippet.resourceId.videoId,
					element.snippet.title,
					element.snippet.description,
					element.snippet.thumbnails.medium.url,
					element.snippet.channelTitle,
					element.snippet.channelId,
					new Date(element.snippet.publishedAt),
				);
				videos.push(video);
			})
			return {
				result: videos,
				nextPageToken: response.result.nextPageToken
			};
		});
	},
	/**
	 * 
	 * 
	 * @param {any} videoCategoryId 
	 * @param {string} [regionCode='US'] 
	 * @returns 
	 */
	listTopVideos(videoCategoryId, regionCode = 'US') {
		const request = gapi.client.youtube.videos.list({
			part: 'snippet',
			chart: 'mostPopular',
			maxResults: 50,
			regionCode: regionCode,
			videoCategoryId: videoCategoryId
		})
		return request.then( (response) => {
			const videos = [];
			response.result.items.forEach( (element) => {
				const video = new Video(
					element.id,
					element.snippet.title,
					element.snippet.description,
					element.snippet.thumbnails.medium.url,
					element.snippet.channelTitle,
					element.snippet.channelId,
					new Date(element.snippet.publishedAt)
				);
				videos.push(video);
			})
			return videos
		});
	},
	/**
	 * 
	 * 
	 * @param {any} text 
	 * @param {any} [pageToken=undefined] 
	 * @returns 
	 */
	searchVideo(text, pageToken=undefined) {
		const request = gapi.client.youtube.search.list({
			part: 'snippet, id',
			type: 'video',
			q: text,
			pageToken: pageToken,
			maxResults: 50
		});
		return request.then( (response) => {
			const videos = [];
			response.result.items.forEach( (element) => {
				if(element.id.kind == 'youtube#video') {
					const video = new Video(
						element.id.videoId,
						element.snippet.title,
						element.snippet.description,
						element.snippet.thumbnails.medium.url,
						element.snippet.channelTitle,
						element.snippet.channelId,
						new Date(element.snippet.publishedAt)
					);
					videos.push(video);
				}else {
					//TODO Log test cases
				}
			})
			return {
				result: videos,
				nextPageToken: response.result.nextPageToken
			};
		});
	},
	/**
	 * 
	 * 
	 * @param {any} channelId 
	 * @returns 
	 */
	getChannel(channelId) {
		const request = gapi.client.youtube.channels.list({
			part: 'snippet',
			id: channelId
		});
		return request.then( (response) => {
			if(resposne.result.items.length == 1 ) {
				const channel = new Channel(
					response.result.items[0].id,
					response.result.items[0].snippet.title,
					response.result.items[0].snippet.thumbnails.medium.url,
					response.result.items[0].snippet.description
				);
				return {
					result: channel
				};
			}else {
				//Não foi retornado 1 canal para busca por ID.
				Promise.reject('')
			}
		});
	},
	/**
	 * 
	 * 
	 * @param {any} channelId 
	 * @param {any} pageToken 
	 * @returns {Promise<{result: Map<string,Video>}>}
	 */
	listSubscribedChannels(channelId, pageToken) {
		const request = gapi.client.youtube.subscriptions.list({
			part: 'snippet',
			channelId: channelId,
			pageToken: pageToken,
			maxResults: config.youtubeAPIResultLimit
		})
		return request.then( (response) => {
			const subscribedChannels = new Map();
			response.result.items.forEach( (element) => {
				const channel = new Channel (
					element.snippet.resourceId.channelId,
					element.snippet.title,
					element.snippet.thumbnails.medium.url,
					element.snippet.description
				);
				subscribedChannels.set(channel.id, channel);
			})
			return {
				result: subscribedChannels,
				nextPageToken: response.result.nextPageToken
			};
		});
	},
	/**
	 * 
	 * 
	 * @param {string} [regionCode='US'] 
	 * @returns 
	 */
	listCategories(regionCode = 'US') {
		const request = gapi.client.youtube.videoCategories.list({
			part: 'snippet',
			regionCode: regionCode
		});
		return request.then( (response) => {
			//const categories = [{id: 0, text: 'General'}];
			const categories = [];
			response.result.items.forEach( (element) => {
				if(element.snippet.assignable) {
					categories.push({
						id: element.id,
						text: element.snippet.title
					});
				}
			})
			return {
				result: categories
			};
		})
	},
}

export default youtubeAPI;