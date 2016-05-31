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
			<div className="YoutubeItem">
				<img src={this.props.thumbnail} className="Thumbnail" draggable="false"/>
				{ this.props.showDescription ?
				<div className="Text">
					<div className="Title" >
						{this.props.title + ' -- ' +  this.props.author}
					</div>
					<div className="Description" >{this.props.description}</div>
				</div>
				: null }
			</div>
			)
		}
	});
	return YoutubeItem;
})