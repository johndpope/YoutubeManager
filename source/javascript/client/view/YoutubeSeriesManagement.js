'use strict'

define('YoutubeSeriesManagement', ['react' , 'YoutubeService' , 'YoutubeItem' , 'YoutubeSeries' ] , function(React , YoutubeService , YoutubeItem , YoutubeSeries ){
	var YoutubeSeriesManagement = React.createClass({
        renameSerie: function(index){
            var rename = null;
            if(this.props.renameSerie){
                rename = (event)=>this.props.renameSerie(index, event.target.value);
            }
            return rename;
        },
        removeButtonFactory: function(index){
            var removeButton = null;
            if(this.props.removeSerie){
                removeButton = (
                    <button className="Button" onClick={()=>this.props.removeSerie(index)}>
                        <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
                    </button>
                )
            }
            return removeButton;
        },
        previewButtonFactory: function(title){
            var previewButton = null;
            if(this.props.previewSerie){
                previewButton = (
                    <button className="Button" onClick={()=>this.props.previewSerie(title)}>
                        <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                    </button>
                )
            }
            return previewButton;
        },
        render: function(){
            var series = this.props.series.map(function(item, index){
                return(
                    <div className="Series" key={index}>
                        <YoutubeSeries blur={this.renameSerie(index)} title={item.title} />
                        {this.removeButtonFactory(index)}
                        {this.previewButtonFactory(item.title)}
                    </div>
                )
            },this);
			return(
                <div className="YoutubeSeriesManagement" >
                    <div className="NewSeries" >
                        <h4 >New Series</h4>
                        <YoutubeSeries blur={this.props.nameSerie} title={this.props.newSerie} />
                        {this.props.addSerie?
                            <button className="Button" onClick={this.props.addSerie} >
                                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                <span className="TextAfterIcon"> Add </span>
                            </button>
                        :
                            null
                        }
                        {this.previewButtonFactory(this.props.newSerie)}
                    </div>
                    {series}
                </div>
			)
		}
	});
	return YoutubeSeriesManagement
});