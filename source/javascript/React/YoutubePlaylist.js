'use strict'

define( 'YoutubePlayList' , [ 'react' , 'jquery', 'YoutubeItem' ] , function( React , $ , YoutubeItem){
	var YoutubePlayList = React.createClass({
		getDefaultProps: function(){
			return {horizontal: false , highlightIndex : -1 , click:function(event,index){} }
		},
		getInitialState: function(){
			return ({ over : -1 })
		},
		componentDidMount: function(){
			$('.YoutubePlaylist').tooltip({
  				selector: '.HasTooltip'
			});
		},
		dragStart: function(event , index){
			this.item = index;
		},
		dragOver: function(event){
			event.preventDefault();
		},
		drop: function(event , index){
			this.props.changePosition(this.item,index);
			this.setState({over : -1});
		},
		dragEnter: function(event , index){
			this.setState({over: index});
		},
		remove: function(index){
			this.props.removeVideoPlaylist(index);
		},
		render: function(){
			var videos = this.props.videos.map(function(item, index){
				return(
					<div key={item.id} className={(this.props.horizontal ? 'Horizontal ' : 'Vertical ')}>
						{this.props.horizontal ? null : 
						<button type='button' className='RemoveButton' onClick={()=>this.remove(index)} >
							<span className="glyphicon glyphicon-remove" aria-hidden={true}></span>
						</button>
						}
						<div className={(this.props.highlightIndex == index ? 'Highlight' : '') + ' ' + (this.state.over == index ? ' Over' : '') + ' ' + 'HasTooltip' }
						  onDragStart={(event)=>this.dragStart(event , index)} onDragOver={this.dragOver} onDrop={(event)=>this.drop(event , index)} draggable={this.props.changePosition? true : false}
						  onDragEnter={(event)=>this.dragEnter(event , index)} onClick={(event)=>this.props.click(event, index)} data-toggle="tooltip" data-placement={this.props.horizontal ? 'bottom' : 'left'} title={item.title + ' - ' + item.author}>
							<YoutubeItem title={item.title} description={item.description} thumbnail={item.thumbnail} length={item.length} author={item.author} showDescription={false}/>
						</div>
					</div>
				)
			}, this);
			return (
			<div className="YoutubePlaylist">
				{videos}
			</div>
			)
		}
	});
	return YoutubePlayList;
})