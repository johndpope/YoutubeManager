'use strict'

define('YoutubeSeriesPage', ['react' , 'Youtube',  'YoutubeSeriesManagement' , 'YoutubeItem' , 'YoutubeSearch' ] , function( React , Youtube ,  YoutubeSeriesManagement , YoutubeItem , YoutubeSearch ){
    var YoutubeSeriesPage = React.createClass({
        getInitialState: function(){
            var arrayVideos = [{"id":"TLFfYHUb9Ps","title":"Dangerous Woman - Ariana Grande (Rock Cover Music Video by TeraBrite)","description":"","uploadDate":"2016-03-14T17:15:35.000Z","thumnail":"https://i.ytimg.com/vi/TLFfYHUb9Ps/default.jpg","author":"TeraBrite","authorId":"UCvq0BbsWrF0OP4q_q2X1M3w"},{"id":"12mq4jNDKZQ","title":"Calculated Dong","description":"","uploadDate":"2016-03-14T16:32:41.000Z","thumnail":"https://i.ytimg.com/vi/12mq4jNDKZQ/default.jpg","author":"AdmiralBulldog","authorId":"UCk8ZIMJxSO9-pUg7xyrnaFQ"},{"id":"EoVEQireZJM","title":"Aprendendo a andar de patins #SouLuna | Gabbie Fadel","description":"","uploadDate":"2016-03-14T18:00:00.000Z","thumnail":"https://i.ytimg.com/vi/EoVEQireZJM/default.jpg","author":"Gabbie Fadel","authorId":"UCS9K27KW782vvAwTHJpVePQ"}];
            var videoSelected = null;
            var channel = { id : 'UCk8ZIMJxSO9-pUg7xyrnaFQ' ,  name: 'linus' , description: 'describe' , thumbnail : 'https://yt3.ggpht.com/-QGhAvSy7npM/AAAAAAAAAAI/AAAAAAAAAAA/Uom6Bs6gR9Y/s100-c-k-no-rj-c0xffffff/photo.jpg' }
			return { selected : null , channel: null }
        },
        back: function(){
            this.props.back();
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
            this.setState({ selected : null , channel : { name : Youtube.series[channelId].title , id : channelId , thumbnail : '../assets/loading.gif' }});
            this.loadChannel(channelId);
        },
        unselectChannel: function(){
            this.setState({ selected : null , channel : null });
        },
        loadChannel: function(channelId){
            var self = this;
            var promise = Youtube.loadChannel(channelId , true);
            promise.then(function(response){
                if(response.erro){
                    console.log(response.erro);
                }else{
                    if(response.channel){
                        self.setState({ channel : response.channel });
                    }else{
                        console.log("canal não encontrado/carregado");
                    }
                }
            });
        },
        render: function(){
            var boxStyle = { border : '1px solid black' , margin : '5px' , padding : '5px' , flex : 1  , textAlign : 'center' };
			var boxStyle1 = $.extend({}, boxStyle);
			boxStyle1.maxWidth = '160px';
			var boxStyle2 = $.extend({}, boxStyle);
			//boxStyle2.flex = 2;
            var videos = <div> <span>Loading... <img src="../assets/loading.gif" style={{ width : '1em' }}/></span> </div>
            if(this.state.channel && this.state.channel.videos ){
                videos = this.state.channel.videos.map(function(item, index){
    				return(
    					<div key={item.id} style={{ marginBottom : '5px' }} onClick={()=>this.selectVideoOfChannel(item)}>
    						<YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} />
    					</div>
    				)
    			}, this);
            }
            var series = Object.keys(Youtube.series).map(function(key){
                return(
                    <button key={key} onClick={()=>this.selectChannel(key) } style={{ display : 'inline-block', marginRight : '5px' }} >
                        {Youtube.series[key].channel}
                    </button>
                )
            }, this);
            return(
                <div>
                    <div>
                        <button onClick={this.back} >
							<span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
						</button>
                        <div style={{ display: 'inline-block' , marginLeft : '10px' }}>
                            {series}
                        </div>
                    </div>
                    <div>
                        <YoutubeSearch unselectChannel={this.unselectChannel} selectVideo={this.selectVideoOfSearch} />
                    </div>
                    {this.state.channel ? 
                        <div style={{ display : 'flex' }} >
                            <div style={boxStyle1} >
                                <img src={this.state.channel.thumbnail} style={{ width : '98px' , height : '98px' }} />
                                <h4> {this.state.channel.name} </h4>
                                Add description of channel?
                            </div>
                            <div style={boxStyle2} >
                                {this.state.selected?
                                    <div style={{ borderBottom : '1px solid black' , margin : '5px' , paddingBottom : '5px' }} >
                                        Video Selected
                                        <YoutubeItem title={this.state.selected.title} author={this.state.selected.author} length={this.state.selected.length} description={this.state.selected.description} thumbnail={this.state.selected.thumbnail} />
                                    </div>
                                :
                                    null
                                }
                                <div style={{ margin : '5px' , maxHeight : '85vh' , overflowY : 'overlay' }} >
                                    Last Videos
                                    {videos}
                                </div>
                            </div>
                                <YoutubeSeriesManagement ref='seriesManagement' channel={this.state.channel} title={this.state.title} />
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