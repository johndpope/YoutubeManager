'use strict'

define('YoutubePlaylistManager', [ 'react' , 'Youtube' , 'YoutubeItem' , 'YoutubePlayList' ] , function( React, Youtube , YoutubeItem , YoutubePlayList ){
	var YoutubePlaylistManager = React.createClass({
		getInitialState: function(){
			return {videos : [], initialLoad : false , loading : false, playlist : []}
		},
		submit: function(event){
			var self = this;
			console.log(this.refs.inputURL.value);
			var match = this.refs.inputURL.value.match(/list=[^&]+/);
			match = ['list=PL8mG-RkN2uTw7PhlnAr4pZZz2QubIbujH']
			if(match){
				console.log("URL válida");
				var id = match[0].slice(5);
				this.setState({initialLoad : true, loading : true});
				Youtube.loadFullPlaylist(id).then(function(result){
					self.setState({videos : result.videos, initialLoad : false, total : result.total});
				});
				Youtube.Playlist.then(function(videos){
					console.log('loaded playlist');
					console.log(videos);
					videos.splice(0,50);
					var allVideos = self.state.videos.concat(videos);
					self.setState({videos : allVideos , loading : false});
				});
			}
			event.preventDefault();
		},
		add: function(index){
			var playlist = this.state.playlist;
			playlist.push(this.state.videos[index]);
			this.setState({ playlist : playlist});
		},
		addAfter: function(index){
			var playlist = this.state.playlist;
			var videos = this.state.videos.slice(index);
			playlist = playlist.concat(videos);
			this.setState({ playlist : playlist});
		},
		remove: function(index){
			var videos = this.state.videos;
			videos.splice(index, 1);
			this.setState({ videos : videos });
		},
		invert: function(){
			var videos = this.state.videos;
			videos.reverse();
			this.setState({ videos : videos});
		},
		render: function(){
			var videos = this.state.videos.map(function(item, index){
				return(
				<div key={item.id} style={{ marginBottom: '10px' , padding: '5px' , border: (this.state.playlist.indexOf(item) != -1? '2px gold solid' : '2px darkred solid')}} className="flex" >
					<div style={{ marginRight: '2px' }} >
						<button type="button" onClick={()=>this.add(index)} style={{ marginBottom: '6px'}} >
							<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
						</button>
						<button type="button" onClick={()=>this.remove(index)} style={{ marginBottom: '6px'}} >
							<span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
						</button>
						<button type="button" onClick={()=>this.addAfter(index)} >
							<span className="glyphicon glyphicon-sort-by-attributes-alt" aria-hidden="true"></span>
						</button>
					</div>
					<YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} />
				</div>
				)
			}, this);
			return (
				<div>
					<button type="button" onClick={()=>this.props.back()} style={{ marginBottom: '15px'}} >
						<span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
					</button>
					<form onSubmit={(event)=>this.submit(event)} className="" style={{ marginBottom: '10px'}} >
						<div className="flex">
							<label style={{flex: 1, display: 'inline-flex', marginRight: '5px'}} className="">
								URL:
								<input ref="inputURL" className="" style={{flex: 1, marginLeft: '5px'}} disabled={this.state.loading} />
									{/*success outline CSS */}
							</label>
							<input type="submit" style={{marginBottom: '5px'}} />
						</div>
					</form>
					{this.state.initialLoad ?
						(
						<div>
							LOADING!
						</div>
						)
						:
						null
					}
					{this.state.videos.length !== 0 ? 
						(
						<div>
							<div style={{ marginBottom : '15px' }} >
								<button type="button" onClick={()=>this.addAfter(0)} style={{ marginRight : '5px' }} >
									<span className="glyphicon glyphicon-plus" aria-hidden="true" style={{ marginRight : '2px' }} ></span>
									Adicionar Todos
								</button>
								<button type="button" onClick={()=>this.invert()} style={{ marginRight : '5px' }} >
									<span className="glyphicon glyphicon-sort" aria-hidden="true" style={{ marginRight : '2px' }} ></span>
									Inverter
								</button>
								<span> {this.state.playlist.length} - {this.state.videos.length} </span>
								{
								this.state.loading ? 
									<span>( {this.state.total} ) loading </span>
								:
									null
								}
							</div>
							<div style={{ display : 'flex' }} >
								<div style={{ overflowY : 'auto' , maxHeight : '82vh' , flex : 1 }} >
									{videos}
								</div>
								<div style={{ overflowY : 'auto' , maxHeight : '82vh' , textAlign : 'center' }}>
									<YoutubePlayList videos={this.state.playlist} />
								</div>
							</div>
						</div>
						)
						:
						null
					}
				</div>
			)
		}
	});
	return YoutubePlaylistManager;
});