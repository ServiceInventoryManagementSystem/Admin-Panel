import React, { Component } from 'react';
import _s from 'assets/css/AdminPage.css';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import {lightGreen300, lightGreen400} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Subject} from 'rxjs';
import Snackbar from 'material-ui/Snackbar';

import CheckCircle from 'material-ui/svg-icons/action/check-circle'


import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import { Link } from 'react-router-dom';

import { mapAndConnect, IManagedService } from 'services';


import { DEFAULT_API } from 'common/constants';
import { FlatButton } from 'material-ui';



const DEFAULT_QUERY = 'redux';




export class AdminPage extends Component {
    constructor(props){
      super(props);
      this.querySubject = new Subject();
  
      this.state = {
        services: [],
        lastError: null,
        selected: null,
        open: false,
        sortingOrder: "none",
      };
    }
    componentDidMount(){
      this.querySubject.debounceTime(300).distinctUntilChanged().subscribe((a)=> {
        this.props.imService.search({name : a}).subscribe((services) => {
          this.setState({
            services: services
          });
        });
      });
      this.props.imService.getServices().subscribe((services) => {
        this.setState({
          services: services
        });
      });
    }

    handleClickTable(service){
        this.setState({
            open: true,
            selected: service,
        })
        console.log('service clicked')
    }
    
    handleClose(){
        this.setState({
            open: false,
        })
    }

    changeSorting(type){
      let serviceState = this.state.services;
      
      let order = this.state.sortingOrder;
      if (this.state.lastColumn != type){
        order = "asc"
      }
      
      serviceState.sort((a,b)=> {
        a = a[type] ? a[type] : "";
        b = b[type] ? b[type] : "";
        if(order != "decs"){
          return a.localeCompare(b);
        }
        return b.localeCompare(a);
      })
        
      this.setState({services : serviceState, lastColumn: type, sortingOrder: order != "asc" ? "asc" : "decs"});


    }



    delete(service) {
      this.props.imService.deleteService(service).subscribe(() => {
        const newState = this.state.services.slice();
        if (newState.indexOf(service) > -1){
          newState.splice(newState.indexOf(service), 1);
          this.setState({services : newState, open: false});
        }
      
      }, (err) => {
        this.setState({
          lastError: err
        });
      });
      
    }

    onChange(value){
      this.querySubject.next(value); // må gjøre så category funker, eget parameter eller objekt
    }

    clearError(){
      this.setState({
        lastError: null
      });
    }

    render() {
      const {services} = this.state;
      const serviceElements = [];
      const muiTheme = getMuiTheme({
            textField: {
                focusColor: lightGreen300,
            },
            raisedButton: {
                primaryColor: lightGreen400,
            }
      });
      for (let i in services){
        let e = services[i];
        serviceElements.push(
          <TableRow className = {_s.tableRow} onRowClick={console.log} key = {i}>
          <TableRowColumn>{e.id}</TableRowColumn>
          <TableRowColumn>{e.name}</TableRowColumn>
          <TableRowColumn>{e.href}</TableRowColumn>
          <TableRowColumn>{e.hasStarted ? 'Yes' : 'No'}</TableRowColumn>
          <TableRowColumn>{e.category}</TableRowColumn>
          <TableRowColumn className={_s[`state-${e.state}`]
          }  >{e.state}</TableRowColumn>
          </TableRow>
        )
      }

      let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      return (
        <Paper className={_s["paper-container"]}>
          <MuiThemeProvider muiTheme={muiTheme}>
          <h1>Services</h1>
          <TextField 
            onChange = {(e, v)=> this.onChange(v)}
            hintText="Search on Name"
          />
          <br />
          <Table allRowsSelected = {false} onCellClick = {(row)=> this.handleClickTable(this.state.services[row])}>
            <TableHeader>
              <TableRow  onCellClick={(event,_,idx) => {
                const columns = {
                  [6]: "state",
                  [5]: "category",                   
                }
                if(idx in columns){
                  this.changeSorting(columns[idx]);
                }
              }}>
                    <TableHeaderColumn>ID</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>href</TableHeaderColumn>
                    <TableHeaderColumn>Has started</TableHeaderColumn>
                    <TableHeaderColumn className = {_s.tableHeader}>Category</TableHeaderColumn>
                    <TableHeaderColumn className = {_s.tableHeader}>State</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            
            <TableBody>
                {serviceElements}
            </TableBody>
          </Table>
          <Snackbar
            open={this.state.lastError != null}
            message={this.state.lastError instanceof Error ? this.state.lastError.toString() : ""}
            autoHideDuration={4000}
            onRequestClose={() => this.clearError()}
          />
          {this.state.selected != null ? 
          <Dialog title = {this.state.selected.name}
          open = {this.state.open}
          onRequestClose = {() => this.handleClose()}
          actions = {[<Link to = {`/services/edit/${this.state.selected.id}`}>
            <RaisedButton
              label = 'edit'
              primary = {true}
            
            /></Link>,
          <RaisedButton
            label = "delete"
            onClick = { () => this.delete(this.state.selected)}
          />]}
          
          >
            Description: {this.state.selected.description} <br/>
            Order date: {this.state.selected.orderDate ? this.state.selected.orderDate.toLocaleDateString('en-US', options) : "None"}<br/>
            Start date: {this.state.selected.startDate ? this.state.selected.startDate.toLocaleDateString('en-US', options) : "None"}<br/>
            End date: {this.state.selected.endDate ? this.state.selected.endDate.toLocaleDateString('en-US', options): "None"}<br/>
            Start mode: {this.state.selected.startMode}<br/>
            Is stateful: {this.state.selected.isStateful ? 'Yes' : 'No'}<br/>
            Is service enabled: {this.state.selected.isServiceEnabled ? 'Yes' : 'No'} <br/>
            Category: {this.state.selected.category}<br/><br/>
            Status: {this.state.selected.state}

         
            
            
          </Dialog>
          :
          null
          }
        </MuiThemeProvider>
        </Paper>
      );
    }
}

export default mapAndConnect(AdminPage, {
  imService: IManagedService
})