'use strict'

define( 'YoutubeItem' , [ 'react' ] , function( React ){
	var YoutubeItem = React.createClass({
		/*
		props:
			title
			description
			thumbnail
			length
			author
			showDescription
		*/
		propTypes: {
			title: React.PropTypes.string.isRequired,
			description: React.PropTypes.string.isRequired,
			thumbnail: React.PropTypes.string.isRequired,
			author: React.PropTypes.string.isRequired,
			showDescription: React.PropTypes.bool
		},
		getDefaultProps: function() {
			return {
			  showDescription: true
			};
		},
		render: function(){
			return (
			<div className="flex YoutubeItem">
				<img src={this.props.thumbnail} style={{'width': '120px', 'height' : '90px'}} draggable="false"/>
				{ this.props.showDescription ?
				<div className="description">
					<div style={{'height':'1.3em', 'fontWeight' : 'bolder', 'overflow' : 'hidden'}}>
						{this.props.title + ' - ' +  this.props.author}
					</div>
					<span style={{'fontSize' : 'smaller', 'marginTop': '2px', 'textOverflow': 'ellipsis'}}>{this.props.description}</span>
				</div>
				: null }
			</div>
			)
		}
	});
	return YoutubeItem;
})