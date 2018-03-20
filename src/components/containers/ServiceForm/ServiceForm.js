import React, { Component } from 'react';
import _s from 'assets/css/ServiceForm.css';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import { mapAndConnect, IManagedService, ManagedService} from "services";
import {Redirect} from "react-router";

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';



/*{/!*
      <div className={_s.relatedParty}>
        <TextField onChange={(e,v)=> this.onFieldChange("role", v)} value={this.state.formValues.role} hintText="Enter role..." floatingLabelText="Role"/><br></br>
        <TextField onChange={(e,v)=> this.onFieldChange("id", v)} value={this.state.formValues.id} hintText="Enter id..." floatingLabelText="ID"/><br></br>
        <TextField onChange={(e,v)=> this.onFieldChange("href", v)} value={this.state.formValues.href} hintText="Enter href..." floatingLabelText="HREF"/><br></br>
      </div>
*!/}


        {/!********************************************** DATES, MODES, STATE ************************************!/
/!*
        <h3>Order date</h3>
        <h3>Order date</h3>
        <DatePicker hintText="Order date" />
        <h3>Start date</h3>
        <DatePicker hintText="Start date" />

        <h3>End date</h3>
        <DatePicker className={_s.formtext} hintText="End date" /><br></br>*!/

        {/!********************************************** LISTS, TYPES ETC. **************************************!/}
/!*
        <br></br><TextField className={_s.formtext} hintText="Resource type..." floatingLabelText="Type"/>
        <br></br><TextField className={_s.formtext} hintText="Service order..." floatingLabelText="Service Order Ref"/>
        <br></br><TextField className={_s.formtext} hintText="Service order..." floatingLabelText="Service Order Ref"/>*!/*/

export class ServiceForm extends Component {
    constructor(props){
      super(props);
      this.state = {
        formValues: {
          id: "",
          href: "",
          category: "",
          name: "",
          nameError: "",
          description: "",
          isServiceEnabled: false,
          hasStarted: false,
          startMode: "",
          isStateful: false,
          state: "",
        },
        success: false
      }
    }

    onClick(){
      this.setState({
        showAdvanced: !this.state.showAdvanced
      });
    }

    /*When a field changes, we assign the value in the field.*/
    onFieldChange (field, value){
      this.setState({
        formValues: Object.assign({},this.state.formValues, {
          [field]: value
        })
      },() => this.validate())

    }

    validate() {
      const errors = {};

      errors.nameError = this.state.formValues.name === "" ? "Name is a required field" : null;
        this.setState({
          formValues:{
          ...this.state.formValues,
          ...errors
        }});
    };

    canBeSubmitted(){
      const {name} = this.state.formValues;
      return ( name.length > 0);
    }

    submitService(){
      const err = this.validate();
      if (!err) {
        this.props.imService.postService(new ManagedService(this.state.formValues)).subscribe(() => {
          this.setState({
            success: true
          })
        })
      }
    }

    componentDidMount(){

    }

    render() {

      const isEnabled = this.canBeSubmitted();

      return (
        <div className={_s.form}>

          {/********************************************** CLASSIC FORM INFO ***************************************/}


          <h1>Add New Service</h1>
          <TextField onChange={(e,v)=> this.onFieldChange("id", v)} value={this.state.formValues.id} className={_s.formtext} hintText="Enter ID..." floatingLabelText="ID"/>
          <TextField onChange={(e,v)=> this.onFieldChange("href", v)} value={this.state.formValues.href} className={_s.formtext} hintText="Reference of the service..." floatingLabelText="HREF"/>
          <TextField onChange={(e,v)=> this.onFieldChange("category", v)} value={this.state.formValues.category} className={_s.formtext}  hintText="Enter category..." floatingLabelText="Category"/>
          <TextField onChange={(e,v)=> this.onFieldChange("name", v)} value={this.state.formValues.name} errorText={this.state.formValues.nameError} className={_s.formtext} hintText="Enter name..." floatingLabelText="Name"/>
          <TextField onChange={(e,v)=> this.onFieldChange("description", v)} value={this.state.formValues.description} className={_s.formtext} hintText="Description of the service..." floatingLabelText="Description" multiLine={true} rows={1}/>


          <div className={_s.toggle}>
            <Toggle onChange={(e,v) => this.onFieldChange("isServiceEnabled", v)} value={this.state.formValues.isServiceEnabled} label="Is the service enabled?" />
            <Toggle onChange={(e,v)=> this.onFieldChange("hasStarted", v)} value={this.state.formValues.hasStarted} label="Has the service started?" />
          </div>
          <h3 className={_s.dropdown}>Start Mode</h3>
          <DropDownMenu onChange={(e,v) => this.onFieldChange("startMode", v)} value={this.state.formValues.startMode}>
            <MenuItem value={0} primaryText="Unknown" />
            <MenuItem value={1} primaryText="Automatically by the managed environment" />
            <MenuItem value={2} primaryText="Automatically by the owning device" />
            <MenuItem value={3} primaryText="Manually by the Provider of the Service" />
            <MenuItem value={4} primaryText="Manually by a Customer of the Provider" />
            <MenuItem value={5} primaryText="Any of the above" />
          </DropDownMenu>
          <div className={_s.toggle}>
            <Toggle onChange={(e,v)=> this.onFieldChange("isStateful", v)} value={this.state.formValues.isStateful} label="Can this service be changed without affecting any other service?"/>
          </div>

          <h3 className={_s.dropdown}>State</h3>
          <DropDownMenu onChange={(e,v) => this.onFieldChange("state", v)} value={this.state.formValues.state}>
            <MenuItem value={0} primaryText="Feasibility Checked" />
            <MenuItem value={1} primaryText="Designed" />
            <MenuItem value={2} primaryText="Reserved" />
            <MenuItem value={3} primaryText="Active" />
            <MenuItem value={4} primaryText="Inactive" />
            <MenuItem value={5} primaryText="Terminated" />
          </DropDownMenu>

          {/*Submit button, redirects to services page*/}
          <RaisedButton onClick={()=> {
            this.submitService();
          }} label="Submit" primary={true} disabled={!isEnabled}/>
          {this.state.success ? <Redirect to="/services" /> : null}
        </div>
      );
    }
}

export default mapAndConnect(ServiceForm, {
  imService: IManagedService
})
