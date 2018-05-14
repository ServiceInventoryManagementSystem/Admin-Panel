import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FlatButton } from 'material-ui';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import IconButton from 'material-ui/IconButton';



export class ListInput extends Component{
  constructor(props){
    super(props);
    let values = props.values || [];
    this.state = {
      values: values,
      count: props.count || props.min || values.length 
    }
  }

  onInputChange(idx, value){
    let values = this.state.values.slice();
    values[idx] = value;
    
    this.setState({
      values: values
    }, () => {
      this.props.onChange(this.state.values);
    });
  }


  isControlled(){
    return this.props.count != null || this.props.values != null; 
  }

  onCountChange(count){
    let min = this.props.min || 0;
    let max = this.props.max || Infinity;
    this.setState({
      count: Math.min(Math.max(count, min), max)
    }, () => {
      this._updateList(this.props);
      //this.props.onCountChange(this.state.count);
    });
  }

  removeField(idx){
    let values = this.state.values.slice();
    values.splice(idx, 1);
    this.setState({
      values: values
    }, () => {
      this.onCountChange(this.state.count - 1);
    })
  }

  onComponentDidMount(){
    this._updateList(this.props);
  }

  componentWillReceiveProps(nextProps){
    this._updateList(nextProps);
  }

  _updateList(props){
    this.setState({
      count: (this.props.count != props.count) ? props.count : this.state.count,
      values: (this.props.values != props.values) ? props.values : this.state.values
    }, () => {
      let values = this.state.values.slice(0, this.state.count);
      this.setState({
        values: values
      });
    });
  }




  render(){
    let fields = [];
    let FieldType = this.props.component;
    for(let i = 0; i < this.state.count; i++){
      fields.push(
        <li key={i}>
          <FieldType key={i} value={/*this.isControlled() ?*/ this.state.values[i] /*: null */} onChange={(...a) => {this.onInputChange(i, ...a)}}/>
          <IconButton iconClassName="material-icons" onClick={() => this.removeField(i)}>remove_circle</IconButton>
        </li>
      );
    }
    return (
      <div>
        <ul style={{ listStyleType: "none" }}>
          {fields}
        </ul>
        <RaisedButton onClick={() => this.onCountChange(this.state.count + 1)}>New</RaisedButton>
      </div>
    );
  }
}


ListInput.defaultProps = {
  min: 0,
  max: Infinity,
  component: () => <p>"none"</p>
}

ListInput.propTypes = {
  count: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  values: PropTypes.array
}

