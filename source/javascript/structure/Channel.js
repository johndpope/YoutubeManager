class Channel {
	/**
	 * Creates an instance of Channel.
	 * @param {string} id 
	 * @param {string} name 
	 * @param {string} thumbnail 
	 * @param {string} description 
	 * @memberof Channel
	 */
	constructor(id, name, thumbnail, description) {
		var errorMessages = [];
		if (typeof id !== 'string') {
			errorMessages.push('Invalid Argument id, expected to be a string.');
		}
		if (typeof name !== 'string') {
			errorMessages.push('Invalid argument name, expected to be a string.');
		}
		if (typeof thumbnail !== 'string') {
			errorMessages.push('Invalid argument thumbnail, expected to be a string.');
		}
		if (typeof description !== 'string') {
			errorMessages.push('Invalid argument description, expected to be a string.');
		}
		if(errorMessages.length !== 0) {
			throw new TypeError(errorMessages.join(' '));
		}
		this.id = id;
		this.name = name;
		this.thumbnail = thumbnail;
		this.description = description;
		this.uploadId = 'UU'.concat(id.slice(2));
		this.videos = [];
	}
}

export { Channel }