'use strict'

define('YoutubeSeriesPage', ['react' , 'YoutubeSeriesManagement' , 'YoutubeItem' ] , function( React , YoutubeSeriesManagement , YoutubeItem ){
    var YoutubeSeriesPage = React.createClass({
        getInitialState: function(){
            var arrayVideos = [{"id":"TLFfYHUb9Ps","title":"Dangerous Woman - Ariana Grande (Rock Cover Music Video by TeraBrite)","description":"","uploadDate":"2016-03-14T17:15:35.000Z","thumnail":"https://i.ytimg.com/vi/TLFfYHUb9Ps/default.jpg","author":"TeraBrite","authorId":"UCvq0BbsWrF0OP4q_q2X1M3w"},{"id":"12mq4jNDKZQ","title":"Calculated Dong","description":"","uploadDate":"2016-03-14T16:32:41.000Z","thumnail":"https://i.ytimg.com/vi/12mq4jNDKZQ/default.jpg","author":"AdmiralBulldog","authorId":"UCk8ZIMJxSO9-pUg7xyrnaFQ"},{"id":"EoVEQireZJM","title":"Aprendendo a andar de patins #SouLuna | Gabbie Fadel","description":"","uploadDate":"2016-03-14T18:00:00.000Z","thumnail":"https://i.ytimg.com/vi/EoVEQireZJM/default.jpg","author":"Gabbie Fadel","authorId":"UCS9K27KW782vvAwTHJpVePQ"}];
            var videoSelected = null;
			return { videos : arrayVideos , selected : videoSelected }
        },
        saveSeries: function(){
            console.log('save');
            this.refs.seriesManagement.save();
        },
        back: function(){
            this.saveSeries();
            this.props.back();
        },
        selectVideo: function(index){
            var video = this.state.videos[index];
            this.refs.seriesManagement.nameSerie(video.title);
            this.setState({selected: video});
        },
        render: function(){
            var boxStyle = { border : '1px solid black' , margin : '5px' , padding : '5px' , flex : 1  , textAlign : 'center' };
			var boxStyle1 = $.extend({}, boxStyle);
			boxStyle1.maxWidth = '110px';
			var boxStyle2 = $.extend({}, boxStyle);
			//boxStyle2.flex = 2;
            var videos = this.state.videos.map(function(item, index){
				return(
					<div key={item.id} style={{ marginBottom : '5px' }} onClick={()=>this.selectVideo(index)}>
						<YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} />
					</div>
				)
			}, this);
            return(
                <div>
                    <div>
                        <button onClick={this.back} >
							<span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span>
						</button>
                    </div>
                    <div>
                        <div>
                            <label>
                                Search Bar
                                <input />
                            </label>
                        </div>
                        <div>
                            Search Result
                        </div>
                    </div>
                    <div style={{ display : 'flex' }} >
						<div style={boxStyle1} >
							<img src="https://yt3.ggpht.com/-QGhAvSy7npM/AAAAAAAAAAI/AAAAAAAAAAA/Uom6Bs6gR9Y/s100-c-k-no-rj-c0xffffff/photo.jpg" style={{ width : '98px' , height : '98px' }} />
							<h4> Channel Title </h4>
							Channel Description
						</div>
						<div style={boxStyle2} >
							{this.state.selected ?
								<div style={{ borderBottom : '1px solid black' , margin : '5px' , paddingBottom : '5px' }} >
									Video Selected
									<YoutubeItem title={this.state.selected.title} author={this.state.selected.author} length={this.state.selected.length} description={this.state.selected.description} thumbnail={this.state.selected.thumbnail} />
								</div>
							:
								null
							}
							<div style={{ margin : '5px' }} >
								List Of Videos
								{videos}
							</div>
						</div>
						<YoutubeSeriesManagement ref='seriesManagement'/>
					</div>
                </div>
            )
        }
    })
    return YoutubeSeriesPage
})