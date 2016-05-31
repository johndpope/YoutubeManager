/*var onYouTubeIframeAPIReady = function(){
	console.log('carregou frame api');
}*/
var onYouTubeIframeAPIReady;
/*
State para representar o vídeo em execução
*/ 
define('YoutubePlayer' , ['react' , 'https://www.youtube.com/iframe_api' , 'YoutubePlayList' ] , function( React , k , YoutubePlayList ){
	onYouTubeIframeAPIReady = function(){
		finishLoading();
		console.log('Youtube frame API loaded');
	};
	var YoutubePlayer = React.createClass({
		propTypes: {
			videos: React.PropTypes.arrayOf(React.PropTypes.shape({
				id: React.PropTypes.string.isRequired
			})).isRequired
		},
		getInitialState: function(){
			return ({playing: {index: 0, id: this.props.videos[0].id}});
		},
		componentDidMount: function(){
			this.player = new YT.Player('player', {
				height: '720',
				width: '1280',
				videoId: this.state.playing.id,
				events: {
					'onReady': function(event){
						event.target.setPlaybackQuality('hd720');
						event.target.setPlaybackQuality('hd1080');
						event.target.playVideo();
					},
					'onStateChange': this.fim
				}
			});
		},
		componentWillUnmount: function(){
			this.player.destroy();
		},
		teste: function(){
			this.setState({'loaded': true})
			console.log(this.player);
			this.player.addEventListener('onStateChange', this.fim);
			this.player.loadVideoById({videoId: 'YU4sYcb9yME', startSeconds: 50, suggestedQuality: 'hd1080'});
		},
		fim: function(event){
			if ( event.data == YT.PlayerState.ENDED){
				console.log("fim");
				var proximo = this.state.playing.index + 1;
				if(this.props.videos[proximo]){
					this.player.loadVideoById({videoId: this.props.videos[proximo].id, suggestedQuality: 'hd1080'})
					this.setState({playing: {index: proximo, id: this.props.videos[proximo].id}});
					//this.updatePlaying ??
				}else{
					this.props.fimVideo([]);
				}
			}else{
				console.log(event.data);
			}
		},
		playVideo: function(){
			this.player.playVideo();
		},
		changeVideo: function(event, index){
			this.player.loadVideoById({videoId: this.props.videos[index].id, suggestedQuality: 'hd1080'})
			this.setState({playing: {index: index, id: this.props.videos[index].id}});
		},
		render: function(){
			return(
			<div>
				<div onClick={()=>this.props.fimVideo(this.props.videos.slice(this.state.playing.index + 1, this.props.videos.length))} >
					Close
					<span className="glyphicon glyphicon-remove" aria-hidden={true}></span>
				</div>
				<div className="YoutubePlayer">
					<div id="player">
					</div>
				</div>
				<div>
					<YoutubePlayList videos={this.props.videos} horizontal={true} highlightIndex={this.state.playing.index} click={this.changeVideo} />
				</div>
			</div>
			)
		}

	});
		
	var finishLoading;
	YoutubePlayer.loading = new Promise(function(resolve, reject){
		finishLoading = resolve;
	})
	return YoutubePlayer;
});