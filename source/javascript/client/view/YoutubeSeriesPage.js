'use strict'

define('YoutubeSeriesPage', ['react' , 'jquery' , 'YoutubeService',  'YoutubeSeriesManagement' , 'YoutubeItem' , 'YoutubeSearch' ] , function( React , $ , YoutubeService ,  YoutubeSeriesManagement , YoutubeItem , YoutubeSearch ){
    var YoutubeSeriesPage = React.createClass({
        getInitialState: function(){
			return { channel: null, series : YoutubeService.series , videoSelected : null , newSerie : '' , previewVideos : [] , previewTitle : ''}
        },
        componentDidMount: function(){
            $('#previewVideosModal').modal();
        },
        componentWillUnmount: function(){
            YoutubeService.saveSeries(this.state.series);
        },
        selectVideoOfChannel: function(video){
            this.setState({videoSelected: video , newSerie : video.title});
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
            this.setState({ videoSelected : null , channel : { name :this.state.series[channelId].title , id : channelId , thumbnail : '../assets/loading.gif' } , newSerie : '' });
            this.loadChannel(channelId);
        },
        unselectChannel: function(){
            this.setState({ videoSelected : null , channel : null , newSerie : '' });
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
        addSerie: function(){
            var allSeries = this.state.series;
            var subscription = allSeries[this.state.channel.id];
            if(subscription){
                subscription.series.push({title : this.state.newSerie})
            }else{
                allSeries[this.state.channel.id] = {
                    channel : this.state.channel.name,
                    series : [{title : this.state.newSerie}]
                }
            }
            this.setState({newSerie : '', series : allSeries});
        },
        nameSerie: function(event){
            this.setState({newSerie: event.target.value});
        },
        removeSerie: function(index){
            var allSeries = this.state.series;
            allSeries[this.state.channel.id].series.splice(index,1);
            this.setState({series: allSeries});
        },
        renameSerie: function(index , title ){
            var allSeries = this.state.series;
            allSeries[this.state.channel.id].series[index].title = title;
            this.setState({series: allSeries});
        },
        previewSerie: function(title){
            if(this.state.channel.videos){
                var videos = this.state.channel.videos
                var sameTitle = function( element, index , array){
                    return element.title.toLowerCase().indexOf(title.toLowerCase()) != -1
                }
                var filteredVideos = videos.filter(sameTitle);
                $('#previewVideosModal').modal();
                this.setState({previewVideos : filteredVideos , previewTitle : title});
            }
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
            var series = Object.keys(this.state.series).map(function(key){
                return(
                    <button key={key} onClick={()=>this.selectChannel(key) } >
                        {this.state.series[key].channel}
                    </button>
                )
            }, this);
            var previewVideos = this.state.previewVideos.map(function(item, index){
                return(
                    <div key={item.id} className="VideoPreview">
                        <YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} />
                    </div>
                )
            }, this)
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
                                {this.state.videoSelected?
                                    <div className="VideoSelected" >
                                        Video Selected
                                        <YoutubeItem title={this.state.videoSelected.title} author={this.state.videoSelected.author} length={this.state.videoSelected.length} description={this.state.videoSelected.description} thumbnail={this.state.videoSelected.thumbnail} />
                                    </div>
                                :
                                    null
                                }
                                <div className="VideosList" >
                                    Last Videos
                                    {videos}
                                </div>
                            </div>
                            <YoutubeSeriesManagement series={this.state.series[this.state.channel.id]?this.state.series[this.state.channel.id].series:[]} newSerie={this.state.newSerie} addSerie={this.addSerie} renameSerie={this.renameSerie} removeSerie={this.removeSerie} previewSerie={this.previewSerie} nameSerie={this.nameSerie} />
                            <div className="modal fade" id="previewVideosModal" tabIndex="-1" role="dialog" aria-labelledby="previewVideosModalLabel">
                              <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"> &times; </span></button>
                                    <h4 className="modal-title" id="previewVideosModalLabel">'{this.state.previewTitle}' search on last 16 videos</h4>
                                  </div>
                                  <div className="modal-body" >
                                    {previewVideos}
                                  </div>
                                  <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                  </div>
                                </div>
                              </div>
                            </div>
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