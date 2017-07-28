import ReactDOM from 'react-dom';
import React from 'react';

import LoadingErrorPage from 'view/page/loading-error-page';
import LoadingPage from 'view/page/loading-page';
import PlayerPage from 'view/page/player-page';
import SubscriptionsVideosPage from 'view/page/subscriptions-videos-page';

import Video from 'structure/Video';

ReactDOM.render(<LoadingPage/>, document.getElementById('content'))

const app = {
	apiLoaded() {
		ReactDOM.render(<SubscriptionsVideosPage />, document.getElementById('content'));
	},
	apiErrorLoaded() {
		ReactDOM.render(<LoadingErrorPage/>, document.getElementById('content'))
	},
	/**
	 * 
	 * 
	 * @param {Video[]} videos 
	 */
	playVideos(videos) {
		ReactDOM.render(<PlayerPage videos={videos} />, document.getElementById('content'));
	},
	/**
	 * 
	 * 
	 * @param {Video[]} videos 
	 */
	stopPlaying(videos){
		ReactDOM.render(<SubscriptionsVideosPage videoList={videos} />, document.getElementById('content'));
	}
}

export { app };