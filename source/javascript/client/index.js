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

var resolveGApiPromise;
var rejectGApiPromise;
var gapiPromise = new Promise(function(resolve,reject){
	resolveGApiPromise = resolve;
	rejectGApiPromise = reject;
});

var apiOnLoad = function(){
	console.log('gapi loaded');
	gapi.client.setApiKey(require('config').apiKey);
	gapi.client.load('youtube', 'v3').then(function(){
		console.log('gapi youtube loaded');
		resolveGApiPromise();
	});
};

var resolveYoutubeIframePromise;
var rejectYoutubeIframePromise;
var youtubeIframePromise = new Promise(function(resolve,reject){
	resolveYoutubeIframePromise = resolve;
	rejectYoutubeIframePromise = reject;
});

var onYouTubeIframeAPIReady = function() {
	console.log('Youtube frame API loaded');
	resolveYoutubeIframePromise();
}

Promise.all([gapiPromise,youtubeIframePromise]).then(function(){
	require('app').default.apiLoaded();
}).catch(function(e){
	console.log('error');
	console.log(e);
	require('app').default.apiErrorLoaded();
});

requirejs(['https://apis.google.com/js/client.js?onload=apiOnLoad', 'https://www.youtube.com/iframe_api', './app'], function(gapi, YT, app) {
	console.log('app load');
})