requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '../build',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        react: '../node_modules/react/dist/react',
        'react-dom': '../node_modules/react-dom/dist/react-dom',
        jquery: '../node_modules/jquery/dist/jquery',
        bootstrap: '../node_modules/bootstrap/dist/js/bootstrap',
		config: '../config'
    },
    shim : {
        "bootstrap" : { "deps" :['jquery'] }
    },
});

// Start the main app logic.
requirejs([ 'react' , 'react-dom' , 'bootstrap' , 'config' , 'Youtube' , 'YoutubePlayer' , 'Loading' , 'Erro' , 'YoutubePage' ],
	function   ( React , ReactDOM , bootstrap , config , Youtube , YoutubePlayer , Loading , Erro , YoutubePage ) {
		//Garantir a API 100% carregada apenas para renderizar a aplicação e não para carregar
		//Garantir a API do frame carregada
		var p = Promise.all([YoutubePlayer.loading,Youtube.loading])
		ReactDOM.render(
				<Loading />, document.getElementById('content')
			);
		p.then(function(){
			console.log('pronto para o "APP"');
			ReactDOM.render(
				<YoutubePage />, document.getElementById('content')
				);
		});
		p.catch(function(){
			console.log('erro ao carregar');
			ReactDOM.render(
				<Erro />, document.getElementById('content')
				);
		});
	}
);