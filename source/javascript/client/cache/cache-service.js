const cacheMaps = new Map();

const cacheService = {
	type: {
		categories: 'categories',
		channel: 'channel',
		channelListId: 'channelListId',
		playlist: 'playlist',
		topPlaylist: 'topPlaylist',
	},
	/**
	 * 
	 * 
	 * @param {any} type 
	 * @param {any} key 
	 * @param {any} item 
	 */
	save(type, key, item) {
		//TODO add paremeter validation
		var typeMap = cacheMaps.get(type);
		if(typeMap == undefined) {
			typeMap = new Map();
			cacheMaps.set(type, typeMap);
		}
		typeMap.set(key, item);
	},
	/**
	 * 
	 * 
	 * @param {any} type 
	 * @param {any} key 
	 * @returns 
	 */
	load(type, key) {
		//TODO add paremeter validation
		var value;
		var typeMap = cacheMaps.get(type);
		if(typeMap == undefined) {
			value = undefined;
		}else {
			value = typeMap.get(key);
		}
		return value;
	},
	/**
	 * 
	 * 
	 * @param {any} [type=undefined] 
	 * @param {any} [key=undefined] 
	 */
	clear(type=undefined, key=undefined) {
		//TODO add paremeter validation
		if(type == undefined){
			cacheMaps.clear();
		}else {
			var typeMap = cacheMaps.get(type);
			if(typeMap != undefined) {
				if(key == undefined) {
					typeMap.clear();
				}else {
					typeMap.delete(key);
				}
			}
		}
	}
}

export default cacheService;