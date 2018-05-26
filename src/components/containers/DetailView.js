import React, { Component } from 'react';
import { Paper } from 'material-ui';
import { mapAndConnect, IManagedService } from 'services';
import {lightGreen100, lightGreen600,lightGreen400, red700} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import 'typeface-roboto';
import {Redirect} from 'react-router'
import _s from 'assets/css/DetailView.css';

import { Link } from 'react-router-dom';
import { spawn } from 'child_process';


export class DetailView extends Component {
    constructor(props){
        super(props);
        this.state = {
            lastError: null,
            service: null,
            selected: null,
            tableDialog: false,
            redirect: false
        }
    }

    componentDidMount(){
        // Fetch service to edit
        const id = this.props.match.params.id;
        this.props.imService.getService(id).subscribe((service) => {
          this.setState({
              service: service,
              selected: id,
          })
        }, (err) => {
            let errorMessage = `HTTP ERROR: ${err.status} - ${err.statusText}`
          this.setState({
            errorText: err instanceof Response ? errorMessage : "Could not load service"
          })
        });
      }
      delete(service) {
          this.props.imService.deleteService(service).subscribe(() => {
              this.setState({
                  redirect: true,
                  tableDialog: false,
              });
          },
              (err) => {
              this.setState({
                  lastError: err
              });
          });
      }

