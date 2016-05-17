'use strict'

define('YoutubeSeriesManagement', ['react' , 'jquery' , 'Youtube' , 'YoutubeItem' , 'YoutubeSeries' ] , function(React, $ , Youtube , YoutubeItem , YoutubeSeries ){
	var YoutubeSeriesManagement = React.createClass({
		getInitialState: function(){
            var newSerie = {title: ''};
            var series = [{title : 'Dark Souls III'}];
			return { series : series , newSerie : newSerie }
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
            console.log('intern save');
        },
		render: function(){
			var boxStyle = { border : '1px solid black' , margin : '5px' , padding : '5px' , flex : 1  , textAlign : 'center' };
            var series = this.state.series.map(function(item, index){
                return(
                    <div style={{ marginTop : '5px' }} key={index}>
                        <YoutubeSeries blur={this.renameSerie.bind(this, index)} title={item.title} />
                        <button style={{ marginLeft : '10px' }} onClick={()=>this.removeSerie(index)}>
                            <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
                        </button>
                    </div>
                )
            },this);
			return(
                <div style={boxStyle} >
                    <div style={{borderBottom : '1px solid black'}} >
                        <h4 style={{ marginRight : '5px' }} >Series</h4>
                        <YoutubeSeries blur={(event)=>this.nameSerie(event.target.value)} title={this.state.newSerie.title} />
                        <button onClick={()=>this.addSerie()}>
                            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                            Adicionar
                        </button>
                    </div>
                    {series}
                </div>
			)
		}
	});
	return YoutubeSeriesManagement
});