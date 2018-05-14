import { Subject } from 'rxjs';

import PropTypes from 'prop-types';
import React, { Component } from 'react';


export class InputDebounce extends Component{

  constructor(props){
    super(props);
    this.updateSubject = new Subject();
    this.sub = null;
    this.state = {
      value: props.value
    }
  }

  componentDidMount(){
    this._setUpSub(this.props);
  }

  _setUpSub(props){
    if(this.sub){
      this.sub.unsubscribe();
    }
    this.sub = this.updateSubject.debounceTime(props.debounce || 100).subscribe((v) => {
      if(this.props.onChange){
        this.props.onChange(...v);
      }
    });
  }

  componentWillReceiveProps(props){
    if(props.debounce !== this.props.debounce){
      this._setUpSub(props);
    }
    if(props.value){
      this.setState({
        value: props.value
      })
    }
  }

  componentWillUnmount(){
    this.sub.unsubscribe();
  }


  onInputChange(v){
    this.setState({
      value: this.props.mapValue(...v)
    }, () => {
      this.updateSubject.next(v);
    })
    
  }

  render(){
    const orig = React.Children.only(this.props.children  );

    let onChange = (...a) => {
      this.onInputChange(a);
      if(orig.props.onChange){
        orig.props.onChange(...a);
      }
    }
    
    const child = React.cloneElement(orig, {
      value: this.state.value,
      onChange: onChange
    });
    return child;
  }
}


InputDebounce.defaultProps = {
  mapValue: (event, v) => {
    if(v != null){return v;}
    return event.target.value || event.target.checked;
  }
}

InputDebounce.propTypes = {
  mapValues: PropTypes.func
}