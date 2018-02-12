import Video from './Video';

import videoJSON from 'video.json';

describe('Video constructor', () => {
	let videoMock;
	
	const constructor = () => {
		return new Video(
			videoMock.id,
			videoMock.title,
			videoMock.description,
			videoMock.thumbnail,
			videoMock.authorName,
			videoMock.authorId,
			videoMock.uploadDate
		);
	};
	
	beforeEach( () => {
		videoMock = {
			id : videoJSON.id,
			title : videoJSON.title,
			description : videoJSON.description,
			thumbnail : videoJSON.thumbnail,
			authorName : videoJSON.authorName,
			authorId : videoJSON.authorId,
			uploadDate : new Date(videoJSON.uploadDate)
		}
	})
	
	test('should create valid video', () => {
		expect(constructor()).toBeInstanceOf(Video);
	});
	
	test('should throw type error, invalid id', () => {
		videoMock.id = 1;
		expect(constructor).toThrowError(TypeError);
		expect(constructor).toThrowError(/Invalid argument id/);
	});
	
	test('should throw type error, invalid title', () => {
		videoMock.title = 1;
		expect(constructor).toThrowError(TypeError);
		expect(constructor).toThrowError(/Invalid argument title/);
	});
	
	test('should throw type error, invalid description', () => {
		videoMock.description = 1;
		expect(constructor).toThrowError(TypeError);
		expect(constructor).toThrowError(/Invalid argument description/);
	});
	
	test('should throw type error, invalid thumbnail', () => {
		videoMock.thumbnail = 1;
		expect(constructor).toThrowError(TypeError);
		expect(constructor).toThrowError(/Invalid argument thumbnail/);
	});
	
	test('should throw type error, invalid authorName', () => {
		videoMock.authorName = 1;
		expect(constructor).toThrowError(TypeError);
		expect(constructor).toThrowError(/Invalid argument authorName/);
	});
	
	test('should throw type error, invalid authorId', () => {
		videoMock.authorId = 1;
		expect(constructor).toThrowError(TypeError);
		expect(constructor).toThrowError(/Invalid argument authorId/);
	});
	
	test('should throw type error, invalid uploadDate', () => {
		videoMock.uploadDate = '2017/07/20';
		expect(constructor).toThrowError(TypeError);
		expect(constructor).toThrowError(/Invalid argument uploadDate/);
	});
});