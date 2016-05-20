'use strict'

define('YoutubeSearch', ['react', 'Youtube' , 'YoutubeItem' ] , function( React , Youtube , YoutubeItem ){
    var YoutubeSearch = React.createClass({
        getDefaultProps: function(){
            return { selectVideo : function(){} , hideVideos : false }
        },
        getInitialState: function(){
            return ({ loading : false  , videos : [] , hideVideos : this.props.hideVideos });
        },
        hideVideos: function( hideVideos ){
            this.setState({ hideVideos : hideVideos});
        },
        search: function(event){
            this.props.unselectChannel();
            event.preventDefault();
            this.setState({loading : true});
            var result = Youtube.search(this.refs.searchInput.value);
            var self = this;
            result.then(function(videos){
                var newVideos = [];
                videos.forEach(function(video){
                    newVideos.push(video);
                });
                self.hideVideos(false);
                self.setState({ videos: newVideos , loading: false });
            });
        },
        selectVideo: function (item) {
            this.hideVideos(true);
            this.props.selectVideo(item)
        },
        returnToSeach: function(){
            this.props.unselectChannel();
            this.hideVideos(false);
        },
        render: function(){
            if(!this.state.loading){
                var videos = this.state.videos.slice(0,16).map(function(item, index){
                    return(
                        <div key={item.id} onClick={()=>this.selectVideo(item)} style={{'border': '1px solid black', 'padding': '4px', 'width' : '50%', 'display': 'inline-block'}} >
                            <YoutubeItem title={item.title} author={item.author} length={item.length} description={item.description} thumbnail={item.thumbnail} />
                        </div>
                    )
                }, this);
            }
            return(
                <div>
                    <div>
                        <form onSubmit={this.search} style={{ margin : '10px 0px' }} className='input-group' >
                            <span className='input-group-addon' onClick={this.search} style={{ cursor : 'pointer' }} >
                                <span className='glyphicon glyphicon-search' aria-hidden={true} />
                            </span>
                            <input className='form-control' ref="searchInput" placeholder='Pesquisa' />
                        </form>
                    </div>
                    <div>
                        {this.state.loading ? 
                            <div>
                                <span>Loading... <img src="../assets/loading.gif" style={{ width : '1em' }}/></span>
                            </div>
                            :
                            (
                                this.state.hideVideos ?
                                    <div>
                                        <button onClick={()=>this.returnToSeach()} style={{ width : '100%' }}>
                                            <span className='glyphicon glyphicon-chevron-down' aria-hidden={true} />
                                        </button>
                                    </div>
                                :
                                    <div>
                                        {videos}
                                    </div>
                            )
                        }
                    </div>
                </div>
            )
        }
    });
    return YoutubeSearch
} )