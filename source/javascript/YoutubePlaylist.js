'use strict'

define( 'YoutubePlayList' , [ 'react' , 'YoutubeItem' ] , function( React , YoutubeItem){
	var YoutubePlayList = React.createClass({
		getDefaultProps: function(){
			return {horizontal: false , highlightIndex : -1 , click:function(event,index){} }
		},
		getInitialState: function(){
			return ({videoIndexInfo : -1 , over : -1})
		},
		mouseEnter: function(event, index){
			this.setState({videoIndexInfo: index, positionY : event.screenY });
		},
		mouseLeave: function(event){
			this.setState({videoIndexInfo: -1});
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
					<div key={item.id} className={(this.props.horizontal ? 'horizontal ' : 'vertical ')}>
						{this.props.horizontal ? null : 
						<button type='button' className='' onClick={()=>this.remove(index)}  style={{top: '26px' , right: '-43px' , position: 'relative'}}>
							<span className="glyphicon glyphicon-remove" aria-hidden={true}></span>
						</button>
						}
						<div onMouseEnter={(event)=>this.mouseEnter(event, index)} onMouseLeave={this.mouseLeave}
						  className={(this.props.highlightIndex == index ? 'highlight' : '') + (this.state.over == index ? ' over' : '') }
						  onDragStart={(event)=>this.dragStart(event , index)} onDragOver={this.dragOver} onDrop={(event)=>this.drop(event , index)} draggable={!this.props.horizontal}
						  onDragEnter={(event)=>this.dragEnter(event , index)} onClick={(event)=>this.props.click(event, index)}>
							<YoutubeItem title={item.title} description={item.description} thumbnail={item.thumbnail} length={item.length} author={item.author} showDescription={false}/>
						</div>
					</div>
				)
			}, this);
			return (
			<div className="YoutubePlayList">
				{this.state.videoIndexInfo >= 0 ?
					<div className="tooltip" style={ this.props.horizontal ? {top : '720px' , left : this.state.videoIndexInfo * 135 , width : '360px' } : { right : '140px' , top : this.state.positionY - 70 , width : '200px'} } >
						{this.props.videos[this.state.videoIndexInfo].title}
					</div>
				:
					null
				}
				{videos}
			</div>
			)
		}
	});
	return YoutubePlayList;
})