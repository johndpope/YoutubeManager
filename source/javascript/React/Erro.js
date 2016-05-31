'use strict'

define('Erro' , ['react'] , function(React){
	var Erro = React.createClass({
		render: function(){
			return (
				<div className="ErrorPage">
					<h1 >LOADING ...</h1>
				</div>
			)
		}
	})
	return Erro;
})