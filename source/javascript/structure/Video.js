class Video {
	/**
	 * Creates an instance of Video.
	 * @param {string} id 
	 * @param {string} title 
	 * @param {string} description 
	 * @param {string} thumbnail 
	 * @param {string} authorName 
	 * @param {string} authorId 
	 * @param {date} uploadDate 
	 * @memberof Video
	 */
	constructor(id, title, description, thumbnail, authorName, authorId, uploadDate) {
		var errorMessages = [];
		if (typeof id !== 'string') {
			errorMessages.push('Invalid argument id, expected to be a string.');
		}
		if (typeof title !== 'string') {
			errorMessages.push('Invalid argument title, expected to be a string.');
		}
		if (typeof description !== 'string') {
			errorMessages.push('Invalid argument description, expected to be a string.');
		}
		if (typeof thumbnail !== 'string') {
			errorMessages.push('Invalid argument thumbnail, expected to be a string.');
		}
		if (typeof authorName !== 'string') {
			errorMessages.push('Invalid argument authorName, expected to be a string.');
		}
		if (typeof authorId !== 'string') {
			errorMessages.push('Invalid argument authorId, expected to be a string.');
		}
		if (uploadDate.constructor !== Date) {
			errorMessages.push('Invalid argument uploadDate, expected to be a Date.');
		}
		if (errorMessages.length !== 0) {
			throw new TypeError(errorMessages.join(' '));
		}
		this.id = id;
		this.title = title;
		this.description = description;
		this.thumbnail = thumbnail;
		this.authorName = authorName;
		this.authorId = authorId;
		this.uploadDate = uploadDate;
	}
}

export default Video;