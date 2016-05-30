'use strict'

define('YoutubeSeriesManagement', ['react' , 'jquery' , 'Youtube' , 'YoutubeItem' , 'YoutubeSeries' ] , function(React, $ , Youtube , YoutubeItem , YoutubeSeries ){
	var YoutubeSeriesManagement = React.createClass({
		getInitialState: function(){
            var series = [];
            if(Youtube.series[this.props.channel.id]){
                series = Youtube.series[this.props.channel.id].series
            }
			return { series : series , newSerie : { title : this.props.title } }
		},
        componentWillReceiveProps: function( nextProps ){
            if(nextProps.title !== this.props.title){
                this.setState( {newSerie : { title : nextProps.title } } );
            }
            if(nextProps.channel.id !== this.props.channel.id){
                this.save();
                var series = [];
                if(Youtube.series[nextProps.channel.id]){
                    series = Youtube.series[nextProps.channel.id].series
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
            Youtube.saveSeries(this.state.series, this.props.channel);
        },
        preview: function(title){
            this.props.openPreview(title);
        },
		render: function(){
			var boxStyle = { border : '1px solid black' , margin : '5px' , padding : '5px' , flex : 1  , textAlign : 'center' };
            var series = this.state.series.map(function(item, index){
                return(
                    <div style={{ marginTop : '5px' }} key={index}>
                        <YoutubeSeries blur={this.renameSerie.bind(this, index)} title={item.title} />
                        <button style={{ margin : '0px 10px' }} onClick={()=>this.removeSerie(index)}>
                            <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
                        </button>
                        <button type="button" data-toggle="modal" data-target="#myModal" onClick={()=>this.preview(item.title)}>
                            <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                        </button>
                    </div>
                )
            },this);
			return(
                <div style={boxStyle} >
                    <div style={{borderBottom : '1px solid black'}} >
                        <h4 style={{ marginRight : '5px' }} >Series</h4>
                        <YoutubeSeries blur={(event)=>this.nameSerie(event.target.value)} title={this.state.newSerie.title} />
                        <button onClick={()=>this.addSerie()} style={{ margin : '0px 10px' }} >
                            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                            Add
                        </button>
                        <button type="button" data-toggle="modal" data-target="#myModal" onClick={()=>this.preview(this.state.newSerie.title)}>
                            <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                        </button>
                    </div>
                    {series}
                </div>
			)
		}
	});
	return YoutubeSeriesManagement
});