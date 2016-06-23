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
					'onStateChange': this.videoStateChange
				}
			});
			$(document).on('keydown',this.keyboardControl);
			$(document).on('wheel',this.wheelControl);
		},
		componentWillUnmount: function(){
			this.player.destroy();
			$(document).off('keydown');
			$(document).off('wheel');
		},
		videoStateChange: function(event){
			/* Fim do Vídeo */
			if ( event.data == YT.PlayerState.ENDED){
				var proximo = this.state.playing.index + 1;
				if(this.props.videos[proximo]){
					this.player.loadVideoById({videoId: this.props.videos[proximo].id, suggestedQuality: 'hd1080'})
					this.setState({playing: {index: proximo, id: this.props.videos[proximo].id}});
				}else{
					this.props.fimVideo([]);
				}
			}
		},
		changeVideo: function(event, index){
			this.player.loadVideoById({videoId: this.props.videos[index].id, suggestedQuality: 'hd1080'})
			this.setState({playing: {index: index, id: this.props.videos[index].id}});
		},
		keyboardControl: function(event){
			var keyCode = event.keyCode
			switch(keyCode){
				/* Arrow Left */
				case 37:
					/* Previous Video */
					var index = this.state.playing.index;
					if(index - 1 >= 0){
						this.changeVideo(event, index - 1);
					}
					break;
				/* Arrow Right */
				case 39:
					/* Next Video */
					var index = this.state.playing.index;
					if(index + 1 < this.props.videos.length ){
						this.changeVideo(event, index + 1);
					}
					break;
				/* Space */
				case 32:
					/* Pause Video */
					if( this.player.getPlayerState() == YT.PlayerState.PAUSED){
						this.player.playVideo();
					}else if( this.player.getPlayerState() == YT.PlayerState.PLAYING){
						this.player.pauseVideo();
					}
					break;
				/* BackSpace */
				case 8:
					/* Exit page */
					event.preventDefault();
					this.props.fimVideo(this.props.videos.slice(this.state.playing.index + 1, this.props.videos.length))
					break;
			}
		},
		wheelControl: function(event){
			var deltaY = event.originalEvent.wheelDeltaY;
			if(deltaY > 0){
				this.player.setVolume(this.player.getVolume() + 10);
			}else if(deltaY < 0){
				this.player.setVolume(this.player.getVolume() - 10)
			}
		},
		render: function(){
			return(
			<div>
				<button onClick={()=>this.props.fimVideo(this.props.videos.slice(this.state.playing.index + 1, this.props.videos.length))} >
					<span className="glyphicon glyphicon-remove" aria-hidden={true}></span>
					<span className="TextAfterIcon">Close</span>
				</button>
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