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
				<div className="Navigation" >
					<NavigationItem selected={ this.props.selected == 'subscriptions' } function={ this.props.subscriptions } text='Subscriptions' />
					<NavigationItem selected={ this.props.selected == 'US' } function={ this.topUS } text='Top World' />
					<NavigationItem selected={ this.props.selected == 'BR' } function={ this.topBR } text='Top Br' />
					<NavigationItem selected={ this.props.selected == 'playlist' } function={ this.props.addPlaylist } text='Add Playlist' />
					<NavigationItem selected={ this.props.selected == 'series' } function={ this.props.series } text='Add Series' />
					{ this.props.user ?
						<NavigationItem selected={ this.props.selected == 'recommendations' } function={ this.props.recommendations} text='Recommendations' />
					:
						<NavigationItem right={true} function={this.props.logIn} text='Log in' />
					}
					<NavigationItem selected={ this.props.selected == 'search' } function={ this.props.search } text='Search' />
					<NavigationItem selected={ this.props.selected == 'reload' } function={ this.props.reload } text='Reload Videos' />
				</div>
			)
		}
	});
	return Navigation;
})