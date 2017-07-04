import youtubeAPI from './youtube-api';
import cacheService from 'cache/cache-service';
import config from 'config';

const youtubeService = {
	/**
	 * 
	 * 
	 * @param {any} channelId 
	 * @returns 
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
	 * 
	 * 
	 * @param {any} channelId 
	 * @returns 
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
	 * 
	 * 
	 * @returns 
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
	 * 
	 * 
	 * @param {any} channelId 
	 * @param {any} [pageToken=undefined] 
	 * @returns 
	 */
	listChannelUploads(channelId, pageToken=undefined) {
		const uploadPlaylistId = "UU".concat(channelId.slice(2))
		return this.getPlaylist(uploadPlaylistId, pageToken);
	},
	/**
	 * 
	 * 
	 * @returns 
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
	 * 
	 * 
	 * @param {any} playlistId 
	 * @param {any} [pageToken=undefined] 
	 * @returns 
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
	}
}

export default youtubeService;