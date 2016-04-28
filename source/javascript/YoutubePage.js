'use strict'

define( 'YoutubePage' , [ 'react' , 'Youtube' , 'YoutubePlayer' , 'YoutubeContent' , 'YoutubePlaylistManager' ] , function( React , Youtube , YoutubePlayer , YoutubeContent , YoutubePlaylistManager ){
	var YoutubePage = React.createClass({
		getInitialState: function(){
			return {component : '', videos: []};
		},
		openPlayer: function(videos){
			this.setState({component: 'player' , videos: videos});
		},
		base: function(videos){
			//Youtube.loadRecommendations();
			if(!videos){
				videos = this.state.videos;
			}else{
				var original = this.state.videos;
				var add = function(item){
					if(!original.some(function(item2){return item.id == item2.id})){
						original.push(item);
					}
				}
				videos.forEach(add);
				videos = original;
			}
			this.setState({component: '' , videos: videos});
		},
		addPlaylist: function(){
			this.setState({component: 'addPlaylist'});
		},
		chooseComponent: function(){
			switch(this.state.component){
				case 'player': return <YoutubePlayer videos={this.state.videos} fimVideo={this.base}/>
				case 'addPlaylist': return <YoutubePlaylistManager back={this.base} />
				default: return <YoutubeContent openPlayer={this.openPlayer} playlist={this.state.videos} addPlaylist={this.addPlaylist} />
			};
		},
		render: function(){
			var component = this.chooseComponent();
			return(
				<div className="YoutubePage">
					{component}
				</div>
			)
		}
	});
	return YoutubePage;
})