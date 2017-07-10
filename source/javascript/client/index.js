requirejs.config({
    //By default load any module IDs from js/lib
    //baseUrl: '../build',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        react: './libs/react/react',
        'react-dom': './libs/react/react-dom',
        jquery: './libs/jquery/jquery',
        bootstrap: './libs/bootstrap/bootstrap',
		config: './config',
		//youtubeService: './youtube/youtube-service',
        //SeriesService: './series/series-service'
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
});

var apiOnLoad = function(){
	console.log('gapi load');
	gapi.client.load('youtube', 'v3').then(function(){
		//require('youtube/youtube-service').getChannel('22');
		require('./app').default.apiLoaded();
	});
};

var onYouTubeIframeAPIReady= function() {
	console.log('Youtube frame API loaded');
}

requirejs(['https://apis.google.com/js/client.js?onload=apiOnLoad', 'https://www.youtube.com/iframe_api', './app'], function(gapi, app) {
	console.log('app load');
})