'use strict'

define('Loading' , ['react'] , function(React){
	var Loading = React.createClass({
		render: function(){
			return (
				<div className="Loading">
					<h1 >LOADING ...</h1>
				</div>
			)
		}
	});
	return Loading;
})