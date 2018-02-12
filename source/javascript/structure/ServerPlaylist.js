import { Video } from './video';

class ServerPlaylist {
	/**
	 * Creates an instance of ServerPlaylist.
	 * @param {string} title 
	 * @param {array} videos 
	 * @param {object} options 
	 * @memberof ServerPlaylist
	 */
	constructor(title, videos, options) {
		var errorMessages = [];
		if (typeof title !== 'string') {
			errorMessages.push('Invalid argument title, expected to be a string.');
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
		if (typeof options !== 'object') {
			errorMessages.push('Invalid argument options, expected to be a object.');
		}else {
			if(typeof options.remove_watched_video !== 'boolean') {
				errorMessages.push('Invalid argument remove_watched_video in options, expected to be a boolean.');
			}
		}
		if (errorMessages.length > 0) {
			throw new TypeError(errorMessages.join(' '));
		}
		this.title = title;
		this.videos = videos;
		this.remove_watched_video = options.remove_watched_video;
	}
}

export default ServerPlaylist;