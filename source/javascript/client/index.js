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
		YoutubeService: './YoutubeService'
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
});

var apiOnLoad = function(){
    console.log('gapi load')
}

requirejs(['./app'], function(app) {
    console.log('app load');
})