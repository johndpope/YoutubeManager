'use strict'

define( 'NavigationItem' , [ 'react' ] , function( React ){
	var NavigationItem = React.createClass({
		render: function(){
			return(
				<div style={this.props.style} onClick={this.props.function} className={this.props.selected ? 'selected' : ''}>
					{this.props.text}
				</div>
			)
		}
	});
	return NavigationItem;
})