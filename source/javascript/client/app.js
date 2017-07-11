// requirejs.config({
//     //By default load any module IDs from js/lib
//     //baseUrl: '../build',
//     //except, if the module ID starts with "app",
//     //load it from the js/app directory. paths
//     //config is relative to the baseUrl, and
//     //never includes a ".js" extension since
//     //the paths config could be for a directory.
//     paths: {
//         react: './libs/react/react',
//         'react-dom': './libs/react/react-dom',
//         jquery: './libs/jquery/jquery',
//         bootstrap: './libs/bootstrap/bootstrap',
// 		config: './config',
// 		YoutubeService: './YoutubeService'
//     },
//     shim : {
//         "bootstrap" : { "deps" :['jquery'] }
//     },
// });

// // Start the main app logic.
// requirejs([ 'react' , 'react-dom' , 'bootstrap' , 'config' , 'YoutubeService' , 'YoutubePlayer' , 'Loading' , 'Erro' , 'YoutubePage' ],
// 	function   ( React , ReactDOM , bootstrap , config , YoutubeService , YoutubePlayer , Loading , Erro , YoutubePage ) {
// 		//Garantir a API 100% carregada apenas para renderizar a aplicação e não para carregar
// 		//Garantir a API do frame carregada
// 		var p = Promise.all([YoutubePlayer.loading,YoutubeService.loading])
// 		ReactDOM.render(
// 				<Loading />, document.getElementById('content')
// 			);
// 		p.then(function(){
// 			console.log('pronto para o "APP"');
// 			ReactDOM.render(
// 				<YoutubePage />, document.getElementById('content')
// 				);
// 		});
// 		p.catch(function(){
// 			console.log('erro ao carregar');
// 			ReactDOM.render(
// 				<Erro />, document.getElementById('content')
// 				);
// 		});
// 	}
// );

// requirejs.config({
// 	baseUrl: '/javascript'
// })

import ReactDOM from 'react-dom';
import React from 'react';

import LoadingErrorPage from 'view/page/loading-error-page';
import LoadingPage from 'view/page/loading-page';
import PlayerPage from 'view/page/player-page';

import Video from 'structure/Video';

ReactDOM.render(<LoadingPage/>, document.getElementById('content'))

const app = {
	apiLoaded() {
		console.log('all loaded');
		const video = new Video(
			'12mq4jNDKZQ',
			'Calculated Dong',
			'',
			'https://i.ytimg.com/vi/12mq4jNDKZQ/default.jpg',
			'AdmiralBulldog',
			'UCk8ZIMJxSO9-pUg7xyrnaFQ',
			new Date('2016-03-14T16:32:41.000Z')
		)
		const videos = [
			video
		];
		ReactDOM.render(<PlayerPage videos={videos} />, document.getElementById('content'));
	},
	apiErrorLoaded() {
		ReactDOM.render(<LoadingErrorPage/>, document.getElementById('content'))
	}
}

export default app;