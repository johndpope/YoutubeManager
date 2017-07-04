import { Video } from './video';

class YoutubePlaylist {
	/**
	 * Creates an instance of YoutubePlaylist.
	 * @param {string} id 
	 * @param {array} videos 
	 * @param {number} totalVideos 
	 * @param {string} nextPageToken 
	 * @memberof YoutubePlaylist
	 */
	constructor(id, videos, totalVideos, nextPageToken) {
		var errorMessages = [];
		if (typeof id !== 'string') {
			errorMessages.push('Invalid argument id, expected to be a string.');
		}
		if (videos.constructor !== Array) {
			errorMessages.push('Invalid argument videos, expected to be a array.');
		}else {
			videos.forEach( (element, index) => {
				if (element.constructor !== Video) {
					errorMessages.push('Invalid element ( ' + index + ' ) in videos. expected to be of type Video.');
				}
			});
		}
		if (typeof totalVideos !== 'number') {
			errorMessages.push('Invalid argument totalVideos, expected to be a number.');
		}
		if (typeof nextPageToken !== 'string') {
			errorMessages.push('Invalid argument nextPageToken, expected to be a string.');
		}
		if (errorMessages.length > 0) {
			throw new TypeError(errorMessages.join(' '));
		}
		this.id = id;
		this.videos = videos;
		this.totalVideos = totalVideos;
		this.nextPageToken = nextPageToken;
	}
}

export default YoutubePlaylist;