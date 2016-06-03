'use strict'

define('YoutubeSeriesManagement', ['react' , 'jquery' , 'YoutubeService' , 'YoutubeItem' , 'YoutubeSeries' ] , function(React, $ , YoutubeService , YoutubeItem , YoutubeSeries ){
	var YoutubeSeriesManagement = React.createClass({
		getInitialState: function(){
            var series = [];
            if(YoutubeService.series[this.props.channel.id]){
                series = YoutubeService.series[this.props.channel.id].series
            }
			return { series : series , newSerie : { title : this.props.title } , previewTitle : '' , previewVideos: [] }
		},
        componentWillReceiveProps: function( nextProps ){
            if(nextProps.title !== this.props.title){
                this.setState( {newSerie : { title : nextProps.title } } );
            }
            if(nextProps.channel.id !== this.props.channel.id){
                this.save();
                var series = [];
                if(YoutubeService.series[nextProps.channel.id]){
                    series = YoutubeService.series[nextProps.channel.id].series
                }
                this.setState( { series: series });
            }
        },
        componentWillUnmount: function(){
            this.save();
        },
        addSerie: function(){
            var series = this.state.series;
            var newSerie = this.state.newSerie;
            series.push(newSerie);
            this.setState({newSerie : {} , series : series});
        },
        nameSerie: function(title){
            var serie = this.state.newSerie;
            serie.title = title
            this.setState({newSerie : serie});
        },
        renameSerie: function(index, event){
            var series = this.state.series;
            series[index].title = event.target.value;
            this.setState({series : series});
        },
        removeSerie: function(index){
            var series = this.state.series;
            series.splice(index, 1);
            this.setState({ series : series });
        },
        save: function(){
            YoutubeService.saveSeries(this.state.series, this.props.channel);
        },
        openPreview: function(title){
            var match = [];
            var videos = this.props.channel.videos;
            for(var y in videos){
                if( videos[y].title.toLowerCase().indexOf(title.toLowerCase()) != -1 ){
                    match.push(videos[y]);
                }
            }
            $('#previewVideosModal').modal();
            this.setState({previewTitle: title, previewVideos: match});
        },
		render: function(){
            var series = this.state.series.map(function(item, index){
                return(
                    <div className="Series" key={index}>
                        <YoutubeSeries blur={this.renameSerie.bind(this, index)} title={item.title} />
                        <button className="Button" onClick={()=>this.removeSerie(index)}>
                            <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
                        </button>
                        <button className="Button" onClick={()=>this.openPreview(item.title)}>
                            <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                        </button>
                    </div>
                )
            },this);
            var previewVideos = this.state.previewVideos.map(function(item, index){
                return(
                    <div key={item.id} className="VideoPreview">
                        <YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} />
                    </div>
                )
            }, this);
			return(
                <div className="YoutubeSeriesManagement" >
                    <div className="NewSeries" >
                        <h4 >New Series</h4>
                        <YoutubeSeries blur={(event)=>this.nameSerie(event.target.value)} title={this.state.newSerie.title} />
                        <button className="Button" onClick={()=>this.addSerie()} >
                            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                            <span className="TextAfterIcon"> Add </span>
                        </button>
                        <button className="Button" onClick={()=>this.openPreview(this.state.newSerie.title)}>
                            <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                        </button>
                    </div>
                    {series}
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
			)
		}
	});
	return YoutubeSeriesManagement
});