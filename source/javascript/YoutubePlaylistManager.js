'use strict'

define('YoutubePlaylistManager', [ 'react' , 'Youtube' , 'YoutubeItem' , 'YoutubePlayList' ] , function( React, Youtube , YoutubeItem , YoutubePlayList ){
	var YoutubePlaylistManager = React.createClass({
		getInitialState: function(){
			return {videos : [], initialLoad : false , loading : false, playlist : [], erroURL: false, filteredVideos: [], filterIndex: 0, filter: ''}
		},
		submitURL: function(event){
			var self = this;
			var match = this.refs.inputURL.value.match(/list=[^&]+/);
			if(match){
				this.setState({erroURL : false})
				console.log("URL válida");
				var id = match[0].slice(5);
				this.setState({initialLoad : true, loading : true});
				Youtube.loadFullPlaylist(id).then(function(result){
					self.setState({videos : result.videos, initialLoad : false, total : result.total});
				});
				Youtube.Playlist.then(function(videos){
					console.log('loaded playlist');
					videos.splice(0,50);
					var allVideos = self.state.videos.concat(videos);
					self.setState({videos : allVideos , loading : false});
				});
			}else{
				this.setState({erroURL : true})
			}
			event.preventDefault();
			this.refs.inputURL.focus();
		},
		add: function(item){
			var playlist = this.state.playlist;
			if(playlist.indexOf(item) == -1){
				playlist.push(item);
			}
			this.setState({ playlist : playlist});
		},
		addBefore: function(index){
			var playlist = this.state.playlist;
			var videos = this.state.videos.slice(0,index+1);
			videos.reverse();
			videos.forEach(this.add);
			this.setState({ playlist : playlist});
		},
		addAfter: function(index){
			var playlist = this.state.playlist;
			var videos = this.state.videos.slice(index);
			videos.forEach(this.add);
			this.setState({ playlist : playlist});
		},
		removeVideoPlaylist: function(index){
			var playlist = this.state.playlist;
			playlist.splice(index, 1);
			this.setState({ playlist : playlist});
		},
		remove: function(index){
			var videos = this.state.videos;
			videos.splice(index, 1);
			this.setState({ videos : videos });
		},
		removeAll: function(){
			var playlist = this.state.playlist;
			playlist.splice(0, playlist.length);
			this.setState({playlist : playlist});
		},
		invert: function(){
			var videos = this.state.videos;
			videos.reverse();
			this.setState({ videos : videos});
		},
		search: function(event){
			var value = event.target[0].value;
			event.preventDefault();
			if(event.target[0].value.trim() !== ''){
				if(this.state.videosFilter !== value){
					var filteredVideos = this.state.videos.filter(function(item, index){
						return item.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
					});
					var filterIndex = 0;
					if(filteredVideos.length <= 0){
						filterIndex = -1;
					}else{
						$(".Item[data-reactid$="+filteredVideos[filterIndex].id+"]")[0].scrollIntoView()
					}
					this.setState({ videosFilter: value , filteredVideos: filteredVideos , filterIndex : filterIndex });
				}else{
					if(this.state.filteredVideos){
						var filterIndex = this.state.filterIndex + 1;
						if(filterIndex >= this.state.filteredVideos.length){
							filterIndex = -1;
						}else{
							$(".Item[data-reactid$="+this.state.filteredVideos[filterIndex].id+"]")[0].scrollIntoView();
						}
						this.setState({ filterIndex : filterIndex });
					}
				}
			}
			//$('.Item:nth-child(40)')[0].scrollIntoView()
		},
		render: function(){
			var videos = this.state.videos.map(function(item, index){
				return(
				<div key={item.id} className={(this.state.playlist.indexOf(item) != -1? 'ItemSelected' : 'Item')} >
					<div className="ItemButtons">
						<button type="button" onClick={()=>this.addBefore(index)} >
							<span className="glyphicon glyphicon-open" aria-hidden="true"></span>
						</button>
						<button type="button" onClick={()=>this.add(item)} className="ItemButton" >
							<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
						</button>
						<button type="button" onClick={()=>this.remove(index)} className="ItemButton" >
							<span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
						</button>
						<button type="button" onClick={()=>this.addAfter(index)} className="ItemButton" >
							<span className="glyphicon glyphicon-open Rotate" aria-hidden="true"></span>
						</button>
					</div>
					<YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} />
				</div>
				)
			}, this);
			return (
				<div className="YoutubePlaylistManager" >
					<button type="button" onClick={()=>this.props.back(this.state.playlist, true)} >
						<span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
					</button>
					<form onSubmit={(event)=>this.submitURL(event)} className="PlaylistForm" >
						<div className="Flex">
							<label className="PlaylistLabel">
								<span className="VerticalText" > URL: </span>
								<input ref="inputURL" className={'PlaylistInput'+ ' ' + (this.state.erroURL? 'Error' : '')} disabled={this.state.loading} autoFocus='true' />
							</label>
							<button type="submit" className="PlaylistButton" > Send </button>
						</div>
					</form>
					{this.state.initialLoad ?
						(
						<div>
							LOADING! <img src="../assets/loading.gif" style={{ width : '1em' }}/>
						</div>
						)
						:
						null
					}
					{this.state.videos.length !== 0 ? 
						(
						<div className="Content" >
							<div className="Result" >
								<div className="ItemsOptions" >
									<button type="button" onClick={()=>this.addAfter(0)} disabled={this.state.loading} className={this.state.loading? 'Disabled' : ''} >
										<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
										<span className="TextAfterIcon" > Add all </span>
									</button>
									<button type="button" onClick={()=>this.invert()} disabled={this.state.loading} className={'ItemsOption' + ' ' + (this.state.loading? 'Disabled' : '')} >
										<span className="glyphicon glyphicon-sort" aria-hidden="true"></span>
										<span className="TextAfterIcon" > Reverse </span>
									</button>
									<form onSubmit={(event)=>this.search(event)} className='ItemsOption Inline' >
										<input className={(this.state.loading? 'Disabled' : '')} placeholder='Search' />
									</form>
									<span className='ItemsOption' > {this.state.playlist.length} - {this.state.videos.length} </span>
									{
									this.state.loading ? 
										<span className='ItemsOption' >( total {this.state.total} ) <img src='../assets/loading.gif' /></span>
									:
										null
									}
								</div>
								<div className="Items" >
									{videos}
								</div>
							</div>
							{ this.state.playlist.length != 0 ?
								<div className="Playlist" >
									<button type="button" onClick={()=>this.removeAll()} >
										<span className="glyphicon glyphicon-minus" aria-hidden="true" ></span>
										<span className="TextAfterIcon"> Remove All </span>
									</button>
									<YoutubePlayList videos={this.state.playlist} removeVideoPlaylist={this.removeVideoPlaylist} />
								</div>
							:
								null
							}
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