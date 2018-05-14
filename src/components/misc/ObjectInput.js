import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
import { mapAndConnect, IManagedService, ManagedService} from "services";
import {Redirect} from "react-router";

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


import { get, set, has, cloneDeep } from 'lodash';
import { paths } from 'common/utils';


export class ObjectInput extends Component{
  constructor(props){
    super(props);

    this.state = {
      value: {}
    }
  }

  componentDidMount(){
    this._updateFields(this.props);
  }

  componentWillReceiveProps(nextProps){
    this._updateFields(nextProps);
  }

  isControlled(){
    return this.props.value != null;
  }

  _updateFields(props){
    let nmap = {};
    if(props.value != null){
      for(let atr of paths(props.value) ){
        set(nmap, atr, get(props.value, atr));
      }
    }
    this.setState({
      value: nmap
    })
  }

  onFieldChange(name, nval){
    set(this.state.value, name, nval);
    let object = cloneDeep(this.state.value);
    this.setState({
      value: object
    });
    
    if(this.props.map) {
      object = this.props.map(object);
    }

    if(this.props.onChange){
      this.props.onChange(object);
    }
  }


  render(){

    const inputs = React.Children.map(this.props.children, (field, idx) => {
      if(field.props.name){
        let onChange = (...a) => {
          let value = a[1];
          if(field.props.mapValue){
            value = field.props.mapValue(...a);
          }else if(this.props.mapValues){
            value = this.props.mapValues(...a);
          }

          this.onFieldChange(field.props.name, value);
          if(field.props.onChange){
            field.props.onChange(...a);
          }
          
          if(field.props.onCheck){
            field.props.onCheck(...a);
          }

        }
        return React.cloneElement(field, {
          onChange: onChange,
          onCheck: onChange,
          value: this.isControlled() ? get(this.state.value, field.props.name) : undefined,
          checked: this.isControlled() ? get(this.state.value, field.props.name) : undefined,
          key: field.key || field.props.key || idx
        });
      }

      return field;
    });
    return (
      <div style={{display: "inline-block"}}>
        {inputs}
      </div>
    );
  }
}


ObjectInput.defaultProps = {
  mapValues: (event, v) => {
    if(v != null){return v;}
    return event.target.value || event.target.checked;
  }
}

ObjectInput.propTypes = {
  value: PropTypes.object,
  mapValues: PropTypes.func
}

