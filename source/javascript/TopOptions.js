'use strict'

define( 'TopOptions' , [ 'react' ] , function( React ) {
	var TopOptions = React.createClass({
		render: function(){
			var self = this;
			var options = this.props.options.map(function( item , index ){
				return(
					<div onClick={()=>self.props.changeCategory(item.id)} className={(self.props.selectedId == item.id) ? 'selected' : ''}  key={item.id} >{item.text}</div>
				)
			})
			return (
				<div className='TopOptions'>
					{options}
				</div>
			)
		}
	})
	return TopOptions
})