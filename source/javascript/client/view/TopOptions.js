'use strict'

define( 'TopOptions' , [ 'react' ] , function( React ) {
	var TopOptions = React.createClass({
		animate: function(event){
			console.log(event.target);
			// $(this.refs.options).animate({scrollLeft:this.refs.options.scrollLeft + event.deltaY});
			event.currentTarget.scrollLeft += event.deltaY;
		},
		render: function(){
			var self = this;
			var options = this.props.options.map(function( item , index ){
				return(
					<div onClick={()=>self.props.changeCategory(item.id)} className={(self.props.selectedId == item.id) ? 'TopOptionSelected' : 'TopOption'}  key={item.id} >{item.text}</div>
				)
			})
			return (
				<div className='TopOptions' onWheel={(event)=>this.animate(event)} style={{whiteSpace: 'nowrap', overflowX: 'hidden' }}>
					{options}
				</div>
			)
		}
	})
	return TopOptions
})