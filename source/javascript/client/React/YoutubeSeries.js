'use strict'

define('YoutubeSeries', [ 'react' , 'jquery' ] , function ( React , $ ){
    var YoutubeSeries = React.createClass({
        getDefaultProps: function(){
            return {
                'title' : ''
            }
        },
        componentDidUpdate: function(prevProps, prevState){
            if(prevProps.title !== this.props.title ){
                var title = this.refs.inputTitle.value;
                if(this.props.title !== title){
                    this.refs.inputTitle.value = this.props.title;
                }
            }
        },
        render: function(){
            return(
                <div className="YoutubeSeries" >
                    <label>
                        Nome
                        <input className="InputTitle" disabled={this.props.blur? false : true} ref="inputTitle" defaultValue={this.props.title} onBlur={(event)=>this.props.blur(event)}/>
                    </label>
                    {/*
                    <label style={{display: 'inline-block', marginLeft : '5px' }} >
                        Número #
                        <input style={{width : '40px' , marginLeft : '2px' }} type="number" />
                    </label>
                    */}
                </div>
            )
        }
    })
    return YoutubeSeries;
})