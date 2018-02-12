'use strict'

define('Loading' , ['react'] , function(React){
	var Loading = React.createClass({
		render: function(){
			return (
				<div className="LoadingPage">
					<h1 >LOADING ... <img src="../assets/loading.gif" style={{ width : '1em' }}/></h1> 
				</div>
			)
		}
	});
	return Loading;
})