    render(){
        if (!this.state.service){
            return <div/>;
        }
        if (this.state.redirect) {
            return <Redirect to='/services'/>;
        }

        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        const detailStyle = {
            page: {
                padding: '2em',
                backgroundColor: '#fbfff0',
                height: '100%',
                position: 'relative',

            },
            basic: {
                width: '30%',
                marginLeft: '2%',
                marginRight: '2%',
                display: 'inline-block',
                position: 'static',
                backgroundColor: lightGreen100,
                padding: '1em',
            },
            serviceSpec: {
                width: '20%',
                height: '280px',
                marginRight: '2%',
                display: 'inline-block',
                position: 'absolute',
                backgroundColor: lightGreen100,
                padding: '1em',
            },
            relatedParty: {
                marginTop: '0',
                width: '40%',
                height: '280px',
                display: 'inline-block',
                marginLeft: '22%',
                position: 'absolute',
                backgroundColor: lightGreen100,
                padding: '1em',
            },
            supportService: {
                width: '46%',
                margin: '2%',
                position: 'static',
                display: 'inline-block',
                backgroundColor: lightGreen100,
                padding: '1em',
            },
            supportResource: {
                width: '47%',
                marginTop: '2%',
                position: 'absolute',
                display: 'inline-block',
                backgroundColor: lightGreen100,
                padding: '1em',
            },
            note: {
                width: '46%',
                margin: '2%',
                position: 'static',
                display: 'inline-block',
                backgroundColor: lightGreen100,
            },
            place: {
                width: '47%',
                marginTop: '2%',
                position: 'absolute',
                display: 'inline-block',
                backgroundColor: lightGreen100,
            },

            headerCaptions: {
                backgroundColor: lightGreen600,
                marginTop: '0',
                color: 'white',
                height: '30px',
                paddingTop: '10px',
                paddingLeft: '25px',
                fontFamily: 'roboto',
                fontWeight: '300',
            },
            headerText: {
                fontWeight: '200',
                fontsize: '50%',
                fontFamily: 'roboto',
            },
            contentText:{
                fontWeight: '200',
                fontFamily: 'roboto',
                textDecoration: 'none',
                overflowWrap: 'break-word',
            },
            deleteButton: {
                marginRight: '5%',
                fontFamily: 'roboto',
                fontWeight: '300',
                float: 'left'

            },
            editButton: {
                float: 'left',
                marginRight: '20%',

            },
            bothButtons: {
                display: 'inline-block',
                float: 'right',
                marginTop: '1.3%',
                width: '20%',
                overflow: 'hidden',
            }
        }

        let serviceSpec = this.state.service.getServiceSpecification();

        const partyList =[];
        for (let party of this.state.service.getRelatedParty()){
          partyList.push(
            <ul style = {{listStyleType: "none"}}>
              <li>NAME: {party.name}</li>
              <li>ROLE: {party.role}</li>
              <li>HREF: {party.href}</li>
            </ul>
          )
        }

        const supportingServices = [];
        for (let supp of this.state.service.getSupportingService()){
          supportingServices.push(
              <ul style = {{listStyleType: "none"}}>
              <li>ID: {supp.id}</li>
              <li>HREF: {supp.href}</li>
              <li>Name: {supp.name}</li>
              <li>Category: {supp.category}</li>
              </ul>
          )
        }

        const supportingResources = [];
        for (let res of this.state.service.getSupportingResource()){
          supportingResources.push(
              <ul style = {{listStyleType: "none"}}>
              <li>ID:{res.id}</li>
              <li>HREF:{res.href}</li>
              <li>Name: {res.name}</li>
              </ul>
          )
        }

        const note = [];
        for (let not of this.state.service.getNote()){
          note.push(
            <ul style = {{listStyleType: "none"}}>
              <li>Author:{not.author}</li>
              <li>Date:{not.date}</li>
              <li>Text: {not.text}</li>
            </ul>
          )
        }

        const place = [];
        for (let plac of this.state.service.getPlace()){
          place.push(
            <ul style = {{listStyleType: "none"}}>
              <li>HREF:{plac.href}</li>
              <li>Role: {plac.role}</li>
            </ul>
          )
        }


        return(
            <Paper style={detailStyle.page}>
                <div style={detailStyle.bothButtons}>
                    {[<Link to = {`/services/edit/${this.state.selected}`} style={detailStyle.button}>
                      {this.props.user && this.props.user.isAdmin() ?
                        <RaisedButton
                            label = 'edit'
                            primary = {true}
                            style={detailStyle.editButton}

                        /> : null} </Link>,

                      <div style={detailStyle.deleteButton}>
                        {this.props.user && this.props.user.isAdmin() ?
                        <RaisedButton
                            label = "delete"
                            onClick = { () => this.delete(this.state.service) }

                            style={detailStyle.button}
                            secondary={true}
                        /> : null} </div>
                    ]}
                </div>
                <h1 style={detailStyle.headerText}>{this.state.service.name}</h1>
                <div><Paper style={detailStyle.basic} zDepth={1}>
                    <h4 style={detailStyle.headerCaptions}>BASIC:</h4>
                    <ul style = {{listStyleType: "none"}}>
                        <li>ID: <u style={detailStyle.contentText}>{this.state.service.id}</u></li>
                        <li>DESCRIPTION: <u style={detailStyle.contentText}> <br/>{this.state.service.description.split("\n").map((a) => <span>{a} <br/></span>)}</u> </li>
                        <li>STATUS: <u style={detailStyle.contentText}>{this.state.service.state}</u></li>
                        <li>TYPE: <u style={detailStyle.contentText}>{this.state.service.type}</u></li>
                        <li>IS SERVICE ENABLED: <u style={detailStyle.contentText}>{this.state.service.isServiceEnabled ? 'Yes' : 'No'}</u> </li>
                        <li>CATEGORY: <u style={detailStyle.contentText}>{this.state.service.category}</u></li>
                        <li>ORDER DATE: <u style={detailStyle.contentText}><br/>{this.state.service.orderDate ? this.state.service.orderDate.toLocaleDateString('en-US', options) : "None"}</u></li>
                        <li>START DATE: <u style={detailStyle.contentText}><br/>{this.state.service.startDate ? this.state.service.startDate.toLocaleDateString('en-US', options) : "None"}</u></li>
                        <li>END DATE: <u style={detailStyle.contentText}><br/>{this.state.service.endDate ? this.state.service.endDate.toLocaleDateString('en-US', options): "None"}</u></li>
                        <li>START MODE: <u style={detailStyle.contentText}>{this.state.service.startMode}</u></li>
                        <li>IS STATEFUL: <u style={detailStyle.contentText}>{this.state.service.isStateful ? 'Yes' : 'No'}</u></li>
                    </ul>
                </Paper>
                

                {serviceSpec ? 
                <Paper style={detailStyle.serviceSpec} zDepth={1}>
                    <h4 style={detailStyle.headerCaptions}>SERVICE SPECIFICATION:</h4>
                    <ul style = {{listStyleType: "none"}}>

                        <li>Name: <u style={detailStyle.contentText}>{serviceSpec.name}</u></li>
                        <li>ID: <u style={detailStyle.contentText}>{serviceSpec.id}</u></li>
                        <li>HREF: <u style={detailStyle.contentText}>{serviceSpec.href}</u></li>
                        <li>VERSION: <u style={detailStyle.contentText}>{serviceSpec.version}</u></li>
                    </ul>
                </Paper>: null}

                <Paper style={detailStyle.relatedParty} zDepth={1}>
                    <h4 style={detailStyle.headerCaptions}>RELATED PARTY:</h4>
                    {partyList}
                </Paper>
                </div>

                <div>
                <Paper style={detailStyle.supportService}>
                <h4 style={detailStyle.headerCaptions}>SUPPORTING SERVICE:</h4>
                {supportingServices}
                </Paper>

                <Paper style={detailStyle.supportResource}>
                <h4 style={detailStyle.headerCaptions}>SUPPORTING RESOURCE:</h4>
                {supportingResources}
                </Paper>
                </div>

                <div>
                  <Paper style={detailStyle.note}>
                    <h4 style={detailStyle.headerCaptions}>Note: </h4>
                    {note}
                  </Paper>

                  <Paper style={detailStyle.place}>
                    <h4 style={detailStyle.headerCaptions}>Place: </h4>
                    {place}
                  </Paper>

                </div>
            </Paper>
        );
    }
}





export default mapAndConnect(DetailView, {
    imService: IManagedService
  })