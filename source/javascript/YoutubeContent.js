'use strict'

define('YoutubeContent', [ 'react' , 'jquery' , 'Youtube' , 'Navigation' , 'YoutubeItem' , 'YoutubePlayList' , 'TopOptions' ] , function( React , $ , Youtube , Navigation , YoutubeItem , YoutubePlayList , TopOptions ){
	var YoutubeContent = React.createClass({
		// Middle click ou drag'n drop?? pensar na usabilidade
		getInitialState: function(){
			return ({videos: Youtube.subscriptionsVideos, playlist: this.props.playlist, search: false, first: 0 , selectedMenu : 'subscriptions' , authorized : Youtube.authorized});
		},
		addVideoToPlaylist: function(index, event){
			event.preventDefault();
			if(event.button == 0){
				var newPlaylist = this.state.playlist;
				var video = this.state.videos[index+this.state.first];
				if(newPlaylist.indexOf(video) === -1){
					newPlaylist.push(video);
				}else{
					console.log("repetido");
				}
				this.setState({playlist: newPlaylist});
			}
		},
		removeVideoPlaylist: function(index){
			var newPlaylist = this.state.playlist;
			newPlaylist.splice(index, 1);
			this.setState({playlist: newPlaylist});
		},
		componentDidMount: function(){
			$(document).on('keypress',this.showSearchField);
		},
		showSearchField: function(){
			if(!this.state.search){
				this.setState({search: true});
			}
		},
		componentWillUnmount: function(){
			$(document).off('keypress');
		},
		checkSearchField: function(event){
			if(event.target.value == ''){
				var self = this;
				if(!this.timeout){
					this.timeout = setTimeout(function(){
						self.setState({'search': false});
						self.timeout = undefined;
					}, 1500);
				}
			}else{
				if(this.timeout){
					clearTimeout(this.timeout);
					this.timeout = undefined;
				}
			}
		},
		play: function(){
			this.props.openPlayer(this.state.playlist);
		},
		doSearch: function(event){
			this.setState({loading: true});
			event.preventDefault();
			console.log(this.refs.searchInput.value);
			var result = Youtube.search(this.refs.searchInput.value);
			var self = this;
			result.then(function(videos){
				var newVideos = [];
				for(var v in videos){
					newVideos.push(videos[v]);
				}
				self.setState({videos: newVideos , first: 0 , selectedMenu: 'search' , loading: false});
			});
		},
		nextPage: function(event){
			if( (this.state.first + 16) < this.state.videos.length){
				this.setState({first: this.state.first + 16});
			}
		},
		previousPage: function(event){
			if( (this.state.first - 16) >= 0){
				this.setState({first: this.state.first - 16});
			}
		},
		changePosition: function(fromPosition, toPosition){
			var playlist = this.state.playlist;
			var element = playlist[fromPosition];
			playlist.splice(fromPosition, 1);
			var newPlaylist = playlist.slice(0, toPosition);
			newPlaylist.push(element);
			newPlaylist = newPlaylist.concat(playlist.slice(toPosition, playlist.length));
			this.setState({playlist: newPlaylist});
		},
		subscriptions: function(){
			var videos = Youtube.subscriptionsVideos;
			this.setState({videos: videos, first: 0, selectedMenu: 'subscriptions' , search: false});
		},
		top: function(regionCode){
			var promise = Youtube.categories(regionCode);
			var self = this;
			promise.then(function(response){
				self.setState({selectedMenu: regionCode , search: false , categories: response});
				self.changeCategory(0);
			});
		},
		changeCategory: function(id){
			this.setState({loading: true});
			var promise = Youtube.topList(this.state.selectedMenu , id);
			var self = this;
			promise.then(function(response){
				self.setState({videos: response, first: 0 , categorieId: id , loading : false});
			});
		},
		recommendations: function(){
			var videos = Youtube.recommendations;
			this.setState({videos: videos, first: 0 , selectedMenu: 'recommendations' , search: false});
		},
		search: function(){
			if(this.state.search){
				this.refs.searchInput.focus();
			}else{
				this.showSearchField();
			}
		},
		logIn: function(){
			var self = this;
			var after = function(){
				self.setState({authorized : Youtube.authorized});
			}
			Youtube.authorize(after);
		},
		render: function(){
			var videos = this.state.videos.slice( this.state.first , (this.state.first + 16) ).map(function(item, index){
				return(
				<div key={item.id} onClick={this.addVideoToPlaylist.bind(this, index)} style={{'border': '1px solid black', 'padding': '4px', 'width' : '50%', 'display': 'inline-block'}} >
					<YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} user={this.state.authorized} />
				</div>
				)
			}, this);
			return(
			<div className="YoutubeContent">
				{this.state.loading ? 
					<div className="Loading">
						<span>Loading...</span>
					</div>
					:
					null
				}
				<div style={{ flex : 1 , marginRight : '5px' }}>
					<Navigation selected={this.state.selectedMenu} subscriptions={ this.subscriptions } recommendations={ this.recommendations } logIn={ this.logIn } user={this.state.authorized} search={this.search} top={this.top}/>
					{this.state.search ?
						<form onSubmit={this.doSearch} style={{ marginBottom : '10px' }} className='input-group' >
							<span className='input-group-addon' onClick={this.doSearch} style={{ cursor : 'pointer' }} >
								<span className='glyphicon glyphicon-search' aria-hidden={true} />
							</span>
							<input className='form-control' ref="searchInput" autoFocus={true} onChange={this.checkSearchField} type="text" placeholder='Pesquisa' />
						</form>
					: null}
					{this.state.selectedMenu == 'US' || this.state.selectedMenu == 'BR' ? 
						<TopOptions options={this.state.categories} changeCategory={this.changeCategory} selectedId={this.state.categorieId} />
					:
						null
					}
					{videos}
					<div style={{position: 'relative'}} >
						<button type="button" onClick={this.previousPage}>
							<span className="glyphicon glyphicon-chevron-left" aria-hidden={true}></span>
							Previous Page
						</button>
						<button style={{position: 'absolute', right: '0px', bottom: '0px'}} type="button" onClick={this.nextPage}>
							Next Page
							<span className="glyphicon glyphicon-chevron-right" aria-hidden={true}></span>
						</button>
					</div>
				</div>
				<div className="side">
					<button onClick={this.play}>
						Play
						<span className="glyphicon glyphicon-play" aria-hidden={true}></span>
					</button>

					<YoutubePlayList videos={this.state.playlist} changePosition={this.changePosition} removeVideoPlaylist={this.removeVideoPlaylist} />
				</div>
			</div>
			)
		}
	});
	return YoutubeContent;
})