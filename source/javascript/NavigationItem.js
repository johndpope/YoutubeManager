'use strict'

define( 'NavigationItem' , [ 'react' ] , function( React ){
	var NavigationItem = React.createClass({
		render: function(){
			return(
				<div onClick={this.props.function} className={(this.props.selected ? 'NavigationItemSelected' : 'NavigationItem') + ' ' + (this.props.right? 'Right' : '')}>
					{this.props.text}
				</div>
			)
		}
	});
	return NavigationItem;
})