'use strict'

define( 'YoutubePage' , [ 'react' , 'Youtube' , 'YoutubePlayer' , 'YoutubeContent' ] , function( React , Youtube , YoutubePlayer , YoutubeContent ){
	var YoutubePage = React.createClass({
		getInitialState: function(){
			return {player : false, videos: []};
		},
		openPlayer: function(videos){
			this.setState({player: true , videos: videos});
		},
		closePlayer: function(videos){
			Youtube.loadRecommendations();
			this.setState({player: false , videos: videos});
		},
		render: function(){
			return(
				<div className="YoutubePage">
					{this.state.player ?
						<div>
							<YoutubePlayer videos={this.state.videos} fimVideo={this.closePlayer}/>
						</div>
						:
						<div>
							<YoutubeContent openPlayer={this.openPlayer} playlist={this.state.videos} />
						</div>
					}
				</div>
			)
		}
	});
	return YoutubePage;
})