'use strict'

define('YoutubeSeriesPage', ['react' , 'YoutubeService',  'YoutubeSeriesManagement' , 'YoutubeItem' , 'YoutubeSearch' ] , function( React , YoutubeService ,  YoutubeSeriesManagement , YoutubeItem , YoutubeSearch ){
    var YoutubeSeriesPage = React.createClass({
        getInitialState: function(){
			return { selected : null , channel: null }
        },
        selectVideoOfChannel: function(video){
            this.setState({selected: video , title : video.title});
        },
        selectVideoOfSearch: function(video){
            this.selectVideoOfChannel(video);
            if(!this.state.channel || video.authorId !== this.state.channel.id){
                this.loadChannel(video.authorId);
                this.setState({ channel: { name : video.author , id : video.authorId , thumbnail : '../assets/loading.gif' } });
            }
        },
        selectChannel: function(channelId){
            this.refs.YoutubeSearch.hideVideos(true);
            this.setState({ selected : null , channel : { name : YoutubeService.series[channelId].title , id : channelId , thumbnail : '../assets/loading.gif' } , title : null });
            this.loadChannel(channelId);
        },
        unselectChannel: function(){
            this.setState({ selected : null , channel : null , title : null });
        },
        loadChannel: function(channelId){
            var promise = YoutubeService.loadChannel(channelId , true);
            promise.then(function(response){
                if(response.erro){
                    console.log(response.erro);
                }else{
                    if(response.channel){
                        if(this.isMounted()){
                            this.setState({ channel : response.channel });
                        }
                    }else{
                        console.log("canal não encontrado/carregado");
                    }
                }
            }.bind(this));
        },
        render: function(){
            var videos = <div> <span>Loading... <img src="../assets/loading.gif" style={{ width : '1em' }}/></span> </div>
            if(this.state.channel && this.state.channel.videos ){
                videos = this.state.channel.videos.map(function(item, index){
    				return(
    					<div key={item.id} className="Video" onClick={()=>this.selectVideoOfChannel(item)}>
    						<YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} />
    					</div>
    				)
    			}, this);
            }
            var series = Object.keys(YoutubeService.series).map(function(key){
                return(
                    <button key={key} onClick={()=>this.selectChannel(key) } >
                        {YoutubeService.series[key].channel}
                    </button>
                )
            }, this);
            return(
                <div className="YoutubeSeriesPage" >
                    <div>
                        <button onClick={()=>this.props.back()} >
							<span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
						</button>
                        <div className="Series" >
                            {series}
                        </div>
                    </div>
                    <div>
                        <YoutubeSearch ref="YoutubeSearch" unselectChannel={this.unselectChannel} selectVideo={this.selectVideoOfSearch} />
                    </div>
                    {this.state.channel ? 
                        <div className="Selected" >
                            <div className="Channel" >
                                <img src={this.state.channel.thumbnail} className="Image" />
                                <h4> {this.state.channel.name} </h4>
                                {this.state.channel.description}
                            </div>
                            <div className="Videos" >
                                {this.state.selected?
                                    <div className="VideoSelected" >
                                        Video Selected
                                        <YoutubeItem title={this.state.selected.title} author={this.state.selected.author} length={this.state.selected.length} description={this.state.selected.description} thumbnail={this.state.selected.thumbnail} />
                                    </div>
                                :
                                    null
                                }
                                <div className="VideosList" >
                                    Last Videos
                                    {videos}
                                </div>
                            </div>
                            <YoutubeSeriesManagement channel={this.state.channel} title={this.state.title} />
                        </div>
                    :
                        null
                    }
                    
                </div>
            )
        }
    })
    return YoutubeSeriesPage
})