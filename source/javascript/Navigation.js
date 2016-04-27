'use strict'

define('Navigation' , ['react' , 'NavigationItem' ] , function(React , NavigationItem ){
	var Navigation = React.createClass({
		topUS:function(){
			this.props.top('US');
		},
		topBR:function(){
			this.props.top('BR');
		},
		render : function(){
			return (
				<div className="Navigation" style={{position: 'relative'}} >
					<NavigationItem selected={ this.props.selected == 'subscriptions' } function={ this.props.subscriptions } text='Inscrições' />
					<NavigationItem selected={ this.props.selected == 'US' } function={ this.topUS } text='Top World' />
					<NavigationItem selected={ this.props.selected == 'BR' } function={ this.topBR } text='Top Br' />
					<NavigationItem selected={ this.props.selected == 'BR' } function={ this.props.addPlaylist } text='Add Playlist' />
					{ this.props.user ?
						<NavigationItem selected={ this.props.selected == 'recommendations' } function={ this.props.recommendations} text='Recomendações' />
					:
						<NavigationItem style={{position: 'absolute', right: '0px', bottom: '0px'}} function={ this.props.logIn} text='Logar' />
					}
					<NavigationItem selected={ this.props.selected == 'search' } function={ this.props.search } text='Buscar' />
				</div>
			)
		}
	});
	return Navigation;
})