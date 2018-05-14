import React, { Component } from 'react';
import _s from 'assets/css/ServiceForm.css';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import { mapAndConnect, IManagedService, ManagedService} from "services";
import {Redirect} from "react-router";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Divider from 'material-ui/Divider';


import {lightGreen600, lightGreen400, lightGreen300, lightGreen700, grey50} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';

import { ObjectInput } from 'components/misc/ObjectInput';
import { ListInput } from 'components/misc/ListInput';
import { ServiceSpecification } from 'services/sims/ManagedService';


function RelatedPartyList(props){
  return (
    <ObjectInput {...props}>
      <TextField className={_s.objectTextField} type="text" name="name" hintText="Name of the related party..." floatingLabelText="Name" />
      <TextField className={_s.objectTextField} type="text" name="role" hintText="Role of the related party..." floatingLabelText="Role" />
      <TextField className={_s.objectTextField} type="text" name="href" hintText="Href of the related party" floatingLabelText="HREF" />
    </ObjectInput>
  );
}

function ServiceCharacteristicList(props){
  return (
    <ObjectInput {...props}>
      <TextField className={_s.objectTextField} type="text" name="name" hintText="Name of service characteristic..." floatingLabelText="Name"/>
      <TextField className={_s.objectTextField} type="text" name="value" hintText="Value of service characteristic..." floatingLabelText="Value"/>
    </ObjectInput>
  );
}

function ServiceRelationshipList(props){
  return (
    <ObjectInput {...props}>
      <TextField className={_s.objectTextField} type="text" name="type" hintText="Type of service relationship..." floatingLabelText="Type" />
      <TextField className={_s.objectTextField} type="text" name="service.href" hintText="Href of service relationship..." floatingLabelText="HREF" />
      <TextField className={_s.objectTextField} type="text" name="service.id" hintText="ID of service relationship..." floatingLabelText="ID" />
    </ObjectInput>
  );
}

function SupportingServiceList(props){
  return (
    <ObjectInput {...props}>
      <TextField className={_s.objectTextField} type="text" name="id" hintText="ID of supporting service..." floatingLabelText="ID" />
      <TextField className={_s.objectTextField} type="text" name="href" hintText="Href of supporting service..." floatingLabelText="HREF" />
    </ObjectInput>
  );
}

function SupportingResourceList(props){
  return (
    <ObjectInput {...props}>
      <TextField className={_s.objectTextField} type="text" name="id" hintText="ID of supporting resource..." floatingLabelText="ID" />
      <TextField className={_s.objectTextField} type="text" name="href" hintText="Href of supporting resource..." floatingLabelText="HREF" />
    </ObjectInput>
  );
}



export class ServiceForm extends Component {
    constructor(props){
      super(props);
        this.state = {
        formValues: {
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
          serviceSpecification: {href: "", name: "", version: ""},
          supportingService: [],
          serviceCharacteristic: [],
          relatedParty: [],
          serviceRelationship: [],
          supportingResource: [],
          orderDate: "",
          startDate: "",
          endDate: "",
        },
        success: false
      };
      this.possibleStates = ["feasibilityChecked", "designed", "reserved", "active", "inactive", "terminated"];
      this.possibleStartModes = ["Unknown","Automatically by the managed environment","Automatically by the owning device","Manually by the Provider of the Service",
        "Manually by a Customer of the Provider","Any of the above"];
      
      if (props.service){
        let data = props.service.toData();
        this.state.formValues.id = props.service.id;
        this.state.formValues.href = props.service.href;
        this.state.formValues.category = props.service.category;
        this.state.formValues.name = props.service.name;
        this.state.formValues.nameError = props.service.nameError;
        this.state.formValues.description = props.service.description;
        this.state.formValues.isServiceEnabled = props.service.isServiceEnabled;
        this.state.formValues.hasStarted = props.service.hasStarted;
        this.state.formValues.startMode = props.service.startMode;
        this.state.formValues.isStateful = props.service.isStateful;
        this.state.formValues.state = props.service.state;
        let serviceSpec = props.service.getServiceSpecification();
        this.state.formValues.serviceSpecification = serviceSpec ? serviceSpec.toData() : {href: "", name: "", version: ""};
        this.state.formValues.relatedParty = data.relatedParty;
      }
    }


