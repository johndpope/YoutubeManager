'use strict'

define('YoutubeSeries', [ 'react' , 'jquery' ] , function ( React , $ ){
    var YoutubeSeries = React.createClass({
        getDefaultProps: function(){
            return {
                'blur' : function(){},
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
                <span>
                    <label style={{display: 'inline-block'}}>
                        Nome
                        <input ref="inputTitle" defaultValue={this.props.title} style={{ marginLeft : '2px' , width : '515px' }} onBlur={(event)=>this.props.blur(event)}/>
                    </label>
                    <label style={{display: 'inline-block', marginLeft : '5px' }} >
                        Número #
                        <input style={{width : '40px' , marginLeft : '2px' }} type="number" />
                    </label>
                </span>
            )
        }
    })
    return YoutubeSeries;
})