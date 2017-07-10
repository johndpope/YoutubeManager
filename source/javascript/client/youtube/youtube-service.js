import youtubeAPI from './youtube-api';
import cacheService from 'cache/cache-service';
import config from 'config';

const youtubeService = {
	/**
	 * Requests channel if not in cache.
	 * 
	 * @param {string} channelId
	 * @returns {Promise<Channel|string>} resolves Channel object or rejects string error message.
	 */
	getChannel(channelId) {
		let promise;
		const channel = cacheService.load('channel', channelId);
		if(channel == undefined) {
			promise = youtubeAPI.getChannel(channelId).then( (response) => {
				cacheService.save('channel', channelId, response.result);
				return response.result;
			}, (error) => {})
		}else {
			promise = Promise.resolve(channel);
		}
		return promise;
	},
	/**
	 * Requests channel and channel uploads if not in cache.
	 * 
	 * @param {string} channelId
	 * @returns  {Promise<Channel|string>} resolves Channel object with videos or rejects string error message.
	 */
	getChannelWithUploads(channelId) {
		return Promise.all([
			this.getChannel(channelId),
			this.listChannelUploads(channelId)
		]).then( (channel, uploads) => {
			channel.videos = uploads;
			return channel;
		} )
	},
	/**
	 * Requests all channels that user is subscribed if not in cache. User is defined by 'userChannelId' in config.
	 * 
	 * @returns {Promise<Channel[]|string} resolves Channel object list or rejects string error message.
	 */
	listMySubscribedChannels() {
		return new Promise( (resolve, reject) => {
			const subscribedChannels = new Map();
			const subscribedList = cacheService.load('channelIdList', 'subscribedList');
			if(subscribedList == undefined) {
				let pageToken = undefined;
				function loadSubscribedChannels() {
					youtubeAPI.listSubscribedChannels(config.userChannelId, pageToken).then( (response) => {
						response.result.forEach( (element) => {
							cacheService.save('channel', element.id, element);
							subscribedChannels.set(element.id, element);
						});
						pageToken = response.nextPageToken;
						if(pageToken == undefined) {
							resolve(subscribedChannels);
						}else {
							loadSubscribedChannels();
						}
					})
				};
				loadSubscribedChannels();
				cacheService.save('channelIdList', 'subscribedList', Array.from(subscribedChannels.keys()));
			}else {
				subscribedList.forEach( (element, index, array) => {
					//map catch
					this.getChannel(element).then( (channel) => {
						subscribedChannels.set(channel.id, channel);
						if(index == array.length - 1) {
							resolve(subscribedChannels);
						}
					})
				})
			}
		})
	},
	/**
	 * Requests channel uploads if not in cache.
	 * 
	 * @param {string} channelId 
	 * @param {string} [pageToken=undefined] 
	 * @returns {Promise<Videos[]|string>} resolves list of videos or rejects string error message.
	 */
	listChannelUploads(channelId, pageToken=undefined) {
		const uploadPlaylistId = "UU".concat(channelId.slice(2))
		return this.getPlaylist(uploadPlaylistId, pageToken);
	},
	/**
	 * Requests last videos from subscribed channels if not in cache;
	 * 
	 * @returns {Promise<Videos[]|string} resolves list of videos or rejects string error message.
	 */
	listLastSubscribedVideos() {
		let promise;
		let videoList = cacheService.load('playlist', 'lastSubscribedVideos');
		if(videoList == undefined) {
			promise = new Promise( (resolve, reject) => {
				videoList = [];
				const subscribedList = cacheService.load('channelIdList', 'subscribedList');
				if(subscribedList == undefined) {
					let pageToken = undefined;
					function loadSubscribedChannels() {
						youtubeAPI.listSubscribedChannels(userChannelId, pageToken).then( (response) => {
							pageToken = response.nextPageToken;
							response.result.forEach( (element, index, array) => {
								cacheService.save('channel', element.id, element);
								this.listchannelUploads(element.id).then( (channelUploads) => {
									videoList.push.apply(videoList, channelUploads);
									if(pageToken == undefined && index == array.length - 1) {
										resolve(videoList);
									}
								});
							});
							if(pageToken !== undefined) {
								loadSubscribedChannels();
							}
						})
					};
					loadSubscribedChannels();
				}else {
					subscribedList.forEach( (element, index, array) => {
						this.listChannelUploads(element).then( (channelUploads) => {
							videoList.push.apply(videoList, channelUploads);
						});
						if(index == array.length - 1) {
							resolve(videoList);
						};
					});
				}
			}).then( (videoList) => {
				videoList.sort( (element1, element2) => {

				})
				cacheService.save('playlist', 'lastSubscribedVideos', videoList);
			})
		}else {
			promise = Promise.resolve(videoList);
		}
		return promise;
	},
	/**
	 * Requests videos from playlist if not in cache.
	 * 
	 * @param {string} playlistId 
	 * @param {string} [pageToken=undefined] 
	 * @returns {Promise<Videos[]|string>} resolves with list of videos or rejects with string error message.
	 */
	getPlaylist(playlistId, pageToken=undefined){
		let playlist;
		let promise;
		if(pageToken == undefined) {
			playlist = cacheService.load(cacheService.type.playlist, playlistId);
		}
		if(playlist == undefined) {
			promise = youtubeAPI.listPlaylistVideos(playlistId, pageToken).then( (playlist) => {
				if(pageToken == undefined) {
					cacheService.save(cacheService.type.playlist, playlist.id, playlist);
				}
				return playlist;
			})
		}else {
			promise = Promise.resolve(playlist);
		}
		return promise;
	},
	/**
	 * 
	 * 
	 * @param {any} regionCode 
	 * @returns 
	 */
	listCategories(regionCode){
		const categories = cacheService.load(cacheService.type.categories, 'list');
		let promise;
		if (categories == undefined) {
			promise = youtubeAPI.listCategories.then((categories) => {
				cacheService.save(cacheService.type.categories, 'list', categories);
			})
		}else {
			promise = Promise.resolve(categories);
		}
		return promise;
	},
	/**
	 * 
	 * 
	 * @param {any} videoCategory 
	 * @param {any} regionCode 
	 * @returns 
	 */
	listTopVideos(videoCategory, regionCode){
		let promise;
		const videos = cacheService.load(cacheService.type.topPlaylist, regionCode+videoCategory);
		if (videos == undefined) {
			promise = youtubeAPI.listTopVideos(videoCategory, regionCode).then((videos) => {
				cacheService.save(cacheService.type.topPlaylist, regionCode+videoCategory, videos);
			})
		}else {
			promise = Promise.resolve(videos);
		}
		return promise;
	},
	/**
	 * 
	 * 
	 * @param {any} text 
	 * @param {any} [pageToken=undefined] 
	 * @returns 
	 */
	searchVideo(text, pageToken=undefined){
		return youtubeAPI.searchVideo(text, pageToken);
	}
}

export default youtubeService;