    /*When a text field changes, we assign the value in the field.*/
    onFieldChange (field, value){
      this.setState({
        formValues: Object.assign({},this.state.formValues, {
          [field]: value
        })
      },() => this.validate())
    }

    //validates fields
    validate() {
      const errors = {};
      errors.nameError = this.state.formValues.name === "" ? "Name is a required field" : null;
      this.setState({
        formValues:{
          ...this.state.formValues,
          ...errors
        }
      });
    };

    canBeSubmitted(){
      const {name} = this.state.formValues;
      return ( name.length > 0);
    }

    submitService(){
      const err = this.validate();
      if (!err) {
        
        let data = Object.assign({},this.state.formValues);
        data.state = this.possibleStates[data.state];
        data.startMode = this.possibleStartModes[data.startMode];

        let service = ManagedService.fromData(data);
        let observable;
        
        if (this.props.service){
          service.id = this.props.service.id;
          observable = this.props.imService.updateService(service);
        }else{
          observable = this.props.imService.postService(service)
        }
        
        observable.subscribe(() => {
          this.setState({
            success: true
          });
        });
      }
    }


    componentDidMount(){
      this.validate();
    }

    render() {
        const muiTheme = getMuiTheme({
          toggle: {
            thumbOnColor: lightGreen600,
            trackOnColor: lightGreen300,
          },
          textField: {
            focusColor: lightGreen300,
          },
          datePicker: {
            selectColor: lightGreen600,
            color: lightGreen600,
            headerColor: lightGreen300,
          },
          flatButton: {
            primaryTextColor: lightGreen700,
          },
          raisedButton: {
            primaryColor: lightGreen400,
          }
        });

      const isEnabled = this.canBeSubmitted();

      const stateMenuItems = this.possibleStates.map((t, number) => {
        return <MenuItem value={number} key={number} primaryText={t}/>
      });

      const startModeItems = this.possibleStartModes.map((t, number) => {
        return <MenuItem value={number} key={number} primaryText={t}/>
      });

      return (
        <Paper className={_s.paperContainer}>
          <div className={_s.form}>
            <MuiThemeProvider muiTheme={muiTheme}>

              <h1 className={_s.header}> Add New Service</h1>

              <div className={_s.formtext}>
                <TextField onChange={(e,v)=> this.onFieldChange("href", v)} value={this.state.formValues.href} hintText="Reference of the service..." floatingLabelText="HREF"/>
              </div>

              <div className={_s.formtext}>
                <TextField onChange={(e,v)=> this.onFieldChange("category", v)} value={this.state.formValues.category} hintText="Enter category..." floatingLabelText="Category"/>
              </div>

              <div className={_s.formtext}>
                <TextField onChange={(e,v)=> this.onFieldChange("name", v)} value={this.state.formValues.name} errorText={this.state.formValues.nameError} hintText="Enter name..." floatingLabelText="Name"/>
              </div>

              <div className={_s.formtext}>
                <TextField onChange={(e,v)=> this.onFieldChange("description", v)} value={this.state.formValues.description} hintText="Description of the service..." floatingLabelText="Description" multiLine={true} rows={1}/>
              </div>

              <Divider className={_s.divider} />

              <div className={_s.toggle}>
                <Toggle iconStyle={{marginLeft: '0px'}} labelStyle={{width: '50%' }}  onToggle={(e,v) => this.onFieldChange("isServiceEnabled", v)} toggled={this.state.formValues.isServiceEnabled} label="Is the service enabled?" />
              </div>
              <div className={_s.toggle}>
                <Toggle iconStyle={{marginLeft: '0px'}} labelStyle={{width: '50%' }} onToggle={(e,v)=> this.onFieldChange("hasStarted", v)} toggled={this.state.formValues.hasStarted} label="Has the service started?" />
              </div>
              <div className={_s.toggle}>
                <Toggle iconStyle={{marginLeft: '0px'}} labelStyle={{width: '50%' }} onToggle={(e,v)=> this.onFieldChange("isStateful", v)} toggled={this.state.formValues.isStateful} label="Can this service be changed without affecting any other service?"/>
              </div>

              <Divider className={_s.divider} />

              <div className={_s.dropdown1}>
                <h3>Start Mode</h3>
                  <SelectField onChange={(e,v) => this.onFieldChange("startMode", v)} value={this.state.formValues.startMode} hintText="Start mode...">
                    {startModeItems}
                  </SelectField>
              </div>

              <div className={_s.dropdown2}>
                <h3>State</h3>
                  <SelectField onChange={(e,v) => this.onFieldChange("state", v)} value={this.state.formValues.state} hintText={"State of the service..."}>
                    {stateMenuItems}
                  </SelectField>
              </div>

              <Divider className={_s.divider} />

              <div className={_s.dates}>
                <h3>Order date</h3>
                <DatePicker
                  hintText={"Order Date"}
                  onChange={(e,date) => {this.onFieldChange("orderDate",date)}}
                  value={this.state.formValues.orderDate}
                />
              </div>
              <div className={_s.dates}>
                <h3>Start date</h3>
                <DatePicker
                  hintText={"Start Date"}
                  onChange={(e,date) => {this.onFieldChange("startDate",date)}}
                  value={this.state.formValues.startDate}
                />
              </div>
              <div className={_s.dates}>
                <h3>End date</h3>
                <DatePicker
                  hintText={"End Date"}
                  onChange={(e,date) => {this.onFieldChange("endDate",date)}}
                  value={this.state.formValues.endDate}
                /><br></br>
              </div>
              <Divider className={_s.divider} />
              <div>
                <h3>Service Specification</h3>
                <ObjectInput value={this.state.formValues.serviceSpecification} onChange={(v) => this.onFieldChange("serviceSpecification", v)}>
                  <TextField className={_s.objectTextField} type="name" name="name" hintText="Name of the service specification..." floatingLabelText="Name" />
                  <TextField className={_s.objectTextField} name="href" hintText="Href of the service specification..." floatingLabelText="HREF"/>
                  <TextField className={_s.objectTextField} name="version" hintText="Version of service specification..." floatingLabelText="Version" />
                </ObjectInput>
              </div>
              <Divider className={_s.divider} />
              <div>
                <h3>Related Parties</h3>
                <ListInput min={1} onChange={(v) => {this.onFieldChange("relatedParty", v)}} count={this.state.formValues.relatedParty.length} values={this.state.formValues.relatedParty} component={RelatedPartyList} />
              </div>
              <Divider className={_s.divider} />

              <div>
                <h3>Service Characteristic</h3>
                <ListInput min={0} onChange={(v) => {this.onFieldChange("serviceCharacteristic", v)}} count={this.state.formValues.serviceCharacteristic.length} values={this.state.formValues.serviceCharacteristic} component={ServiceCharacteristicList} />
              </div>
              <Divider className={_s.divider} />

              <div>
                <h3>Service Relationship</h3>
                <ListInput min={0} onChange={(v) => {this.onFieldChange("serviceRelationship", v)}} count={this.state.formValues.serviceRelationship.length} values={this.state.formValues.serviceRelationship} component={ServiceRelationshipList} />
              </div>

              <Divider className={_s.divider} />
              <div>
                <h3>Supporting Service</h3>
                <ListInput min={0} onChange={(v) => {this.onFieldChange("supportingService", v)}} count={this.state.formValues.supportingService.length} values={this.state.formValues.supportingService} component={SupportingServiceList} />
              </div>

              <Divider className={_s.divider} />

              <div>
                <h3>Supporting Resource</h3>
                <ListInput min={0} onChange={(v) => {this.onFieldChange("supportingResource", v)}} count={this.state.formValues.supportingResource.length} values={this.state.formValues.supportingResource} component={SupportingResourceList} />
              </div>
              <Divider className={_s.divider} />

              {/*Submit button, redirects to services page*/}
              <div className={_s.submit}>
                <RaisedButton onClick={()=> {
                  this.submitService();
                }}  label="Submit" primary={true} disabled={!isEnabled}/>
                {this.state.success ? <Redirect to="/services" /> : null}
              </div>

            </MuiThemeProvider>
          </div>
        </Paper>

      );
    }
}
export default mapAndConnect(ServiceForm, {
  imService: IManagedService
})
